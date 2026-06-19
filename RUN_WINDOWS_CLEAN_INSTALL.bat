@echo off
setlocal
cd /d "%~dp0"
echo Cleaning node_modules and reinstalling for this Windows machine...
rmdir /s /q node_modules 2>nul
call npm install
if errorlevel 1 goto fail
call npm run dev
if errorlevel 1 goto fail
goto end
:fail
echo Clean install failed. Make sure Node.js LTS is installed and internet is available.
pause
:end
endlocal
