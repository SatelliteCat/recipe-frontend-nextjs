import db from "../db";
import {DataTypes} from "sequelize";

const RecipeIngredient = db.define(
    'recipe_ingredient',
    {
        recipe_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        ingredient_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        size_text: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        timestamps: false,
        tableName: 'recipe_ingredient',
    }
);

export default RecipeIngredient;
