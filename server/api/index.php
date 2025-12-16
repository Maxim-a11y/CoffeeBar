<?php
// Включить отображение ошибок для отладки
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../server/config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$parsedPath = parse_url($requestUri, PHP_URL_PATH);

// Очистка пути от /api/ и query string
$path = str_replace('/api/', '', $parsedPath);
$path = trim($path, '/');
// Убираем index.php если есть в пути
$path = str_replace('index.php', '', $path);
$path = trim($path, '/');

// Если путь передаётся через GET параметр (для rewrite)
if (isset($_GET['path'])) {
    $path = trim($_GET['path'], '/');
}

// Обработка пустого пути или /
if (empty($path) || $path === 'index.php') {
    $path = 'health';
}

switch ($path) {
    case 'users':
        handleUsers($method);
        break;
    case 'auth/login':
        handleAuthLogin($method);
        break;
    case 'auth/register':
        handleAuthRegister($method);
        break;
    case 'products':
        handleProducts($method);
        break;
    case 'health':
        handleHealth();
        break;
    default:
        http_response_code(404);
        echo json_encode([
            'error' => 'Endpoint not found',
            'path'  => $path,
            'request_uri' => $requestUri
        ]);
        break;
}

function handleUsers($method) {
    switch ($method) {
        case 'GET':
            getUsers();
            break;
        case 'POST':
            registerUser();
            break;
        case 'PUT':
            updateUser();
            break;
        case 'DELETE':
            deleteUser();
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
}

/**
 * POST /api/auth/login
 */
function handleAuthLogin($method) {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    login();
}

/**
 * POST /api/auth/register
 */
function handleAuthRegister($method) {
    if ($method !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        return;
    }

    registerUser();
}

function handleHealth() {
    echo json_encode([
        'status' => 'ok',
        'timestamp' => date('Y-m-d H:i:s'),
        'version' => '1.0.0'
    ]);
}

/**
 * /api/products
 *  - GET  /api/products          — список всех товаров
 *  - GET  /api/products?id={id}  — один товар
 *  - POST /api/products          — создать товар (просто, без авторизации)
 */
function handleProducts(string $method): void {
    switch ($method) {
        case 'GET':
            getProducts();
            break;
        case 'POST':
            createProduct();
            break;
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
}

function getProducts(): void {
    global $pdo;

    try {
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM products WHERE id = :id");
            $stmt->execute([':id' => (int) $_GET['id']]);
            $product = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$product) {
                http_response_code(404);
                echo json_encode(['error' => 'Product not found']);
                return;
            }

            echo json_encode($product);
            return;
        }

        $stmt = $pdo->query("SELECT * FROM products ORDER BY id ASC");
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['products' => $products]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function createProduct(): void {
    global $pdo;

    $input = json_decode(file_get_contents('php://input'), true) ?? [];

    if (
        empty($input['name']) ||
        !isset($input['price']) ||
        empty($input['category']) ||
        empty($input['image'])
    ) {
        http_response_code(400);
        echo json_encode(['error' => 'name, price, category and image are required']);
        return;
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO products (name, description, price, category, image, is_featured)
            VALUES (:name, :description, :price, :category, :image, :is_featured)
        ");

        $stmt->execute([
            ':name'        => $input['name'],
            ':description' => $input['description'] ?? '',
            ':price'       => (float) $input['price'],
            ':category'    => $input['category'],
            ':image'       => $input['image'],
            ':is_featured' => !empty($input['is_featured']) ? 1 : 0,
        ]);

        $id = $pdo->lastInsertId();

        echo json_encode([
            'message' => 'Product created successfully',
            'id'      => $id,
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function getUsers() {
    global $pdo;
    try {
        $stmt = $pdo->query("SELECT id, name, email, created_at FROM users ORDER BY created_at DESC");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['users' => $users]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

/**
 * Регистрация пользователя с хешированием пароля
 */
function registerUser() {
    global $pdo;
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (
        !isset($input['name']) ||
        !isset($input['email']) ||
        !isset($input['password'])
    ) {
        http_response_code(400);
        echo json_encode(['error' => 'Name, email and password are required']);
        return;
    }
    
    try {
        // Проверяем, что пользователя ещё нет
        $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $check->execute([$input['email']]);
        if ($check->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'User with this email already exists']);
            return;
        }

        $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$input['name'], $input['email'], $hashedPassword]);
        $userId = $pdo->lastInsertId();
        
        echo json_encode([
            'message' => 'User registered successfully',
            'user_id' => $userId
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function updateUser() {
    global $pdo;
    $input = json_decode(file_get_contents('php://input'), true);
    $userId = $_GET['id'] ?? null;
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID is required']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("UPDATE users SET name = ?, email = ? WHERE id = ?");
        $stmt->execute([$input['name'], $input['email'], $userId]);
        
        echo json_encode(['message' => 'User updated successfully']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function deleteUser() {
    global $pdo;
    $userId = $_GET['id'] ?? null;
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode(['error' => 'User ID is required']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        
        echo json_encode(['message' => 'User deleted successfully']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

/**
 * Логин пользователя по email + пароль с проверкой hash
 */
function login() {
    global $pdo;
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['email']) || !isset($input['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
        $stmt->execute([$input['email']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($input['password'], $user['password'] ?? '')) {
            unset($user['password']);
            echo json_encode([
                'message' => 'Login successful',
                'user' => $user,
                'token' => 'dummy_token_' . time()
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
