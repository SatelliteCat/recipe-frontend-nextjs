import {Op} from "sequelize";
import Ingredient from "../../models/Ingredient";

export const findByFilters = async (filters: string) => {
    return await Ingredient.findAll({
        where: {
            name: {
                [Op.iLike]: `%${filters}%`,
            },
        }
    });
}

export const findByUuid = async (uuid: string) => {
    return await Ingredient.findOne({
        where: {
            uuid: uuid
        },
    });
}
