'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Posts: composite index for timelines
    await queryInterface.addIndex('Posts', ['userId', 'createdAt'], {
      name: 'idx_posts_user_createdAt'
    });

    // Likes: lookup + uniqueness
    await queryInterface.addIndex('Likes', ['postId'], {
      name: 'idx_likes_postId'
    });
    await queryInterface.addIndex('Likes', ['userId'], {
      name: 'idx_likes_userId'
    });
    await queryInterface.addIndex('Likes', ['userId', 'postId'], {
      name: 'uniq_likes_user_post',
      unique: true
    });

    // Followers: lookup + uniqueness
    await queryInterface.addIndex('Followers', ['followerId'], {
      name: 'idx_followers_followerId'
    });
    await queryInterface.addIndex('Followers', ['followingId'], {
      name: 'idx_followers_followingId'
    });
    await queryInterface.addIndex('Followers', ['followerId', 'followingId'], {
      name: 'uniq_followers_pair',
      unique: true
    });

    // Notifications: common unread pagination pattern
    await queryInterface.addIndex('Notifications', ['targetUserId', 'isRead', 'createdAt'], {
      name: 'idx_notifications_target_isread_createdAt'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Posts', 'idx_posts_user_createdAt');

    await queryInterface.removeIndex('Likes', 'idx_likes_postId');
    await queryInterface.removeIndex('Likes', 'idx_likes_userId');
    await queryInterface.removeIndex('Likes', 'uniq_likes_user_post');

    await queryInterface.removeIndex('Followers', 'idx_followers_followerId');
    await queryInterface.removeIndex('Followers', 'idx_followers_followingId');
    await queryInterface.removeIndex('Followers', 'uniq_followers_pair');

    await queryInterface.removeIndex('Notifications', 'idx_notifications_target_isread_createdAt');
  }
};


