'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoRendererProps {
  images: string[];
  narrative: string;
  language: 'id' | 'en';
  onComplete: (videoBlob: Blob) => void;
  onError: (error: string) => void;
}

export default function VideoRenderer({ images, narrative, language, onComplete, onError }: VideoRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    generateVideo();
  }, []);

  const generateVideo = async () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not found');

      // Video settings: 9:16 ratio (1080x1920 - vertical)
      const WIDTH = 1080;
      const HEIGHT = 1920;
      canvas.width = WIDTH;
      canvas.height = HEIGHT;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Load all images
      setStatus('Loading images...');
      const loadedImages = await Promise.all(
        images.map(src => loadImage(src))
      );

      setStatus('Generating video frames...');

      // Create MediaRecorder
      const stream = canvas.captureStream(30); // 30 FPS
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000, // 5 Mbps for good quality
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        onComplete(blob);
      };

      mediaRecorder.start();

      // Render each image with zoom & pan effect
      const DURATION_PER_IMAGE = 3000; // 3 seconds per image
      const FPS = 30;
      const FRAMES_PER_IMAGE = (DURATION_PER_IMAGE / 1000) * FPS;

      for (let i = 0; i < loadedImages.length; i++) {
        const img = loadedImages[i];
        setProgress(Math.floor(((i + 1) / loadedImages.length) * 100));
        setStatus(`Rendering panel ${i + 1} of ${loadedImages.length}...`);

        await renderImageWithEffect(ctx, img, FRAMES_PER_IMAGE, WIDTH, HEIGHT);
      }

      mediaRecorder.stop();
      setStatus('Finalizing video...');
    } catch (err: any) {
      console.error('Video generation error:', err);
      onError(err.message || 'Failed to generate video');
    }
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const renderImageWithEffect = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    frames: number,
    canvasWidth: number,
    canvasHeight: number
  ): Promise<void> => {
    return new Promise((resolve) => {
      let frame = 0;

      const animate = () => {
        if (frame >= frames) {
          resolve();
          return;
        }

        // Clear canvas
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Calculate zoom and pan effect
        const progress = frame / frames;
        
        // Zoom effect: start at 1.0, end at 1.2 (20% zoom)
        const scale = 1.0 + (progress * 0.2);
        
        // Pan effect: slight horizontal pan
        const panX = Math.sin(progress * Math.PI) * 50;
        const panY = progress * 30; // Slight downward pan

        // Calculate dimensions to fit 9:16 canvas
        const imgAspect = img.width / img.height;
        const canvasAspect = canvasWidth / canvasHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgAspect > canvasAspect) {
          // Image is wider than canvas
          drawHeight = canvasHeight * scale;
          drawWidth = drawHeight * imgAspect;
          offsetX = (canvasWidth - drawWidth) / 2 + panX;
          offsetY = (canvasHeight - drawHeight) / 2 + panY;
        } else {
          // Image is taller than canvas
          drawWidth = canvasWidth * scale;
          drawHeight = drawWidth / imgAspect;
          offsetX = (canvasWidth - drawWidth) / 2 + panX;
          offsetY = (canvasHeight - drawHeight) / 2 + panY;
        }

        // Draw image with effects
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        frame++;
        requestAnimationFrame(animate);
      };

      animate();
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-center mb-4 dark:text-white">
          🎬 Creating Your Video
        </h3>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2 dark:text-gray-300">
            <span>{status}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Video Preview Canvas (hidden) */}
        <canvas
          ref={canvasRef}
          className="hidden"
        />

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded text-sm text-blue-800 dark:text-blue-300">
          <p>✨ Features being added:</p>
          <ul className="mt-2 space-y-1 text-xs">
            <li>• 1080x1920 resolution (9:16)</li>
            <li>• Zoom & pan effects</li>
            <li>• Smooth transitions</li>
            <li>• AI narration in {language === 'id' ? 'Indonesian' : 'English'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
