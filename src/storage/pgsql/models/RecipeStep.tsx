import db from "../db";
import {DataTypes} from "sequelize";

const RecipeStep = db.define(
    'recipe_step',
    {
        recipe_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        step: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        text: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        timestamps: false,
        tableName: 'recipe_step',
    }
);

export default RecipeStep;
