const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.USER_NAME,
    process.env.DB_PASS,
    {
        host: "localhost",
        dialect: "postgres",
        logging: false 
    }
);

sequelize.authenticate()
    .then(() => {
        console.log(`Connected to PostgreSQL DB`);
    })
    .catch((err) => {
        console.log(`Error while connecting to DB: ${err}`);
    });

module.exports = sequelize;
