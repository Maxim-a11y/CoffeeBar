FROM php:8.2-fpm

# Обновляем пакеты и устанавливаем базовые зависимости
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем Node.js для сборки фронтенда через gulp
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем остальные зависимости
RUN apt-get update && apt-get install -y \
    nginx \
    sqlite3 \
    libsqlite3-dev \
    libzip-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo pdo_sqlite zip

# Настраиваем PHP-FPM для прослушивания TCP порта 9000
RUN sed -i 's/listen = .*/listen = 127.0.0.1:9000/' /usr/local/etc/php-fpm.d/www.conf 2>/dev/null || \
    echo "listen = 127.0.0.1:9000" >> /usr/local/etc/php-fpm.d/www.conf

RUN mkdir -p /var/www/html /var/log/nginx /var/www/html/server/database

# Копируем клиентскую часть для сборки
WORKDIR /tmp/client
COPY client/package*.json ./
RUN npm install

# Копируем исходники клиента (исключая node_modules)
COPY client/gulpfile.js ./
COPY client/gulp/ ./gulp/
COPY client/src/ ./src/

# Собираем через gulp с обработкой ошибок
RUN npm run build 2>&1 | tee /tmp/build.log || { \
    echo "Build failed. Checking build log:" && \
    cat /tmp/build.log && \
    echo "Current directory:" && \
    ls -la && \
    if [ -d "dist" ]; then \
        echo "WARNING: dist exists despite error, continuing..." && \
        ls -la dist/; \
    else \
        echo "ERROR: dist not found!" && \
        exit 1; \
    fi \
}

# Проверяем, что dist создан
RUN if [ ! -d "dist" ]; then \
    echo "ERROR: dist directory not found!" && \
    exit 1; \
fi && \
    echo "Dist directory contents:" && \
    ls -la dist/ || true

# Копируем собранный dist в финальную директорию
RUN mkdir -p /var/www/html/client/dist \
    && cp -r dist/* /var/www/html/client/dist/ \
    && ls -la /var/www/html/client/dist/

# Копируем серверную часть
COPY server/ /var/www/html/server/
COPY server/api/ /var/www/html/api/
COPY server/config/ /var/www/html/server/config/

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/sites-available/default

# Создаём симлинк для sites-enabled
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default \
    && rm -f /etc/nginx/sites-enabled/default.bak 2>/dev/null || true

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

