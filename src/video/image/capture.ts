export default function captureFromVideo(video: HTMLVideoElement): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
            reject(new Error("Could not create canvas context"));
            return;
        }
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        const base64url = canvas.toDataURL("image/png");
        resolve(base64url);
    });
}
