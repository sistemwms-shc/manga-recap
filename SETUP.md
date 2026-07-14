# 🚀 Detailed Setup Guide

This guide will walk you through setting up the Manga Recap project step by step.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation](#installation)
3. [API Keys Setup](#api-keys-setup)
4. [Running the Project](#running-the-project)
5. [Troubleshooting](#troubleshooting)

## System Requirements

### Required
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Operating System**: Windows, macOS, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 500MB free space

### Optional (for enhanced features)
- **FFmpeg**: For advanced video processing
- **Git**: For version control

## Installation

### Step 1: Install Node.js

#### Windows
1. Download from https://nodejs.org/
2. Run the installer
3. Follow the installation wizard
4. Verify installation:
```cmd
node --version
npm --version
```

#### macOS
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Fedora
sudo dnf install nodejs npm
```

### Step 2: Clone/Download the Project

#### Using Git
```bash
git clone https://github.com/sistemwms-shc/manga-recap.git
cd manga-recap
```

#### Or Download ZIP
1. Download the project ZIP from GitHub
2. Extract to your desired location
3. Open terminal in the project folder

### Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js
- React
- TypeScript
- TailwindCSS
- AI libraries
- And more...

**Expected time**: 2-5 minutes depending on internet speed

## API Keys Setup

### Option 1: Hugging Face (Recommended for Beginners)

1. **Create Account**
   - Go to https://huggingface.co/
   - Click "Sign Up"
   - Verify your email

2. **Generate API Token**
   - Go to https://huggingface.co/settings/tokens
   - Click "New token"
   - Name it "manga-recap"
   - Select "Read" permission
   - Copy the token

3. **Add to Project**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env file and add:
   HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxx
   ```

### Option 2: OpenAI (Advanced Features)

1. **Create Account**
   - Go to https://platform.openai.com/
   - Sign up (you'll get $5 free credits)

2. **Generate API Key**
   - Go to https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Copy the key (starts with sk-)

3. **Add to .env**
   ```env
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
   ```

### Option 3: ElevenLabs (High-Quality Voice)

1. **Sign Up**
   - Go to https://elevenlabs.io/
   - Create free account (10,000 chars/month free)

2. **Get API Key**
   - Go to Profile → API Keys
   - Copy your API key

3. **Add to .env**
   ```env
   ELEVENLABS_API_KEY=xxxxxxxxxxxxxxxxxxxxx
   ```

### Option 4: Google Cloud TTS

1. **Create Google Cloud Account**
   - Go to https://console.cloud.google.com/
   - Enable Cloud Text-to-Speech API

2. **Create API Key**
   - Go to APIs & Services → Credentials
   - Create credentials → API Key

3. **Add to .env**
   ```env
   GOOGLE_TTS_API_KEY=xxxxxxxxxxxxxxxxxxxxx
   ```

## Running the Project

### Development Mode

```bash
npm run dev
```

The app will start at: http://localhost:3000

### Production Build

```bash
# Build the project
npm run build

# Start production server
npm start
```

## Installing FFmpeg (Optional)

FFmpeg provides better video quality and more options.

### Windows

**Method 1: Using Chocolatey**
```cmd
choco install ffmpeg
```

**Method 2: Manual Installation**
1. Download from https://ffmpeg.org/download.html
2. Extract to C:\ffmpeg
3. Add to PATH:
   - Open System Properties → Environment Variables
   - Edit PATH
   - Add C:\ffmpeg\bin
4. Verify: `ffmpeg -version`

### macOS

```bash
brew install ffmpeg
```

### Linux

```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# Fedora
sudo dnf install ffmpeg
```

## Troubleshooting

### Common Issues

#### Issue 1: "npm: command not found"
**Solution**: Install Node.js from https://nodejs.org/

#### Issue 2: Port 3000 already in use
**Solution**: 
```bash
# Use a different port
npm run dev -- -p 3001
```

#### Issue 3: Module not found errors
**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

#### Issue 4: API key errors
**Solution**: 
- Check if .env file exists
- Verify API key is correct
- Remove any extra spaces or quotes
- Restart the dev server

#### Issue 5: Video generation fails
**Solution**:
- Install FFmpeg
- Check if temp folder has write permissions
- Reduce number of images (try 5-10 first)

### Getting Help

If you still have issues:

1. Check the [GitHub Issues](https://github.com/sistemwms-shc/manga-recap/issues)
2. Create a new issue with:
   - Your operating system
   - Node.js version
   - Error message
   - Steps to reproduce

## Next Steps

After successful setup:

1. ✅ Test the app with sample manga images
2. ✅ Configure your preferred AI service
3. ✅ Customize the UI (optional)
4. ✅ Deploy to production (see README.md)

## Performance Tips

- Use high-quality but not huge images (max 2MB each)
- Limit to 10-15 images for faster processing
- Close other heavy applications while generating videos
- Use SSD storage for better performance

## Security Notes

- Never commit .env file to Git
- Keep API keys secret
- Don't share your API keys
- Regularly rotate your API keys

---

Need more help? Check the [main README](README.md) or open an issue!
