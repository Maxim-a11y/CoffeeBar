#!/bin/bash

echo "Setting up permissions..."

mkdir -p /var/www/html /var/log/nginx /var/www/html/server/database

# Проверяем, что dist собран
if [ ! -f /var/www/html/client/dist/index.html ]; then
    echo "WARNING: Frontend not built! Checking /var/www/html/client/dist/..."
    ls -la /var/www/html/client/dist/ 2>/dev/null || echo "Directory does not exist"
    echo "Trying to build frontend..."
    if [ -d /tmp/client ]; then
        cd /tmp/client && npm run build 2>&1 || echo "Build failed"
        cp -r /tmp/client/dist/* /var/www/html/client/dist/ 2>/dev/null || true
    fi
fi

# Убеждаемся, что конфигурация nginx существует
if [ ! -f /etc/nginx/sites-available/default ]; then
    echo "ERROR: Nginx configuration file not found!"
    exit 1
fi

# Создаём симлинк для sites-enabled (если его нет)
if [ ! -L /etc/nginx/sites-enabled/default ]; then
    ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default 2>/dev/null || true
fi

# Устанавливаем права на все директории (755 = rwxr-xr-x) - важно для доступа nginx
find /var/www/html -type d -exec chmod 755 {} \; 2>/dev/null || true

# Устанавливаем права на все файлы (644 = rw-r--r--)
find /var/www/html -type f -exec chmod 644 {} \; 2>/dev/null || true

# Устанавливаем владельца
chown -R www-data:www-data /var/www/html 2>/dev/null || true

# Особые права для директории базы данных
mkdir -p /var/www/html/server/database
chmod 775 /var/www/html/server/database
chown -R www-data:www-data /var/www/html/server/database

# Критично: убеждаемся, что все родительские директории доступны
chmod 755 /var/www 2>/dev/null || true
chmod 755 /var/www/html 2>/dev/null || true
chmod 755 /var/www/html/client 2>/dev/null || true
chmod 755 /var/www/html/client/dist 2>/dev/null || true

# Убеждаемся, что nginx может читать dist
if [ -d /var/www/html/client/dist ]; then
    find /var/www/html/client/dist -type d -exec chmod 755 {} \; 2>/dev/null || true
    find /var/www/html/client/dist -type f -exec chmod 644 {} \; 2>/dev/null || true
    chown -R www-data:www-data /var/www/html/client/dist 2>/dev/null || true
    echo "Dist directory permissions set"
    ls -la /var/www/html/client/dist/ | head -5
fi

# Создаём директорию для PHP-FPM socket
mkdir -p /var/run/php
chown www-data:www-data /var/run/php 2>/dev/null || true

echo "Checking PHP-FPM configuration..."
php-fpm -t 2>/dev/null || echo "WARNING: PHP-FPM config test failed, but continuing..."

echo "Starting PHP-FPM in background..."
php-fpm -D 2>/dev/null || {
    echo "ERROR: PHP-FPM failed to start!"
    exit 1
}

# Ждём немного, чтобы PHP-FPM успел запуститься
sleep 3

# Проверяем, что PHP-FPM слушает TCP порт 9000
# Используем /proc/net/tcp для проверки без внешних утилит
MAX_RETRIES=10
RETRY_COUNT=0
PHP_FPM_RUNNING=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    # Проверяем, что порт 9000 слушается (0100007F = 127.0.0.1 в hex, 2328 = 9000 в hex)
    if [ -f /proc/net/tcp ] && grep -q "0100007F:2328" /proc/net/tcp 2>/dev/null; then
        echo "PHP-FPM is listening on port 9000"
        PHP_FPM_RUNNING=1
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
        echo "Waiting for PHP-FPM on port 9000... ($RETRY_COUNT/$MAX_RETRIES)"
        sleep 1
    fi
done

if [ $PHP_FPM_RUNNING -eq 0 ]; then
    echo "WARNING: PHP-FPM port 9000 not found, but continuing..."
    echo "PHP-FPM may still be starting or using different configuration"
fi

echo "PHP-FPM check completed"

echo "Checking Nginx configuration..."
if ! nginx -t 2>&1; then
    echo "ERROR: Nginx configuration test failed!"
    exit 1
fi

echo "Starting Nginx..."
echo "Сайт доступен по http://localhost:8080"
exec nginx -g 'daemon off;'
