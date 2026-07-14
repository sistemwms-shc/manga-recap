# 📚 Manga Recap - AI Video Generator

![Manga Recap Banner](https://img.shields.io/badge/AI-Powered-purple?style=for-the-badge) ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript) ![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwind-css)

Transform your manga and manhwa into engaging **AI-narrated video recaps** automatically! Upload manga panels, let AI analyze the story, generate natural voice narration, and create a complete video recap - all for **FREE**!

## ✨ Features

- 🤖 **AI Image Analysis** - Understands manga panels and extracts story context
- 🎙️ **AI Voice Narration** - Natural text-to-speech narration
- 🎬 **Automatic Video Generation** - Creates videos with smooth transitions
- 📱 **Responsive Design** - Works on desktop and mobile
- 🆓 **100% Free** - Uses free tier APIs and open-source tools
- ⚡ **Fast Processing** - Videos generated in 1-2 minutes
- 💾 **Download Ready** - Export your videos instantly

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- (Optional) FFmpeg for advanced video generation

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/sistemwms-shc/manga-recap.git
cd manga-recap
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your API keys (optional)
# The app works without keys but with limited features
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

## 🔑 API Keys (All FREE!)

The app supports multiple AI services, all with generous free tiers:

### Option 1: Hugging Face (Recommended) 🌟
- **Free tier**: Unlimited with rate limits
- **Sign up**: https://huggingface.co/settings/tokens
- **Best for**: Image analysis and basic features
```env
HUGGINGFACE_API_KEY=your_key_here
```

### Option 2: OpenAI
- **Free tier**: $5 credits for new accounts
- **Sign up**: https://platform.openai.com/api-keys
- **Best for**: Advanced image analysis with GPT-4 Vision
```env
OPENAI_API_KEY=your_key_here
```

### Option 3: ElevenLabs
- **Free tier**: 10,000 characters/month
- **Sign up**: https://elevenlabs.io/
- **Best for**: High-quality voice narration
```env
ELEVENLABS_API_KEY=your_key_here
```

### Option 4: Google Cloud TTS
- **Free tier**: 1 million characters/month
- **Sign up**: https://console.cloud.google.com/
- **Best for**: Reliable text-to-speech
```env
GOOGLE_TTS_API_KEY=your_key_here
```

**Note**: The app will work with basic functionality even without any API keys!

## 📖 How to Use

1. **Upload Images**
   - Click the upload area
   - Select manga/manhwa images (up to 20)
   - Images should be in reading order

2. **Generate Video**
   - Click "Generate Video Recap"
   - Wait 1-2 minutes for AI processing

3. **Watch & Download**
   - Watch your video in the player
   - Download to save locally
   - Create more recaps!

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **AI Services**:
  - Hugging Face Inference API
  - OpenAI GPT-4 Vision (optional)
  - ElevenLabs TTS (optional)
  - Google Cloud TTS (optional)
- **Video Processing**: FFmpeg (optional)
- **Image Processing**: Sharp

## 📁 Project Structure

```
manga-recap/
├── app/
│   ├── api/
│   │   └── generate-recap/      # API route for video generation
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── MangaUploader.tsx        # Image upload component
│   └── VideoPlayer.tsx          # Video player component
├── lib/
│   ├── ai-analysis.ts           # AI image analysis
│   ├── text-to-speech.ts        # TTS generation
│   └── video-generator.ts       # Video creation
├── public/
│   └── temp/                    # Temporary files
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

### Deploy to Netlify

```bash
npm run build
# Upload the .next folder to Netlify
```

### Deploy to Railway/Render

Both platforms support Next.js apps with zero configuration.

## 🔧 Configuration

### Enable FFmpeg (Optional)

For better video quality, install FFmpeg:

**Windows:**
```bash
# Using Chocolatey
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
```

**Mac:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Known Issues & Limitations

- Maximum 20 images per upload (can be adjusted in code)
- Video generation requires sufficient server resources
- Free API tiers have rate limits
- Some features require API keys for full functionality

## 🔮 Roadmap

- [ ] Add more AI model options
- [ ] Support for PDF manga uploads
- [ ] Multiple voice options
- [ ] Background music
- [ ] Custom video templates
- [ ] Batch processing
- [ ] User accounts and history
- [ ] Mobile app version

## 💬 Support

If you have questions or need help:

- Open an [Issue](https://github.com/sistemwms-shc/manga-recap/issues)
- Check existing issues for solutions
- Read the documentation

## 🌟 Show Your Support

If you find this project useful, please give it a ⭐ on GitHub!

## 👨‍💻 Author

**sistemwms-shc**
- GitHub: [@sistemwms-shc](https://github.com/sistemwms-shc)

---

Built with ❤️ using AI and open-source technology

**Free AI Services Used:**
- 🤗 Hugging Face
- 🧠 OpenAI (optional)
- 🎙️ ElevenLabs (optional)
- 🗣️ Google Cloud TTS (optional)
