import { StrictEventEmitter } from "strict-event-emitter";
import captureFromVideo from "./image/capture";

export interface VideoReadyPayload { width: number, height: number }

interface ProcessorEvents {
    videoReady: (
        { width, height }: VideoReadyPayload
    ) => void;
}

export default class Processor extends (StrictEventEmitter as {
    new(): StrictEventEmitter<ProcessorEvents>;
}) {

    image?: ImageData;
    video?: HTMLVideoElement;
    isVideoRunning: boolean = false;
    isProcessing: boolean = false;

    async startVideo(video: HTMLVideoElement) {
        if (this.video) {
            return;
        }
        this.video = video;
        // start up the video feed
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment", width: 640 },
            audio: false,
        });
        // grab the video dimensions once it has started up
        const canPlayListener = () => {
            video.removeEventListener("canplay", canPlayListener);
            this.emit("videoReady", {
                width: video.videoWidth,
                height: video.videoHeight,
            });
            this.isVideoRunning = true;
            // start processing
            this.processFrame();
        };

        this.video.addEventListener("canplay", canPlayListener);
        this.video.srcObject = stream;
        this.video.play();
    }

    async stopVideo() {
        if (this.video) {
            this.video.pause();
            this.video.srcObject = null;
            this.isVideoRunning = false;
            this.isProcessing = false;
            this.video = undefined;
        }
    }

    async processFrame() {
        if (!this.isVideoRunning || this.isProcessing || !this.video) {
            return;
        }
        try {
            this.isProcessing = true;
            // grab an image from the video camera
            const base64url = await captureFromVideo(this.video);
            // Call the api route /api/process with the image in a POST request
            this.image = await this.callApi(base64url);

        } catch (e) {
            console.error(e);
        }
        finally {
            // schedule the next frame for processing
            this.isProcessing = false;
            setTimeout(() => this.processFrame(), 120);
        }
    }

    async callApi(base64url: string): Promise<ImageData> {
        const result = await fetch("/api/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                image: base64url,
                threshold: 20,
            }),
        });

        const json = await result.json();

        return new ImageData(new Uint8ClampedArray(json.image.data), this.video!.videoWidth, this.video!.videoHeight);

    }

}