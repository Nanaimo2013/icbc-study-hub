@echo off
echo ICBC Study Hub - Build and Package
echo ==============================

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Check for npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo npm is not installed. Please install npm first.
    exit /b 1
)

REM Clean previous build if exists
if exist build (
    echo Cleaning previous build...
    rmdir /s /q build
)

REM Install dependencies if not already installed
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo npm install failed. Please check the logs above.
        exit /b 1
    )
)

echo Building the application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed. Please check the logs above.
    exit /b 1
)

REM Create a distributable package
echo Creating distributable package...
mkdir release
xcopy /E /I /Y build release\build
copy nginx.conf release\
copy Dockerfile release\
copy docker-compose.yml release\
copy README.md release\
copy PTERODACTYL_GUIDE.md release\
copy entrypoint.sh release\
copy pterodactyl.json release\

echo Building successful! Distributable package created in the "release" folder.
echo.
echo To deploy the application:
echo 1. Copy the "release" folder to your server
echo 2. Follow the instructions in README.md for Docker deployment
echo 3. Or follow PTERODACTYL_GUIDE.md for Pterodactyl deployment
echo. 