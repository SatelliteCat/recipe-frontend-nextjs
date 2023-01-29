import {NextApiRequest, NextApiResponse} from "next";
import {findByUuid} from "../../../../storage/pgsql/repository/recipe/RecipeRepository";

type ResponseData = {};

const Handler = async (req: NextApiRequest, res: NextApiResponse<ResponseData | null>) => {
    const {uuid} = req.query as { uuid: string };

    const recipe = await findByUuid(uuid);

    res.status(200).json(recipe);
}

export default Handler;
