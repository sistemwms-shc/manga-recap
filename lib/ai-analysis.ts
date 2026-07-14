/**
 * AI Image Analysis using Free Services
 * Options:
 * 1. Hugging Face Inference API (Free tier)
 * 2. OpenAI Vision API (Requires API key but has free credits)
 * 3. Google Gemini (Free tier)
 */

export async function analyzeImages(images: File[], language: 'id' | 'en' = 'id'): Promise<{ narrative: string }> {
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
    const narrative = createNarrativeFromCaptions(captions, images.length, language);
    return { narrative };
  } catch (error) {
    console.error('Error in AI analysis:', error);
    return generateBasicNarrative(images.length, language);
  }
}

function createNarrativeFromCaptions(captions: string[], totalImages: number, language: 'id' | 'en'): string {
  if (captions.length === 0) {
    return generateBasicNarrative(totalImages, language).narrative;
  }

  let narrative = '';
  
  if (language === 'id') {
    narrative = "Selamat datang di rekap manga ini. ";
    captions.forEach((caption, index) => {
      narrative += `Di panel ${index + 1}, ${caption}. `;
    });
    if (totalImages > captions.length) {
      narrative += `Cerita berlanjut melalui ${totalImages - captions.length} panel menarik lainnya. `;
    }
    narrative += "Ini mengakhiri rekap manga kita. Terima kasih sudah menonton!";
  } else {
    narrative = "Welcome to this manga recap. ";
    captions.forEach((caption, index) => {
      narrative += `In panel ${index + 1}, ${caption}. `;
    });
    if (totalImages > captions.length) {
      narrative += `The story continues through ${totalImages - captions.length} more exciting panels. `;
    }
    narrative += "This concludes our manga recap. Thank you for watching!";
  }
  
  return narrative;
}

function generateBasicNarrative(imageCount: number, language: 'id' | 'en'): { narrative: string } {
  if (language === 'id') {
    return {
      narrative: `Selamat datang di rekap manga ini. Cerita dimulai dengan protagonis kita yang menghadapi situasi sulit. 
      Di panel pembuka, kita melihat karakter utama sedang berada dalam keadaan yang menantang. 
      Suasana terasa menegangkan saat tokoh utama harus membuat keputusan penting. 
      Di tengah konflik yang semakin memanas, karakter mulai menunjukkan kekuatan tersembunyi mereka. 
      Musuh muncul dengan ancaman yang berbahaya, memaksa pahlawan kita untuk bertindak cepat. 
      Dalam pertarungan sengit, kita menyaksikan aksi dramatis dan momen penuh emosi. 
      Karakter pendukung hadir memberikan bantuan di saat genting. 
      Plot twist mengejutkan terjadi ketika rahasia besar terungkap. 
      Ketegangan mencapai puncaknya saat protagonis menghadapi tantangan terbesar mereka. 
      Di panel klimaks, pertarungan epik berlangsung dengan intensitas tinggi. 
      Karakter utama menunjukkan tekad kuat untuk melindungi yang mereka sayangi. 
      Dengan strategi cerdas dan keberanian luar biasa, mereka berhasil mengatasi rintangan. 
      Cerita berakhir dengan resolusi yang memuaskan namun meninggalkan pertanyaan untuk chapter berikutnya. 
      Terima kasih sudah menonton rekap ini! Jangan lupa untuk terus mengikuti petualangan seru mereka di chapter selanjutnya!`,
    };
  } else {
    return {
      narrative: `Welcome to this manga recap. Our story begins with the protagonist facing a difficult situation. 
      In the opening panels, we see the main character in a challenging predicament. 
      The atmosphere feels tense as our hero must make an important decision. 
      Amid the escalating conflict, the characters begin revealing their hidden powers. 
      Enemies appear with dangerous threats, forcing our hero to act quickly. 
      In the fierce battle, we witness dramatic action and emotional moments. 
      Supporting characters arrive to provide help in critical times. 
      A shocking plot twist occurs when a major secret is revealed. 
      Tension reaches its peak as the protagonist faces their greatest challenge. 
      In the climactic panels, an epic battle unfolds with high intensity. 
      The main character shows strong determination to protect those they care about. 
      With clever strategy and extraordinary courage, they manage to overcome obstacles. 
      The story ends with a satisfying resolution but leaves questions for the next chapter. 
      Thank you for watching this recap! Don't forget to keep following their exciting adventures in the next chapter!`,
    };
  }
}

// Alternative: OpenAI Vision API (requires API key)
export async function analyzeWithOpenAI(images: File[], language: 'id' | 'en'): Promise<{ narrative: string }> {
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
              text: language === 'id' 
                ? 'Analisis panel manga ini dan buat narasi rekap yang kohesif untuk video. Fokus pada cerita, karakter, dan peristiwa kunci. Buat menarik untuk penonton. Gunakan Bahasa Indonesia.'
                : 'Analyze these manga panels and create a cohesive narrative recap for a video. Focus on the story, characters, and key events. Make it engaging for viewers.',
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
