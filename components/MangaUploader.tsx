'use client';

import { useState, useRef } from 'react';

interface MangaUploaderProps {
  onVideoGenerated: (url: string) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
}

export default function MangaUploader({ onVideoGenerated, isProcessing, setIsProcessing }: MangaUploaderProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setError('Please select valid image files');
      return;
    }

    if (imageFiles.length > 50) {
      setError('Maximum 50 images allowed');
      return;
    }

    setImages(imageFiles);
    setError('');

    // Create previews
    const previewUrls = imageFiles.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleGenerate = async () => {
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      const response = await fetch('/api/generate-recap', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate video');
      }

      const data = await response.json();
      onVideoGenerated(data.videoUrl);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the video');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Upload Manga Images</h2>

      {/* File Input */}
      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="w-full py-4 px-6 border-2 border-dashed border-purple-400 rounded-lg hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-center">
            <div className="text-4xl mb-2">📁</div>
            <p className="text-lg font-semibold dark:text-white">Click to upload manga images</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              PNG, JPG, JPEG (Max 50 images)
            </p>
          </div>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3 dark:text-white">
            Selected Images ({previews.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded border-2 border-gray-200 dark:border-gray-600"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isProcessing}
                >
                  ×
                </button>
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      {images.length > 0 && (
        <button
          onClick={handleGenerate}
          disabled={isProcessing}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Generating...' : '🎬 Generate Video Recap'}
        </button>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Tips:</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
          <li>• Upload images in reading order for best results</li>
          <li>• Clear, high-quality images work best</li>
          <li>• Processing takes 1-2 minutes depending on image count</li>
        </ul>
      </div>
    </div>
  );
}
