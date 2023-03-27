import db from "../db";
import {DataTypes} from "sequelize";
import Ingredient from "./Ingredient";
import RecipeIngredient from "./RecipeIngredient";
import RecipeStep from "./RecipeStep";

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
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        uuid: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        source_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        main_photo_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        source_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'recipe',
    }
);

Recipe.belongsToMany(Ingredient, {
    as: 'ingredients',
    through: RecipeIngredient,
    foreignKey: 'recipe_id',
    otherKey: 'ingredient_id',
});

Recipe.hasMany(RecipeIngredient, {
    as: 'recipeIngredients',
    foreignKey: 'recipe_id',
});

Recipe.hasMany(RecipeStep, {
    as: 'steps',
    foreignKey: 'recipe_id',
});

export default Recipe;
