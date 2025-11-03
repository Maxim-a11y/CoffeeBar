#!/bin/bash

echo "Setting up permissions..."

mkdir -p /var/www/html /var/log/nginx /var/www/html/server/database

if [ ! -f /etc/nginx/sites-available/default ]; then
    cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup 2>/dev/null || true
fi

# Устанавливаем права только для директорий, которые НЕ являются read-only монтированиями
# Игнорируем ошибки для read-only файловых систем
chown -R www-data:www-data /var/www/html 2>/dev/null || true
chmod -R 755 /var/www/html 2>/dev/null || true
chmod -R 644 /var/www/html/* 2>/dev/null || true

# Создаем и устанавливаем права для директории базы данных (не read-only)
mkdir -p /var/www/html/server/database
chmod -R 775 /var/www/html/server/database
chown -R www-data:www-data /var/www/html/server/database

echo "Checking PHP-FPM configuration..."
if ! php-fpm -t; then
    echo "WARNING: PHP-FPM config test failed, but continuing..."
fi

echo "Starting PHP-FPM..."
php-fpm -D || {
    echo "ERROR: PHP-FPM failed to start!"
    ps aux | grep php-fpm || true
    exit 1
}

sleep 2

PHP_PID=$(pgrep php-fpm || echo "")
if [ -z "$PHP_PID" ]; then
    echo "WARNING: PHP-FPM PID not found, but process might be running"
    ps aux | grep php-fpm || true
else
    echo "PHP-FPM started successfully (PID: $PHP_PID)"
fi

echo "Checking Nginx configuration..."
if ! nginx -t; then
    echo "ERROR: Nginx configuration test failed!"
    exit 1
fi

echo "Starting Nginx..."
echo "Сайт доступен по http://localhost:8080"
exec nginx -g 'daemon off;'