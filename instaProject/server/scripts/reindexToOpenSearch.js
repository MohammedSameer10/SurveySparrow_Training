/* eslint-disable no-console */
const { Client } = require('@opensearch-project/opensearch');
const models = require('../model');

const OPENSEARCH_NODE = process.env.OPENSEARCH_NODE || 'http://localhost:9200';
const OPENSEARCH_USERNAME = process.env.OPENSEARCH_USERNAME || 'admin';
const OPENSEARCH_PASSWORD = process.env.OPENSEARCH_PASSWORD || 'Sameer@1011';

const client = new Client({
  node: OPENSEARCH_NODE,
  auth: { username: OPENSEARCH_USERNAME, password: OPENSEARCH_PASSWORD },
  ssl: { rejectUnauthorized: false }
});

const indexDefinitions = {
  users: {
    settings: { number_of_shards: 1, number_of_replicas: 1 },
    mappings: {
      dynamic: true,
      properties: {
        id: { type: 'keyword' },
        username: { type: 'text', fields: { raw: { type: 'keyword' } } },
        bio: { type: 'text' },
        password: { type: 'keyword', index: false },
        email: { type: 'keyword' },
        profileImage: { type: 'binary' },
        image: { type: 'keyword' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' }
      }
    }
  },
  posts: {
    settings: { number_of_shards: 1, number_of_replicas: 1 },
    mappings: {
      dynamic: true,
      properties: {
        id: { type: 'keyword' },
        userId: { type: 'keyword' },
        caption: { type: 'text', fields: { raw: { type: 'keyword' } } },
        image: { type: 'binary' },
        imagePath: { type: 'keyword' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' }
      }
    }
  },
  likes: {
    settings: { number_of_shards: 1, number_of_replicas: 1 },
    mappings: {
      dynamic: true,
      properties: {
        id: { type: 'keyword' },
        userId: { type: 'keyword' },
        postId: { type: 'keyword' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' }
      }
    }
  },
  followers: {
    settings: { number_of_shards: 1, number_of_replicas: 1 },
    mappings: {
      dynamic: true,
      properties: {
        id: { type: 'keyword' },
        followerId: { type: 'keyword' },
        followingId: { type: 'keyword' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' }
      }
    }
  },
  notifications: {
    settings: { number_of_shards: 1, number_of_replicas: 1 },
    mappings: {
      dynamic: true,
      properties: {
        id: { type: 'keyword' },
        message: { type: 'text', fields: { raw: { type: 'keyword' } } },
        isRead: { type: 'boolean' },
        targetUserId: { type: 'keyword' },
        senderUserId: { type: 'keyword' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' }
      }
    }
  }
};

async function ensureIndex(name, definition) {
  const exists = await client.indices.exists({ index: name });
  if (exists.body === true || exists === true) {
    console.log(`Index '${name}' already exists`);
    return;
  }
  console.log(`Creating index '${name}'`);
  await client.indices.create({ index: name, body: definition });
}

function toPlain(instance) {
  const json = instance.toJSON();
//   if (json.profileImage instanceof Buffer) delete json.profileImage;
//   if (json.image instanceof Buffer) delete json.image;
  if (json.createdAt instanceof Date) json.createdAt = json.createdAt.toISOString();
  if (json.updatedAt instanceof Date) json.updatedAt = json.updatedAt.toISOString();
  return json;
}

async function bulkIndex(indexName, rows) {
  if (!rows.length) return;
  const body = [];
  for (const row of rows) {
    const src = toPlain(row);
    const docId = src.id;
    body.push({ index: { _index: indexName, _id: docId } });
    body.push(src);
  }
  const resp = await client.bulk({ refresh: 'false', body });
  if (resp.body ? resp.body.errors : resp.errors) {
    const items = resp.body ? resp.body.items : resp.items;
    const firstError = items.find(i => i.index && i.index.error)?.index?.error;
    throw new Error(`Bulk indexing errors in ${indexName}: ${firstError ? JSON.stringify(firstError) : 'see items'}`);
  }
}

async function reindexModel(model, indexName, attributes) {
  const pageSize = 1000;
  let offset = 0;
  const total = await model.count();
  console.log(`Reindexing ${indexName}: ${total} rows`);
  while (true) {
    const rows = await model.findAll({ attributes, limit: pageSize, offset, order: [['createdAt', 'ASC']] });
    if (!rows.length) break;
    await bulkIndex(indexName, rows);
    offset += rows.length;
    console.log(`  Indexed ${Math.min(offset, total)} / ${total}`);
  }
}

async function main() {
  try {
    const info = await client.info();
    console.log(`Connected to OpenSearch`);

    // Ensure indexes exist
    for (const [name, def] of Object.entries(indexDefinitions)) {
      await ensureIndex(name, def);
    }

    await reindexModel(models.User, 'users', { exclude: ['profileImage'] });

    await reindexModel(models.Post, 'posts', { exclude: ['image'] });

    await reindexModel(models.Like, 'likes');

    // 
    await reindexModel(models.Follower, 'followers');

    await reindexModel(models.Notification, 'notifications');

    console.log('All done.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    try { await models.sequelize.close(); } catch {}
  }
}

main();


