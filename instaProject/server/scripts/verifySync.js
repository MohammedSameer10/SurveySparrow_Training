/* eslint-disable no-console */
const models = require('../model');
const { registerModelHooks } = require('../opensearch/sync');
const client = require('../opensearch/client');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function getUserDoc(id) {
  try {
    const res = await client.get({ index: 'users', id });
    return { found: true, _source: (res.body ? res.body._source : res._source) };
  } catch (err) {
    if (err?.meta?.statusCode === 404) return { found: false };
    throw err;
  }
}

async function main() {
  try {
    registerModelHooks(models);

    const ts = Date.now();
    const username = `sync_test_${ts}`;
    const email = `sync_test_${ts}@example.com`;
    const password = 'StrongP@ssw0rd!';

    console.log('Creating user in Postgres...');
    const user = await models.User.create({ username, email, password, bio: 'initial bio' });
    console.log('Created user id:', user.id);

    // Give a tiny moment for async hook to finish (client.index is async)
    await sleep(250);

    console.log('Verifying index exists in OpenSearch...');
    let doc = await getUserDoc(user.id);
    if (!doc.found) throw new Error('User doc not found in OpenSearch after create');
    if (doc._source.username !== username) throw new Error('Indexed username mismatch');
    console.log('Create verified');

    console.log('Updating user bio...');
    user.bio = 'updated bio';
    await user.save();
    await sleep(250);
    doc = await getUserDoc(user.id);
    if (!doc.found || doc._source.bio !== 'updated bio') throw new Error('User doc not updated in OpenSearch');
    console.log('Update verified');

    console.log('Deleting user...');
    await user.destroy();
    await sleep(250);
    doc = await getUserDoc(user.id);
    if (doc.found) throw new Error('User doc still present in OpenSearch after delete');
    console.log('Delete verified');

    console.log('Sync verification PASSED');
    process.exit(0);
  } catch (err) {
    console.error('Sync verification FAILED:', err);
    process.exit(1);
  } finally {
    try { await models.sequelize.close(); } catch {}
  }
}

main();


