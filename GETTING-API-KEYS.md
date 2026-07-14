# 🔑 How to Get FREE API Keys

This guide shows you exactly how to get FREE API keys for your Manga Recap project.

## 📋 Quick Summary

You have 4 options. **Pick any ONE to start** (Hugging Face is recommended):

| Service | Best For | Free Tier | Sign Up Link |
|---------|----------|-----------|--------------|
| 🤗 Hugging Face | Beginners | Unlimited* | https://huggingface.co/join |
| 🎙️ ElevenLabs | Voice Quality | 10k chars/month | https://elevenlabs.io/sign-up |
| 🧠 OpenAI | Advanced AI | $5 credits | https://platform.openai.com/signup |
| 🗣️ Google Cloud | Enterprise | 1M chars/month | https://console.cloud.google.com/ |

*Rate limited but free forever

---

## 🌟 Option 1: Hugging Face (RECOMMENDED)

**Why choose this?**
- ✅ 100% free forever
- ✅ No credit card required
- ✅ Easy setup (5 minutes)
- ✅ Good enough for most users

**Step-by-step:**

1. **Create Account**
   - Go to: https://huggingface.co/join
   - Enter email and password
   - Verify your email

2. **Generate API Token**
   - After login, click your profile (top right)
   - Go to Settings → Access Tokens
   - Or direct link: https://huggingface.co/settings/tokens
   
3. **Create New Token**
   - Click "New token" button
   - Name: `manga-recap`
   - Role: Select "Read"
   - Click "Generate token"

4. **Copy Your Token**
   - It looks like: `hf_xxxxxxxxxxxxxxxxxxxxxxxx`
   - Copy it immediately (you won't see it again!)

5. **Add to Your Project**
   ```env
   HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxx
   ```

**That's it!** Your project will work with just this one API key.

---

## 🎙️ Option 2: ElevenLabs (Best Voice)

**Why choose this?**
- ✅ Highest quality AI voices
- ✅ 10,000 characters/month free
- ✅ No credit card required
- ✅ Natural-sounding narration

**Step-by-step:**

1. **Sign Up**
   - Go to: https://elevenlabs.io/sign-up
   - Use email or Google account
   - No credit card needed!

2. **Verify Email**
   - Check your email
   - Click verification link

3. **Get API Key**
   - After login, look at top right corner
   - Click your profile picture/name
   - Select "Profile + API Key"
   
4. **Copy API Key**
   - You'll see your API key displayed
   - Click to copy it
   - It's a long string of letters and numbers

5. **Add to Your Project**
   ```env
   ELEVENLABS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
   ```

**Free Tier Limits:**
- 10,000 characters per month
- About 20-30 manga recap videos
- Resets every month

---

## 🧠 Option 3: OpenAI (Advanced)

**Why choose this?**
- ✅ Best image understanding (GPT-4 Vision)
- ✅ $5 free credits for new accounts
- ✅ More accurate manga analysis
- ❗ Requires phone verification

**Step-by-step:**

1. **Create Account**
   - Go to: https://platform.openai.com/signup
   - Sign up with email
   - Verify email address

2. **Add Phone Number**
   - OpenAI requires phone verification
   - Add your phone number
   - Enter verification code

3. **Get Free Credits**
   - New accounts get $5 free credits
   - No credit card needed for free tier
   - Enough for 200-500 manga recaps

4. **Generate API Key**
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Name it: "manga-recap"
   - Copy the key (starts with `sk-`)
   - ⚠️ Save it immediately! You can't see it again

5. **Add to Your Project**
   ```env
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
   ```

**Free Credits:**
- $5 free for new accounts
- GPT-4 Vision: ~$0.01-0.02 per manga recap
- Lasts for 200-500 videos

---

## 🗣️ Option 4: Google Cloud TTS

**Why choose this?**
- ✅ 1 million characters FREE per month
- ✅ Very reliable
- ✅ Multiple voice options
- ❗ More complex setup

**Step-by-step:**

1. **Create Google Cloud Account**
   - Go to: https://console.cloud.google.com/
   - Sign in with Google account
   - Accept terms

2. **Get $300 Free Credits**
   - New users get $300 credit for 90 days
   - Credit card required but NOT charged
   - Can be removed after setup

3. **Create Project**
   - Click "Select a project" → "New Project"
   - Name it: "manga-recap"
   - Click "Create"

4. **Enable Text-to-Speech API**
   - Go to: https://console.cloud.google.com/apis/library
   - Search for "Cloud Text-to-Speech API"
   - Click on it
   - Click "Enable"

5. **Create API Key**
   - Go to: APIs & Services → Credentials
   - Click "Create Credentials"
   - Select "API Key"
   - Copy the key

6. **Add to Your Project**
   ```env
   GOOGLE_TTS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
   ```

**Free Tier:**
- 1 million characters per month FREE
- About 100-200 manga recaps per month
- Free tier is permanent

---

## 🚀 Setting Up Your Project

### Step 1: Copy the .env.example file

```bash
cd manga-recap
cp .env.example .env
```

### Step 2: Edit the .env file

Open `.env` in any text editor and add your keys:

```env
# Add the keys you got above:
HUGGINGFACE_API_KEY=hf_xxxxx
ELEVENLABS_API_KEY=xxxxx
OPENAI_API_KEY=sk-xxxxx
GOOGLE_TTS_API_KEY=xxxxx
```

**You don't need all of them!** Just add the ones you signed up for.

### Step 3: Restart your server

```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

---

## ❓ FAQ

### Q: Do I need ALL the API keys?
**A:** No! Just pick one:
- Minimum: Hugging Face only
- Recommended: Hugging Face + ElevenLabs
- Best: All of them for maximum features

### Q: Which one is easiest?
**A:** Hugging Face - no credit card, instant setup

### Q: Which one gives best results?
**A:** OpenAI for image analysis, ElevenLabs for voice

### Q: What if I don't add any API keys?
**A:** The app still works! It uses basic fallback methods, but results are simpler.

### Q: Are these really free?
**A:** Yes! All have generous free tiers:
- Hugging Face: Free forever
- ElevenLabs: 10k chars/month free
- OpenAI: $5 free credits
- Google: 1M chars/month free

### Q: Will I be charged?
**A:** No, as long as you:
- Stay within free limits
- Don't add payment methods (except Google requires CC for verification)

### Q: What happens if I exceed free limits?
**A:** Most services just stop working until next month. You won't be charged unless you manually upgrade.

---

## 🎯 Recommended Setup for Different Users

### 🆓 **Completely Free (No Credit Card)**
```env
HUGGINGFACE_API_KEY=hf_xxxxx
```
✅ Works perfectly for casual use

### 🌟 **Best Free Experience**
```env
HUGGINGFACE_API_KEY=hf_xxxxx
ELEVENLABS_API_KEY=xxxxx
```
✅ Good AI + Great voice quality

### 🚀 **Maximum Features**
```env
HUGGINGFACE_API_KEY=hf_xxxxx
ELEVENLABS_API_KEY=xxxxx
OPENAI_API_KEY=sk-xxxxx
```
✅ Best of everything

---

## 🛟 Need Help?

- **Can't sign up?** Try a different email provider
- **API key not working?** Check for extra spaces when copying
- **Hit rate limits?** Wait an hour or use a different service
- **Still stuck?** Open an issue on GitHub

---

## 📊 Comparison Table

| Feature | Hugging Face | ElevenLabs | OpenAI | Google |
|---------|--------------|------------|---------|---------|
| Sign-up difficulty | ⭐ Easy | ⭐ Easy | ⭐⭐ Medium | ⭐⭐⭐ Hard |
| Credit card required | ❌ No | ❌ No | ❌ No | ⚠️ Yes* |
| Best for | Beginners | Voice | Advanced | Enterprise |
| Monthly free limit | Unlimited* | 10k chars | $5 credit | 1M chars |
| Quality | Good | Excellent | Excellent | Very Good |

*Google requires CC for verification but doesn't charge

---

## ✅ Quick Start Checklist

1. [ ] Choose at least one service (Hugging Face recommended)
2. [ ] Create account and verify email
3. [ ] Generate API key
4. [ ] Copy `.env.example` to `.env`
5. [ ] Add your API key(s) to `.env`
6. [ ] Restart the development server
7. [ ] Test with a few manga images!

---

**You're ready to go! 🎉**

Start with Hugging Face (5 minutes), then add others later if you want better results.
