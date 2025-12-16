<?php
// Включить отображение ошибок для отладки
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

$sqlitePath = '/var/www/html/server/database/database.sqlite';

// Убедиться, что директория существует и доступна для записи
$dbDir = dirname($sqlitePath);
if (!is_dir($dbDir)) {
    mkdir($dbDir, 0755, true);
}

try {
    $pdo = new PDO("sqlite:$sqlitePath");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    createTables($pdo);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

/**
 * Минимальная схема БД для кофейни:
 *  - users    — пользователи с логином и захешированным паролем
 *  - products — карточки кофейных напитков
 */
function createTables(PDO $pdo): void {
    // Таблица пользователей
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // Таблица товаров (кофе)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            category TEXT NOT NULL,
            image TEXT NOT NULL,
            is_featured INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    ");

    seedInitialData($pdo);
}

/**
 * Первичное заполнение БД тестовыми пользователями и кофейными товарами.
 */
function seedInitialData(PDO $pdo): void {
    // Пользователи
    $stmt = $pdo->query("SELECT COUNT(*) AS cnt FROM users");
    $usersCount = (int) ($stmt->fetch()['cnt'] ?? 0);

    if ($usersCount === 0) {
        $passwordAdmin = password_hash('admin123', PASSWORD_DEFAULT);
        $passwordUser  = password_hash('user123', PASSWORD_DEFAULT);

        $insertUser = $pdo->prepare("
            INSERT INTO users (name, email, password)
            VALUES (:name, :email, :password)
        ");

        $insertUser->execute([
            ':name'     => 'Admin',
            ':email'    => 'admin@coffee.local',
            ':password' => $passwordAdmin,
        ]);

        $insertUser->execute([
            ':name'     => 'Guest',
            ':email'    => 'guest@coffee.local',
            ':password' => $passwordUser,
        ]);
    }

    // Продукты
    $stmt = $pdo->query("SELECT COUNT(*) AS cnt FROM products");
    $productsCount = (int) ($stmt->fetch()['cnt'] ?? 0);

    if ($productsCount === 0) {
        $pdo->exec("
            INSERT INTO products (name, description, price, category, image, is_featured) VALUES
            ('Cappuccino', 'Coffee 50%, Milk 50%', 6.00, 'cappuccino', 'cappuccino.png', 1),
            ('Chai Latte', 'Coffee 30%, Milk 70%', 5.50, 'latte', 'chai_latte.png', 1),
            ('Macchiato', 'Coffee 80%, Milk 20%', 4.50, 'macchiato', 'macchiato.png', 0),
            ('Expresso', 'Coffee 100%, Milk 0%', 4.00, 'expresso', 'expresso.png', 0)
        ");
    }
}
?>
