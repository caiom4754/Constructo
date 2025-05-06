<?php
// permite requisições de qualquer origem (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$pdo = new PDO('mysql:host=localhost;dbname=constructo;port=3308;', 'root', '');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? null;

    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM projetos WHERE id = ?");
        $sucesso = $stmt->execute([$id]);

        if ($sucesso) {
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Erro ao excluir do banco de dados"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "ID não fornecido"]);
    }
    exit;
}
?>
