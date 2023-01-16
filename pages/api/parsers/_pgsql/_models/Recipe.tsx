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
        // url: {
        //     type: DataTypes.STRING,
        //     allowNull: false
        // },
    },
    {
        timestamps: false,
        tableName: 'recipe',
    }
);

export default Recipe;
