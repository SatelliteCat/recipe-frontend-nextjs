import {Sequelize} from "sequelize";

const db = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5440,
    username: 'postgres',
    password: 'root',
    database: 'recipe',
    pool: {
        max: 10,
        min: 0,
        acquire: 30_000,
        idle: 10_000
    },
});

export default db;
