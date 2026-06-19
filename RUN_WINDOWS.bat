@echo off
setlocal
cd /d "%~dp0"
echo =============================================
echo SmallPro ERP V35 Full Backend Frontend
echo =============================================
echo.
echo Backend API expected at: https://localhost:7057/api
echo Swagger expected at:     https://localhost:7057/swagger
echo.
if not exist node_modules (
  if exist node_modules_bundle.tar (
    echo Extracting bundled node_modules. This can take a few minutes...
    tar -xf node_modules_bundle.tar
  ) else (
    echo node_modules bundle not found. Installing dependencies from npm...
    call npm install
    if errorlevel 1 goto fail
  )
)
echo Starting Vite frontend...
call npm run dev
if errorlevel 1 goto fail
goto end
:fail
echo.
echo Failed. Try clean install:
echo   RUN_WINDOWS_CLEAN_INSTALL.bat
echo or:
echo   rmdir /s /q node_modules
echo   npm install
echo   npm run dev
pause
:end
endlocal
