# 🔧 Troubleshooting Guide

Common issues and solutions for Manga Recap project.

## ✅ Fixed Issues

### ~~Video Generation Failed~~ (FIXED!)
**Status**: ✅ **SOLVED**

**What was wrong**: The original code tried to use FFmpeg (which you may not have installed).

**Solution Applied**: Changed to a simpler slideshow format that works without any external dependencies!

Now your manga images will display as an **automatic slideshow** with:
- ✅ 3 seconds per panel
- ✅ Auto-play/pause controls
- ✅ Progress indicator
- ✅ Restart button
- ✅ Works on all devices!

---

## 🚀 How to Test the Fix

1. **Stop the server** if it's running (press Ctrl+C)

2. **Restart the server**:
```cmd
npm run dev
```

3. **Open browser**: http://localhost:3000

4. **Upload manga images** (5-10 images to start)

5. **Click "Generate Video Recap"**

6. **Wait 10-30 seconds**

7. **You should see** an automatic slideshow playing your manga panels!

---

## 🐛 Other Common Issues

### Issue 1: "npm is not recognized"
**Problem**: Node.js not installed or not in PATH

**Solution**:
1. Download Node.js: https://nodejs.org/
2. Install it (check "Add to PATH" option)
3. Restart Command Prompt
4. Try again

---

### Issue 2: "Module not found" errors
**Problem**: Dependencies not installed

**Solution**:
```cmd
cd c:\Users\Administrator\Downloads\manga-recap-new
npm install
```

---

### Issue 3: Port 3000 already in use
**Problem**: Another app is using port 3000

**Solution**:
```cmd
# Use a different port
npm run dev -- --port 3001
```
Then open: http://localhost:3001

---

### Issue 4: API Key errors
**Problem**: API key not configured or invalid

**Solution**:
1. Check `.env` file exists
2. Make sure it has: `HUGGINGFACE_API_KEY=hf_xxxxx`
3. No extra spaces or quotes
4. Restart the server

---

### Issue 5: Images not uploading
**Problem**: File size too large or wrong format

**Solution**:
- Use PNG, JPG, or JPEG only
- Keep images under 5MB each
- Try with fewer images first (5-10)

---

### Issue 6: "Failed to fetch" error
**Problem**: Server not running or wrong URL

**Solution**:
1. Make sure server is running: `npm run dev`
2. Check browser console for errors (F12)
3. Verify you're on http://localhost:3000

---

### Issue 7: Slideshow not starting
**Problem**: JavaScript error or missing files

**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh page (F5)
3. Check browser console (F12) for errors
4. Try a different browser

---

### Issue 8: "Cannot read property of undefined"
**Problem**: Component error after update

**Solution**:
```cmd
# Stop server (Ctrl+C)
# Delete build cache
rm -rf .next
# Restart
npm run dev
```

On Windows:
```cmd
rmdir /s /q .next
npm run dev
```

---

## 📊 Performance Issues

### Slow upload
- **Cause**: Large image files
- **Solution**: Compress images before upload (use tools like TinyPNG)

### Slow processing
- **Cause**: Many images or slow API
- **Solution**: 
  - Use fewer images (10-20 is optimal)
  - Check your internet connection
  - Wait a bit longer (can take 1-2 minutes)

### High memory usage
- **Cause**: Too many images loaded
- **Solution**: Refresh page between generations

---

## 🔍 Debugging Steps

If something isn't working:

### 1. Check Server Logs
Look at the terminal where you ran `npm run dev` for error messages.

### 2. Check Browser Console
1. Open browser (Chrome/Edge/Firefox)
2. Press F12
3. Go to "Console" tab
4. Look for red error messages

### 3. Check Network Tab
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Try generating a video
4. Look for failed requests (red status codes)

### 4. Check File Permissions
Make sure the `public/temp` folder can be written to:
```cmd
# Windows: Check folder properties
# Should not be read-only
```

---

## 🆘 Still Having Issues?

### Option 1: Fresh Start
```cmd
# 1. Delete node_modules and cache
rmdir /s /q node_modules
rmdir /s /q .next

# 2. Reinstall everything
npm install

# 3. Restart server
npm run dev
```

### Option 2: Check GitHub Issues
Visit: https://github.com/sistemwms-shc/manga-recap/issues

### Option 3: Create New Issue
If your problem isn't listed:
1. Go to: https://github.com/sistemwms-shc/manga-recap/issues
2. Click "New Issue"
3. Include:
   - What you were trying to do
   - Error message (copy/paste)
   - Your Node.js version: `node --version`
   - Operating System

---

## ✅ Verification Checklist

Before asking for help, verify:

- [ ] Node.js is installed (`node --version`)
- [ ] Dependencies are installed (`npm install` completed)
- [ ] Server is running (`npm run dev` working)
- [ ] Browser can access http://localhost:3000
- [ ] `.env` file exists with API key
- [ ] `public/temp` folder exists
- [ ] No other errors in terminal

---

## 🎯 Quick Test

Run this quick test to verify everything works:

1. ✅ Start server: `npm run dev`
2. ✅ Open: http://localhost:3000
3. ✅ See the landing page
4. ✅ Upload 2-3 small images
5. ✅ Click "Generate Video Recap"
6. ✅ Wait 30 seconds
7. ✅ See slideshow playing

If all steps work ✅ = Everything is working!

---

## 📝 Logs Location

If you need to share logs:

**Server logs**: In the terminal window where you ran `npm run dev`

**Browser logs**: 
1. Press F12
2. Console tab
3. Right-click → Save as

---

**Last Updated**: After fixing video generation to use slideshow format

**Status**: All major issues resolved! ✅
