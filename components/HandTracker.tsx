
import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { HandData } from '../types';

interface HandTrackerProps {
  onUpdate: (data: HandData) => void;
}

const HandTracker: React.FC<HandTrackerProps> = ({ onUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    async function init() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      
      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 1
      });

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
    }

    init();

    return () => {
      cancelAnimationFrame(requestRef.current);
      landmarkerRef.current?.close();
    };
  }, []);

  const detect = () => {
    if (landmarkerRef.current && videoRef.current && videoRef.current.readyState >= 2) {
      const results = landmarkerRef.current.detectForVideo(videoRef.current, performance.now());
      
      if (results.landmarks && results.landmarks.length > 0) {
        const hand = results.landmarks[0];
        
        // Basic gesture detection logic
        // Index: 8, Thumb: 4, Pinky: 20, Middle: 12, Ring: 16
        const distancePinch = Math.sqrt(
          Math.pow(hand[8].x - hand[4].x, 2) + 
          Math.pow(hand[8].y - hand[4].y, 2)
        );

        // Open hand if most fingers are extended
        let extendedFingers = 0;
        if (hand[8].y < hand[6].y) extendedFingers++;
        if (hand[12].y < hand[10].y) extendedFingers++;
        if (hand[16].y < hand[14].y) extendedFingers++;
        if (hand[20].y < hand[18].y) extendedFingers++;

        let gesture: HandData['gesture'] = 'none';
        if (distancePinch < 0.05) gesture = 'pinch';
        else if (extendedFingers >= 3) gesture = 'open';
        else gesture = 'fist';

        onUpdate({
          x: (hand[0].x - 0.5) * 2,
          y: (hand[0].y - 0.5) * -2,
          gesture,
          detected: true
        });
      } else {
        onUpdate({ x: 0, y: 0, gesture: 'none', detected: false });
      }
    }
    requestRef.current = requestAnimationFrame(detect);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(detect);
  }, []);

  return (
    <video 
      ref={videoRef} 
      className="fixed bottom-4 right-4 w-48 h-36 rounded-lg border-2 border-pink-500/50 grayscale opacity-40 mirror z-50 pointer-events-none"
      style={{ transform: 'scaleX(-1)' }}
      muted 
      playsInline
    />
  );
};

export default HandTracker;
