@echo off
echo ==========================================
echo      PACESETTERS PLATFORM SETUP
echo ==========================================
echo.

echo [1/2] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    pause
    exit /b %errorlevel%
)
cd ..
echo Backend dependencies installed.
echo.

echo [2/2] Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies!
    pause
    exit /b %errorlevel%
)
cd ..
echo Frontend dependencies installed.
echo.

echo ==========================================
echo      SETUP COMPLETE!
echo ==========================================
echo.
echo You can now run the servers using:
echo Backend: cd backend ^& npm run dev
echo Frontend: cd frontend ^& npm run dev
echo.
pause
