/**
 * AI Image Analysis using Free Services
 * Options:
 * 1. Hugging Face Inference API (Free tier)
 * 2. OpenAI Vision API (Requires API key but has free credits)
 * 3. Google Gemini (Free tier)
 */

export async function analyzeImages(images: File[]): Promise<{ narrative: string }> {
  try {
    // Convert images to base64 for analysis
    const imageDataArray = await Promise.all(
      images.map(async (img) => {
        const arrayBuffer = await img.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return buffer.toString('base64');
      })
    );

    // Using Hugging Face free API for image captioning
    const apiKey = process.env.HUGGINGFACE_API_KEY || '';
    
    if (!apiKey) {
      // Fallback: Generate basic narrative without AI
      return generateBasicNarrative(images.length);
    }

    // Analyze each image
    const captions: string[] = [];
    
    for (let i = 0; i < Math.min(imageDataArray.length, 10); i++) {
      try {
        const response = await fetch(
          'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: imageDataArray[i],
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          captions.push(result[0]?.generated_text || 'Scene continues');
        }
      } catch (err) {
        console.error(`Error analyzing image ${i}:`, err);
        captions.push('Scene continues');
      }
    }

    // Create narrative from captions
    const narrative = createNarrativeFromCaptions(captions, images.length);
    return { narrative };
  } catch (error) {
    console.error('Error in AI analysis:', error);
    return generateBasicNarrative(images.length);
  }
}

function createNarrativeFromCaptions(captions: string[], totalImages: number): string {
  if (captions.length === 0) {
    return generateBasicNarrative(totalImages).narrative;
  }

  let narrative = "Welcome to this manga recap. ";
  
  captions.forEach((caption, index) => {
    narrative += `In panel ${index + 1}, ${caption}. `;
  });
  
  if (totalImages > captions.length) {
    narrative += `The story continues through ${totalImages - captions.length} more exciting panels. `;
  }
  
  narrative += "This concludes our manga recap. Thank you for watching!";
  
  return narrative;
}

function generateBasicNarrative(imageCount: number): { narrative: string } {
  return {
    narrative: `Welcome to this manga recap. This chapter consists of ${imageCount} exciting panels that tell an engaging story. 
    Our manga follows the adventures and challenges faced by the characters as the plot unfolds. 
    Each panel carefully crafted to convey emotion, action, and story progression. 
    From intense action sequences to heartfelt character moments, this manga delivers on all fronts. 
    The artwork beautifully captures the essence of the story, bringing the characters and world to life. 
    As we move through the panels, we witness character development and plot twists that keep readers engaged. 
    This manga showcases excellent storytelling through both its visual artistry and narrative structure. 
    Thank you for watching this recap. We hope you enjoyed this overview of the chapter!`,
  };
}

// Alternative: OpenAI Vision API (requires API key)
export async function analyzeWithOpenAI(images: File[]): Promise<{ narrative: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  // Convert first few images to base64
  const imageDataArray = await Promise.all(
    images.slice(0, 5).map(async (img) => {
      const arrayBuffer = await img.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return {
        type: 'image_url',
        image_url: {
          url: `data:${img.type};base64,${buffer.toString('base64')}`,
        },
      };
    })
  );

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze these manga panels and create a cohesive narrative recap for a video. Focus on the story, characters, and key events. Make it engaging for viewers.',
            },
            ...imageDataArray,
          ],
        },
      ],
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API request failed');
  }

  const data = await response.json();
  return {
    narrative: data.choices[0].message.content,
  };
}
