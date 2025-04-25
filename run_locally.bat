@echo off
echo ICBC Study Hub - Local Development
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

REM Check for node_modules
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo npm install failed. Please check the logs above.
        exit /b 1
    )
)

echo Starting the application in development mode...
echo.
echo The application will be available at http://localhost:3000
echo Press Ctrl+C to stop the application.
echo.

npm start 