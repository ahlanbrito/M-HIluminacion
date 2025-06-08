<?php
header('Content-Type: application/json'); // Indicamos que la respuesta será JSON

// Permite solicitudes CORS (si tu frontend y backend están en diferentes dominios)
// Considera configurar esto de manera más segura en producción
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// --- Configuración ---
$github_token = 'TU_GITHUB_PERSONAL_ACCESS_TOKEN'; // ¡REEMPLAZA CON TU TOKEN REAL!
$github_owner = 'NOMBRE_DE_TU_USUARIO_O_ORGANIZACION_DE_GITHUB'; // Ej: 'miusuario' o 'miorganizacion'
$github_repo = 'NOMBRE_DE_TU_REPOSITORIO'; // Ej: 'mi-sitio-web'
$github_branch = 'main'; // O 'master', dependiendo de tu rama principal
$github_folder = 'comentarios'; // La carpeta donde quieres guardar los comentarios

// Leer los datos JSON enviados desde el frontend
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Datos JSON inválidos.']);
    exit();
}

if (!isset($data['nombre']) || !isset($data['correo']) || !isset($data['comentario'])) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos del comentario.']);
    exit();
}

$nombre = htmlspecialchars($data['nombre']);
$correo = htmlspecialchars($data['correo']);
$comentario = htmlspecialchars($data['comentario']);

// Crear el contenido del archivo
$contenido_archivo = "Nombre: {$nombre}\nCorreo: {$correo}\nComentario:\n{$comentario}\n";

// Generar un nombre de archivo único
$timestamp = date('Ymd-His');
$file_name = "comentario-{$timestamp}.txt";
$path_in_repo = "{$github_folder}/{$file_name}";

// Codificar el contenido en Base64 (requerido por la API de GitHub)
$content_base64 = base64_encode($contenido_archivo);

// Preparar los datos para la API de GitHub
$github_api_url = "https://api.github.com/repos/{$github_owner}/{$github_repo}/contents/{$path_in_repo}";

$payload = json_encode([
    'message' => "Nuevo comentario de {$nombre} ({$correo})",
    'content' => $content_base64,
    'branch' => $github_branch
]);

// Inicializar cURL
$ch = curl_init($github_api_url);

// Configurar cURL para la solicitud POST
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Devuelve la transferencia como una cadena
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT"); // Para crear/actualizar un archivo
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'User-Agent: PHP-Script', // Requerido por la API de GitHub
    'Authorization: token ' . $github_token,
    'Accept: application/vnd.github.v3+json',
    'Content-Type: application/json',
    'Content-Length: ' . strlen($payload)
]);

// Ejecutar la solicitud cURL
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Cerrar cURL
curl_close($ch);

// Decodificar la respuesta de GitHub
$github_response = json_decode($response, true);

if ($http_code >= 200 && $http_code < 300) {
    echo json_encode(['success' => true, 'message' => 'Comentario subido a GitHub.', 'github_url' => $github_response['content']['html_url'] ?? '']);
} else {
    $error_message = $github_response['message'] ?? 'Error desconocido';
    echo json_encode(['success' => false, 'message' => "Error al subir a GitHub: {$error_message}"]);
    // Opcional: registrar el error completo para depuración
    error_log("Error de GitHub (HTTP {$http_code}): " . $response);
}
?>
