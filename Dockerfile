FROM php:8.2-fpm

# Устанавливаем Node.js для сборки фронтенда через gulp
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

RUN apt-get update && apt-get install -y \
    nginx \
    sqlite3 \
    libsqlite3-dev \
    libzip-dev \
    zip \
    unzip \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo pdo_sqlite zip

RUN mkdir -p /var/www/html /var/log/nginx /var/www/html/server/database

# Копируем клиентскую часть для сборки
WORKDIR /tmp/client
COPY client/package*.json ./
RUN npm install

# Копируем исходники клиента (исключая node_modules)
COPY client/gulpfile.js ./
COPY client/gulp/ ./gulp/
COPY client/src/ ./src/

# Собираем через gulp
RUN npm run build || (echo "Build failed, checking..." && ls -la && exit 1)

# Проверяем, что dist создан
RUN ls -la dist/ || (echo "dist directory not found!" && exit 1)

# Копируем собранный dist в финальную директорию
RUN mkdir -p /var/www/html/client/dist \
    && cp -r dist/* /var/www/html/client/dist/ \
    && ls -la /var/www/html/client/dist/

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/sites-available/default

# Копируем серверную часть
COPY server/ /var/www/html/server/
COPY server/api/ /var/www/html/api/
COPY server/config/ /var/www/html/server/config/

# Устанавливаем правильные права доступа
RUN find /var/www/html -type d -exec chmod 755 {} \; \
    && find /var/www/html -type f -exec chmod 644 {} \; \
    && chown -R www-data:www-data /var/www/html

# Копируем entrypoint скрипт
COPY server/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Исправляем line endings и устанавливаем права
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh \
    && chmod +x /usr/local/bin/docker-entrypoint.sh \
    && chmod 755 /usr/local/bin/docker-entrypoint.sh

WORKDIR /var/www/html

EXPOSE 80

# Используем bash для запуска скрипта
ENTRYPOINT ["/bin/bash", "/usr/local/bin/docker-entrypoint.sh"]

