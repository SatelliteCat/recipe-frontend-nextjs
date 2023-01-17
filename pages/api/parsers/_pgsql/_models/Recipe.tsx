import db from "../db";
import {DataTypes} from "sequelize";

const Recipe = db.define(
    'recipe',
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
        },
        source_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        source_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        timestamps: false,
        tableName: 'recipe',
    }
);

export default Recipe;
