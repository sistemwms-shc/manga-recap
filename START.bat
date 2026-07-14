@echo off
echo ========================================
echo   Manga Recap - Setup and Run
echo ========================================
echo.

echo Step 1: Installing dependencies...
echo This may take 2-5 minutes...
call npm install

echo.
echo Step 2: Starting development server...
echo Your website will open at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
