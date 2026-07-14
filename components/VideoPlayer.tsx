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
  duration: number;
}

export default function VideoPlayer({ videoUrl, onReset }: VideoPlayerProps) {
  const [manifest, setManifest] = useState<VideoManifest | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Load the video manifest
    fetch(videoUrl)
      .then(res => res.json())
      .then(data => {
        setManifest(data);
        setIsPlaying(true);
      })
      .catch(err => console.error('Error loading video:', err));
  }, [videoUrl]);

  useEffect(() => {
    if (!isPlaying || !manifest) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        if (prev >= manifest.images.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3000); // 3 seconds per image

    return () => clearInterval(interval);
  }, [isPlaying, manifest]);

  const handleDownload = () => {
    if (!manifest) return;
    
    // Download all images as a zip would require additional library
    // For now, download the first image as a sample
    const link = document.createElement('a');
    link.href = manifest.images[0];
    link.download = 'manga-recap-sample.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentImageIndex(0);
    setIsPlaying(true);
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

      {/* Slideshow Player */}
      <div className="relative bg-black rounded-lg overflow-hidden mb-6" style={{ minHeight: '500px' }}>
        <img
          src={manifest.images[currentImageIndex]}
          alt={`Manga panel ${currentImageIndex + 1}`}
          className="w-full h-auto max-h-[600px] object-contain"
        />
        
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
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          📥 Download Images
        </button>
        <button
          onClick={onReset}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          ➕ Create New
        </button>
      </div>

      {/* Info Section */}
      <div className="p-4 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 rounded-lg">
        <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
          🎉 Slideshow Generated Successfully!
        </h3>
        <p className="text-sm text-purple-800 dark:text-purple-400">
          Your manga recap is ready! Watch the automatic slideshow or use the controls to navigate manually.
          Each panel displays for 3 seconds.
        </p>
      </div>
    </div>
  );
}
