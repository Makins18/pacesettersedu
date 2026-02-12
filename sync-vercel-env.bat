@echo off
SETLOCAL EnableDelayedExpansion

echo 🚀 PACESETTERS Vercel Environment Sync
echo --------------------------------------

:MENU
echo 1. Sync Backend (.env)
echo 2. Sync Frontend (.env.local)
echo 3. Exit
set /p choice="Select an option (1-3): "

if "%choice%"=="1" (
    set "FOLDER=backend"
    set "ENV_FILE=backend\.env"
    goto SYNC
)
if "%choice%"=="2" (
    set "FOLDER=frontend"
    set "ENV_FILE=frontend\.env.local"
    goto SYNC
)
if "%choice%"=="3" exit
goto MENU

:SYNC
if not exist "%ENV_FILE%" (
    echo ❌ Error: %ENV_FILE% not found!
    pause
    goto MENU
)

echo 📥 Reading %ENV_FILE%...
cd %FOLDER%

for /f "tokens=1,2 delims==" %%A in (..\ %ENV_FILE%) do (
    set "key=%%A"
    set "val=%%B"
    
    :: Remove whitespace and handle comments
    if "!key:~0,1!" NEQ "#" if "!key!" NEQ "" (
        echo 📤 Adding !key! to Vercel...
        npx vercel env add !key! production "!val!"
    )
)

cd ..
echo ✅ Sync complete for %FOLDER%!
pause
goto MENU
