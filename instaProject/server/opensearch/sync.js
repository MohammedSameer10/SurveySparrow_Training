const client = require('./client');

async function indexDoc(index, instance) {
  const body = instance.toJSON();
 
  if (Buffer.isBuffer(body.profileImage)) delete body.profileImage;
  if (Buffer.isBuffer(body.image)) delete body.image;
  await client.index({ index, id: body.id, body, refresh: 'false' });
}

async function deleteDoc(index, id) {
  try {
    await client.delete({ index, id, refresh: 'false' });
  } catch (err) {
    if (err?.meta?.statusCode === 404) return; 
    throw err;
  }
}

function registerModelHooks(models) {
 
  models.User.addHook('afterCreate', async (instance) => indexDoc('users', instance));
  models.User.addHook('afterUpdate', async (instance) => indexDoc('users', instance));
  models.User.addHook('afterDestroy', async (instance) => deleteDoc('users', instance.id));

 
  models.Post.addHook('afterCreate', async (instance) => indexDoc('posts', instance));
  models.Post.addHook('afterUpdate', async (instance) => indexDoc('posts', instance));
  models.Post.addHook('afterDestroy', async (instance) => deleteDoc('posts', instance.id));

 
  models.Like.addHook('afterCreate', async (instance) => indexDoc('likes', instance));
  models.Like.addHook('afterUpdate', async (instance) => indexDoc('likes', instance));
  models.Like.addHook('afterDestroy', async (instance) => deleteDoc('likes', instance.id));

  
  models.Follower.addHook('afterCreate', async (instance) => indexDoc('followers', instance));
  models.Follower.addHook('afterUpdate', async (instance) => indexDoc('followers', instance));
  models.Follower.addHook('afterDestroy', async (instance) => deleteDoc('followers', instance.id));

 
  models.Notification.addHook('afterCreate', async (instance) => indexDoc('notifications', instance));
  models.Notification.addHook('afterUpdate', async (instance) => indexDoc('notifications', instance));
  models.Notification.addHook('afterDestroy', async (instance) => deleteDoc('notifications', instance.id));
}

module.exports = { registerModelHooks };


