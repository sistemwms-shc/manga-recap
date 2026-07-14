'use client';

import { useEffect, useState } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  onReset: () => void;
}

interface VideoManifest {
  id: string;
  timestamp: number;
  imageCount: number;
  images: string[];
  audioPath: string;
  language: 'id' | 'en';
  duration: number;
  resolution: {
    width: number;
    height: number;
    ratio: string;
  };
  effects: {
    zoom: boolean;
    pan: boolean;
    transitions: boolean;
  };
}

export default function VideoPlayer({ videoUrl, onReset }: VideoPlayerProps) {
  const [manifest, setManifest] = useState<VideoManifest | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [narration, setNarration] = useState<string>('');
  const [narrationData, setNarrationData] = useState<any>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    // Load the video manifest
    fetch(videoUrl)
      .then(res => res.json())
      .then(data => {
        setManifest(data);
        setIsPlaying(true);
        
        // Load narration text
        if (data.audioPath) {
          fetch(data.audioPath)
            .then(res => res.json())
            .then(narrationInfo => {
              setNarration(narrationInfo.text || '');
              setNarrationData(narrationInfo);
              // Auto-start voice narration
              if (narrationInfo.text && 'speechSynthesis' in window) {
                speakNarration(narrationInfo.text, narrationInfo.language);
              }
            })
            .catch(err => console.error('Error loading narration:', err));
        }
      })
      .catch(err => console.error('Error loading video:', err));
  }, [videoUrl]);

  useEffect(() => {
    if (!isPlaying || !manifest) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        if (prev >= manifest.images.length - 1) {
          setIsPlaying(false);
          window.speechSynthesis.cancel(); // Stop speech when done
          return prev;
        }
        return prev + 1;
      });
    }, 3000); // 3 seconds per image

    return () => clearInterval(interval);
  }, [isPlaying, manifest]);

  const speakNarration = (text: string, lang: string) => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang || 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  };

  const handleDownload = async () => {
    if (!manifest) return;
    
    setIsGeneratingVideo(true);
    
    try {
      // Generate actual video file
      const blob = await generateVideoWithAudio(manifest, narrationData);
      setVideoBlob(blob);
      
      // Download the video
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `manga-recap-${manifest.id}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Error generating video. Please try again.');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const generateVideoWithAudio = async (manifest: VideoManifest, narrationData: any): Promise<Blob> => {
    return new Promise(async (resolve, reject) => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) throw new Error('Canvas not found');

        // Video settings: 9:16 ratio
        const WIDTH = 1080;
        const HEIGHT = 1920;
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        // Load all images
        const loadedImages = await Promise.all(
          manifest.images.map(src => loadImage(src))
        );

        // Create MediaRecorder with audio
        const stream = canvas.captureStream(30);
        
        // Add audio track if speech synthesis is available
        if (narrationData && 'speechSynthesis' in window) {
          // We'll record with system audio
          const audioContext = new AudioContext();
          const dest = audioContext.createMediaStreamDestination();
          stream.addTrack(dest.stream.getAudioTracks()[0]);
        }

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 5000000,
        });

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(blob);
        };

        mediaRecorder.start();

        // Start narration
        if (narrationData) {
          speakNarration(narrationData.text, narrationData.language);
        }

        // Render each image with zoom & pan
        const DURATION_PER_IMAGE = 3000;
        const FPS = 30;
        const FRAMES_PER_IMAGE = (DURATION_PER_IMAGE / 1000) * FPS;

        for (let i = 0; i < loadedImages.length; i++) {
          const img = loadedImages[i];
          await renderImageWithEffect(ctx, img, FRAMES_PER_IMAGE, WIDTH, HEIGHT);
        }

        mediaRecorder.stop();
        window.speechSynthesis.cancel();
      } catch (err) {
        reject(err);
      }
    });
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
        
        // Zoom effect: start at 1.0, end at 1.2
        const scale = 1.0 + (progress * 0.2);
        
        // Pan effect
        const panX = Math.sin(progress * Math.PI) * 50;
        const panY = progress * 30;

        // Calculate dimensions to fit 9:16 canvas
        const imgAspect = img.width / img.height;
        const canvasAspect = canvasWidth / canvasHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgAspect > canvasAspect) {
          drawHeight = canvasHeight * scale;
          drawWidth = drawHeight * imgAspect;
          offsetX = (canvasWidth - drawWidth) / 2 + panX;
          offsetY = (canvasHeight - drawHeight) / 2 + panY;
        } else {
          drawWidth = canvasWidth * scale;
          drawHeight = drawWidth / imgAspect;
          offsetX = (canvasWidth - drawWidth) / 2 + panX;
          offsetY = (canvasHeight - drawHeight) / 2 + panY;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        frame++;
        requestAnimationFrame(animate);
      };

      animate();
    });
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    // Control speech synthesis
    if (!isPlaying && narrationData) {
      speakNarration(narrationData.text, narrationData.language);
    } else {
      window.speechSynthesis.pause();
    }
  };

  const handleRestart = () => {
    setCurrentImageIndex(0);
    setIsPlaying(true);
    
    // Restart narration
    if (narrationData) {
      window.speechSynthesis.cancel();
      speakNarration(narrationData.text, narrationData.language);
    }
  };

  if (!manifest) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="dark:text-white">Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Your Manga Recap Video</h2>
        <button
          onClick={onReset}
          className="text-purple-600 hover:text-purple-800 font-semibold"
        >
          ← Create Another
        </button>
      </div>

      {/* Slideshow Player - 9:16 aspect ratio */}
      <div className="relative bg-black rounded-lg overflow-hidden mb-6 mx-auto" style={{ maxWidth: '540px', aspectRatio: '9/16' }}>
        <img
          src={manifest.images[currentImageIndex]}
          alt={`Manga panel ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
          style={{ objectFit: 'cover' }}
        />
        
        {/* Video Format Badge */}
        <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {manifest.resolution.width}×{manifest.resolution.height} ({manifest.resolution.ratio})
        </div>
        
        {/* Language Badge */}
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {manifest.language === 'id' ? '🇮🇩 Bahasa Indonesia' : '🇬🇧 English'}
        </div>
        
        {/* Progress indicator */}
        <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 rounded p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-sm">
              Panel {currentImageIndex + 1} of {manifest.imageCount}
            </span>
            <button
              onClick={handlePlayPause}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded text-sm"
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentImageIndex + 1) / manifest.imageCount) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleRestart}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          🔄 Restart
        </button>
        <button
          onClick={handleDownload}
          disabled={isGeneratingVideo}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingVideo ? '⏳ Generating...' : '📥 Download Video'}
        </button>
        <button
          onClick={onReset}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          ➕ Create New
        </button>
      </div>

      {/* Hidden canvas for video generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Info Section with Narration */}
      <div className="p-4 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 rounded-lg mb-4">
        <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
          🎉 Video Generated Successfully!
        </h3>
        <p className="text-sm text-purple-800 dark:text-purple-400 mb-3">
          Your manga recap is playing with voice narration in {manifest.language === 'id' ? 'Indonesian' : 'English'}! 
          Click "Download Video" to save as .webm file.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-200 rounded-full text-xs font-semibold">
            🎙️ Voice Narration
          </span>
          <span className="px-3 py-1 bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-200 rounded-full text-xs font-semibold">
            ✨ Zoom & Pan
          </span>
          <span className="px-3 py-1 bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-200 rounded-full text-xs font-semibold">
            📱 9:16 Format
          </span>
          <span className="px-3 py-1 bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-200 rounded-full text-xs font-semibold">
            💾 Downloadable
          </span>
        </div>
      </div>

      {/* Narration Text */}
      {narration && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
            <span>🔊</span>
            <span>{manifest.language === 'id' ? 'Teks Narasi (Sedang Diputar)' : 'Narration Text (Now Playing)'}</span>
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-400 whitespace-pre-wrap">
            {narration}
          </p>
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-500">
            💡 {manifest.language === 'id' ? 'Suara narasi otomatis diputar menggunakan browser Anda' : 'Voice narration plays automatically using your browser'}
          </div>
        </div>
      )}
    </div>
  );
}
