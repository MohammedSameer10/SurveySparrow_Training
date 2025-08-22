const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.USER_NAME,
    process.env.DB_PASS,
    {
        host: "localhost",
        dialect: "postgres",
        logging: false,
        benchmark: true,
         pool: {
            max: 20,       
            min: 5,         
            acquire: 30000,  
            idle: 10000      
        }
    },
    
);

sequelize.authenticate()
    .then(() => {
        console.log(`Connected to PostgreSQL DB`);
    })
    .catch((err) => {
        console.log(`Error while connecting to DB: ${err}`);
    });

module.exports = sequelize;
