import { NextRequest, NextResponse } from 'next/server';
import { analyzeImages } from '@/lib/ai-analysis';
import { generateNarration } from '@/lib/text-to-speech';
import { createVideo } from '@/lib/video-generator';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const images: File[] = [];
    let language: 'id' | 'en' = 'id';
    let customNarration: string | null = null;

    // Extract all images, language, and custom narration from formData
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image_') && value instanceof File) {
        images.push(value);
      } else if (key === 'language') {
        language = value as 'id' | 'en';
      } else if (key === 'customNarration') {
        customNarration = value as string;
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    let narrativeText: string;

    // Use custom narration if provided, otherwise use AI analysis
    if (customNarration && customNarration.trim().length > 0) {
      console.log('Using custom narration provided by user');
      narrativeText = customNarration.trim();
    } else {
      // Step 1: Analyze images with AI to extract story/dialogue
      console.log(`Analyzing images in ${language}...`);
      const analysis = await analyzeImages(images, language);
      narrativeText = analysis.narrative;
    }

    // Step 2: Generate narration audio from the narrative
    console.log('Generating narration...');
    const audioPath = await generateNarration(narrativeText, language);

    // Step 3: Create video from images + audio
    console.log('Creating video...');
    const videoPath = await createVideo(images, audioPath, language);

    return NextResponse.json({
      success: true,
      videoUrl: videoPath,
      analysis: narrativeText,
      language,
      customNarration: customNarration ? true : false,
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
