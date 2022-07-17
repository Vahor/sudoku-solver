import { binaryImage, bufferToPixelData, tensorToImage } from './../../video/image/tensorflow';
import { NextApiRequest, NextApiResponse } from "next";
import { imageToTensor } from "../../video/image/tensorflow";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method not allowed');
        return;
    }

    // An image is sent as a base64url encoded string
    const base64url = req.body.image;
    const threshold = req.body.threshold;
    // Extract the image data from the base64url encoded string
    const imageBuffer = Buffer.from(base64url.replace(/^data:image\/png;base64,/, ""), 'base64');

    // Apply transformations
    const tensorImage = await imageToTensor( bufferToPixelData(imageBuffer));
    const tfBinaryImage = await binaryImage(tensorImage);
    const [height, width] = tensorImage.shape;

    const result = await tensorToImage(tfBinaryImage);

    // Send the result
    res.status(200).json({
        image: result
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