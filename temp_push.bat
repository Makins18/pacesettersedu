@echo off
set GIT_PATH="C:\Program Files\Git\bin\git.exe"
%GIT_PATH% config --local user.email "pacesetterspdieweb@gmail.com"
%GIT_PATH% config --local user.name "Makins18"
%GIT_PATH% add .
%GIT_PATH% commit -m "Finalized production lock, fixed Prisma IDs, and cleared startup blockers"
%GIT_PATH% branch -M main
%GIT_PATH% remote remove origin >nul 2>&1
%GIT_PATH% remote add origin https://github.com/makins18/pacesettersedu.git
%GIT_PATH% push origin main -f
