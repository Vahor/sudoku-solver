import { boxBlurFilter } from './../../video/image/tensorflow';
import { NextApiRequest, NextApiResponse } from "next";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
   
    // Send the result
    res.status(200).json({
        box:  boxBlurFilter(23).expandDims(-1).expandDims(-1),
    });
}

export default handler;

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
}