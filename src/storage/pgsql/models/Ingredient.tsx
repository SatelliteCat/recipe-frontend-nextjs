import db from "../db";
import {DataTypes} from "sequelize";

const Ingredient = db.define(
    'ingredient',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        uuid: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        main_photo_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'ingredient',
    }
);

export default Ingredient;
