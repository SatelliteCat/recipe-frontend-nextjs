import Recipe from "../../models/Recipe";
import {Op} from "sequelize";

export const findByFilters = async (filters: string) => {
    return await Recipe.findAll({
        where: {
            name: {
                [Op.iLike]: `%${filters}%`,
            },
        }
    });
}

export const findByUuid = async (uuid: string) => {
    return await Recipe.findOne({
        where: {
            uuid: uuid
        },
        include: [
            'ingredients',
            'recipeIngredients',
            'steps',
        ],
    });
}
