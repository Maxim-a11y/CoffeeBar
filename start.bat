@echo off
chcp 65001 >nul
echo Kuro App - Запуск приложения
echo.

docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: Docker не установлен!
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: Docker Compose не установлен!
    pause
    exit /b 1
)

echo Запуск приложения...
docker-compose up --build

echo.
echo Приложение запущено: http://localhost:8080
pause

