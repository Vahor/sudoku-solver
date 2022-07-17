import React, { useEffect, useRef, useState } from 'react'
import Processor, { VideoReadyPayload } from '../video/processor';
import toast from "react-hot-toast";
import { toastProps } from "../utils/toast";

export interface VideoProcessorProps {
}

const processor = new Processor();

export const VideoProcessor = ({ }: VideoProcessorProps) => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [videoWidth, setVideoWidth] = useState(100);
  const [videoHeight, setVideoHeight] = useState(100);

  useEffect(() => {
    const video = videoRef.current;
    if (video && !processor.video) {
      processor.startVideo(video).then(
        () => toast.success("Video started", toastProps),
        (error) => console.error(error.message)
      ).catch(error => console.error(error.message));
    }

    return () => {
      if(processor.video){
        toast.success("Video stopped", toastProps);
        processor.stopVideo();
      }
    }
  }, [videoRef]);

  // render the overlay
  useEffect(() => {
    const interval = window.setInterval(() => {
      const canvas = previewCanvasRef.current;
      if (canvas && processor.isVideoRunning) {
        // update the peformance stats
        // display the output from the processor
        const context = canvas.getContext("2d");
        if (context && processor.image) {
          context.putImageData(processor.image, 0, 0);
        }
      }
    }, 100);
    return () => {
      window.clearInterval(interval);
    };
  }, [previewCanvasRef]);

  // update the video scale as needed
  useEffect(() => {
    function videoReadyListener({ width, height }: VideoReadyPayload) {
      setVideoWidth(width);
      setVideoHeight(height);
    }
    processor.on("videoReady", videoReadyListener);
    return () => {
      processor.off("videoReady", videoReadyListener);
    };
  });

  return <div>
    <video
      ref={videoRef}
      width={0}
      height={0}
      playsInline
      muted
    />
    <canvas
     className="w-full aspect-square p-4 fade-2 h-[24rem] md:h-[32rem]"
      ref={previewCanvasRef}
      width={videoWidth}
      height={videoHeight}
    />
  </div>;
}