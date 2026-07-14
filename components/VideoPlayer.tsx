'use client';

interface VideoPlayerProps {
  videoUrl: string;
  onReset: () => void;
}

export default function VideoPlayer({ videoUrl, onReset }: VideoPlayerProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'manga-recap.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

      {/* Video Player */}
      <div className="relative bg-black rounded-lg overflow-hidden mb-6">
        <video
          src={videoUrl}
          controls
          className="w-full max-h-[600px]"
          autoPlay
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleDownload}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          📥 Download Video
        </button>
        <button
          onClick={onReset}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          🔄 Create New Recap
        </button>
      </div>

      {/* Share Section */}
      <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20 rounded-lg">
        <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
          🎉 Video Generated Successfully!
        </h3>
        <p className="text-sm text-purple-800 dark:text-purple-400">
          Your manga recap video is ready to watch and share. Download it or create another recap!
        </p>
      </div>
    </div>
  );
}
