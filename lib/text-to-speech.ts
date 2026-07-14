import fs from 'fs';
import path from 'path';

/**
 * Text-to-Speech using FREE services:
 * For now, we'll save the narrative text for future audio integration
 */

export async function generateNarration(text: string): Promise<string> {
  try {
    const publicDir = path.join(process.cwd(), 'public', 'temp');
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const timestamp = Date.now();
    const textFileName = `narration_${timestamp}.txt`;
    const textPath = path.join(publicDir, textFileName);
    
    // Save the narrative text
    fs.writeFileSync(textPath, text, 'utf-8');
    
    return `/temp/${textFileName}`;
  } catch (error) {
    console.error('Error saving narration:', error);
    throw new Error('Failed to save narration text');
  }
}

// Alternative: ElevenLabs API (requires API key, free tier available)
export async function generateWithElevenLabs(text: string): Promise<string> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    throw new Error('ElevenLabs API key not configured');
  }

  const voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Sarah voice (free)

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error('ElevenLabs API request failed');
  }

  const audioBuffer = await response.arrayBuffer();
  
  const publicDir = path.join(process.cwd(), 'public', 'temp');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const timestamp = Date.now();
  const audioFileName = `audio_${timestamp}.mp3`;
  const audioPath = path.join(publicDir, audioFileName);
  
  fs.writeFileSync(audioPath, Buffer.from(audioBuffer));
  
  return `/temp/${audioFileName}`;
}

// Alternative: Google Cloud TTS (requires API key, has free tier)
export async function generateWithGoogleTTS(text: string): Promise<string> {
  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google TTS API key not configured');
  }

  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: 'en-US',
          name: 'en-US-Standard-A',
          ssmlGender: 'FEMALE',
        },
        audioConfig: {
          audioEncoding: 'MP3',
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Google TTS API request failed');
  }

  const data = await response.json();
  const audioContent = data.audioContent;
  
  const publicDir = path.join(process.cwd(), 'public', 'temp');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const timestamp = Date.now();
  const audioFileName = `audio_${timestamp}.mp3`;
  const audioPath = path.join(publicDir, audioFileName);
  
  fs.writeFileSync(audioPath, Buffer.from(audioContent, 'base64'));
  
  return `/temp/${audioFileName}`;
}
