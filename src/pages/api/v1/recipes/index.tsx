import {NextApiRequest, NextApiResponse} from "next";
import {findAll, findByFilters} from "@/storage/pgsql/repository/recipe/RecipeRepository";

type ResponseData = {};

const Handler = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
    const {search} = req.query as { search: string };

    let recipes = await findByFilters(search);

    if (recipes.length < 1) {
        recipes = await findAll();
    }

    res.status(200).json(recipes);
}

export default Handler;
