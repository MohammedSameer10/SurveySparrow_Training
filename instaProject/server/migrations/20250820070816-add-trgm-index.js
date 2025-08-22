'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `CREATE INDEX idx_user_username_trgm ON "Users" USING GIN (username gin_trgm_ops);`
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      `DROP INDEX IF EXISTS idx_user_username_trgm;`
    );
  }
};
