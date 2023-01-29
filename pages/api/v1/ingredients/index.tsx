import {NextApiRequest, NextApiResponse} from "next";
import {findByFilters} from "../../../../storage/pgsql/repository/recipe/RecipeRepository";

type ResponseData = {};

const Handler = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
    res.status(200).json([]);
}

export default Handler;
