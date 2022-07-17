import * as tf from '@tensorflow/tfjs';
import * as tfc from '@tensorflow/tfjs-core';

export const tensorToImage = async (tensor: tf.Tensor3D) => {
    return await tf.browser.toPixels(tensor);
}

export const imageToTensor = async (data: tf.PixelData) => {
    const tensor = tf.browser.fromPixels(data);
    return tensor;
}

export const bufferToPixelData = (buffer: Buffer): tf.PixelData => {
    const data = new Uint8Array(buffer);
    const width = data[0]!;
    const height = data[1]!;
    const pixelData = new Uint8Array(data.length - 2);
    for (let i = 2; i < data.length; i++) {
        pixelData[i - 2]! = data[i]!;
    }
    return { width, height, data: pixelData };
}


export const binaryImage = async (tensorBWImage: tfc.Tensor3D): Promise<tfc.Tensor3D> => {
    let binarized: tfc.Tensor3D = tensorBWImage.clone();
    tf.tidy(() => {

        // grayscale, we want 1 channel
        const tensorImage = binarized.mean(2);

        // Blur the image to remove noise.
        // const gaussian: tfc.Tensor<tfc.Rank.R4> = boxBlurFilter(23).expandDims(-1).expandDims(-1);

        // // Apply the gaussian blur.
        // binarized = binarized.conv2d(gaussian, 1, 'same');




        // const dark = tfc.zerosLike(binarized);
        // const white = tfc.onesLike(binarized).asType('float32');

        // binarized = tfc.keep(tfc.where(tfc.greater(tensorImage.sub(tensorBWImage), 20), white, dark));
    });


    return binarized;

}

export const boxBlurFilter = (size: number): tfc.Tensor<tfc.Rank.R2> => {
    const rectified = size % 2 === 0 ? Math.floor(size / 2) : Math.floor((size + 1) / 2);
    const side = rectified % 2 === 0 ? rectified + 1 : rectified;
    if (side % 2 === 0) {
        throw Error('Side of the filter must be odd!')
    }
    const values = Array.from(new Array(side * side).keys()).fill(1);
    const total = values.reduce((sum, val) => sum + val, 0);

    return tfc.tensor(values.map(v => v / total), [side, side]);
}

