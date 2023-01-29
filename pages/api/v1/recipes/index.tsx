import {NextApiRequest, NextApiResponse} from "next";
import {findByFilters} from "../../../../storage/pgsql/repository/recipe/RecipeRepository";

type ResponseData = {};

const Handler = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
    const {search} = req.query as { search: string };

    const recipes = await findByFilters(search);

    res.status(200).json(recipes);
}

export default Handler;
