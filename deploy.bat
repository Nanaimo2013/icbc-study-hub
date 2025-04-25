@echo off
echo ICBC Study Hub Deployment
echo ==============================

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Check if Docker Compose is installed
where docker-compose >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Build the application
echo Building the application...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo npm install failed. Please check the logs above.
    exit /b 1
)

call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo npm build failed. Please check the logs above.
    exit /b 1
)

REM Build and start the Docker containers
echo Building and starting Docker containers...
docker-compose up -d --build
if %ERRORLEVEL% NEQ 0 (
    echo Docker Compose failed. Please check the logs above.
    exit /b 1
)

echo Deployment completed successfully!
echo The application is now running at: http://localhost:3000
echo To stop the application, run: docker-compose down 