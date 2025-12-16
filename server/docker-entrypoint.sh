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

if [ ! -f /etc/nginx/sites-available/default ]; then
    cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup 2>/dev/null || true
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

echo "Checking PHP-FPM configuration..."
php-fpm -t 2>/dev/null || echo "WARNING: PHP-FPM config test failed, but continuing..."

echo "Starting PHP-FPM..."
php-fpm -D 2>/dev/null || {
    echo "ERROR: PHP-FPM failed to start!"
    exit 1
}

sleep 2
echo "PHP-FPM started"

echo "Checking Nginx configuration..."
if ! nginx -t 2>/dev/null; then
    echo "ERROR: Nginx configuration test failed!"
    exit 1
fi

echo "Starting Nginx..."
echo "Сайт доступен по http://localhost:8080"
exec nginx -g 'daemon off;'
