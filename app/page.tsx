'use client';

import { useState } from 'react';
import MangaUploader from '@/components/MangaUploader';
import VideoPlayer from '@/components/VideoPlayer';

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="gradient-bg text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">📚 Manga Recap</h1>
          <p className="text-center mt-2 text-lg">AI-Powered Video Recaps for Manga & Manhwa</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">
              Transform Your Manga into Engaging Video Recaps
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Upload manga images and let AI create a narrated video recap automatically!
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md card-hover">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-bold text-xl mb-2 dark:text-white">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced AI understands manga panels and dialogue
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md card-hover">
              <div className="text-4xl mb-3">🎙️</div>
              <h3 className="font-bold text-xl mb-2 dark:text-white">Voice Narration</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Natural AI voice brings your story to life
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md card-hover">
              <div className="text-4xl mb-3">🎬</div>
              <h3 className="font-bold text-xl mb-2 dark:text-white">Video Creation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Automatic video generation with smooth transitions
              </p>
            </div>
          </div>

          {/* Upload Section */}
          {!videoUrl && (
            <MangaUploader 
              onVideoGenerated={setVideoUrl}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          )}

          {/* Video Player */}
          {videoUrl && (
            <VideoPlayer 
              videoUrl={videoUrl}
              onReset={() => setVideoUrl(null)}
            />
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-center mb-2 dark:text-white">Processing Your Manga</h3>
                <p className="text-center text-gray-600 dark:text-gray-400">
                  AI is analyzing images and generating narration...
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p>© 2026 Manga Recap - Built with AI & Love</p>
          <p className="mt-2 text-sm">
            Powered by Free AI Services: Hugging Face, OpenAI (Free tier), Edge TTS
          </p>
        </div>
      </footer>
    </div>
  );
}
