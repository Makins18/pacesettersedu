@echo off
echo ==========================================
echo      PACESETTERS GITHUB DEPLOYMENT
echo ==========================================
echo.

echo [1/6] Checking for Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Git is not installed or not in your PATH.
    echo Please install Git from https://git-scm.com/downloads
    pause
    exit /b 1
)

echo [2/6] Initializing Repository...
if not exist .git (
    git init
    echo Repository initialized.
) else (
    echo Repository already exists.
)

echo [3/6] Adding Files...
git add .

echo [4/6] Committing Changes...
git commit -m "Initial commit: Pacesetters Platform V1 (Feature Complete)"

echo [5/6] Renaming branch to main...
git branch -M main

echo [6/6] Pushing to GitHub (Makins18/pacestteredu)...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/Makins18/pacestteredu.git
git push -u origin main

echo.
echo ==========================================
echo      DEPLOYMENT COMPLETE!
echo ==========================================
pause
