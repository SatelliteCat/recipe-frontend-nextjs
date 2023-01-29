import {Sequelize} from "sequelize";

// @ts-ignore
const db = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    pool: {
        max: 10,
        min: 0,
        acquire: 30_000,
        idle: 10_000,
    },
    logging: false,
});

export default db;
