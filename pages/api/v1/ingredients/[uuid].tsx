import {NextApiRequest, NextApiResponse} from "next";
import {findByUuid} from "../../../../storage/pgsql/repository/ingredient/IngredientRepository";

type ResponseData = {};

const Handler = async (req: NextApiRequest, res: NextApiResponse<ResponseData | null>) => {
    const {uuid} = req.query as { uuid: string };

    const ingredient = await findByUuid(uuid);

    res.status(200).json(ingredient);
}

export default Handler;
