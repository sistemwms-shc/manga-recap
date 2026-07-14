import { NextRequest, NextResponse } from 'next/server';
import { analyzeImages } from '@/lib/ai-analysis';
import { generateNarration } from '@/lib/text-to-speech';
import { createVideo } from '@/lib/video-generator';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const images: File[] = [];

    // Extract all images from formData
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image_') && value instanceof File) {
        images.push(value);
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    // Step 1: Analyze images with AI to extract story/dialogue
    console.log('Analyzing images...');
    const analysis = await analyzeImages(images);

    // Step 2: Generate narration audio from the analysis
    console.log('Generating narration...');
    const audioPath = await generateNarration(analysis.narrative);

    // Step 3: Create video from images + audio
    console.log('Creating video...');
    const videoPath = await createVideo(images, audioPath);

    return NextResponse.json({
      success: true,
      videoUrl: videoPath,
      analysis: analysis.narrative,
    });
  } catch (error: any) {
    console.error('Error generating recap:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate recap' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
