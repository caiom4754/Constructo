<?php
ini_set('display_errors', 1); // Habilitar erros para depuração
error_reporting(E_ALL); // Relatar todos os erros

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$pdo = new PDO('mysql:host=localhost;dbname=constructo;port=3308;', 'root', '');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($id > 0) {
        $sql = 'SELECT * FROM projetos WHERE id = :id';
        $stm = $pdo->prepare($sql);
        $stm->bindParam(':id', $id, PDO::PARAM_INT);
        $stm->execute();

        $projeto = $stm->fetch(PDO::FETCH_ASSOC);

        if ($projeto) {
            echo json_encode($projeto);
            http_response_code(200); // Sucesso
        } else {
            echo json_encode(['mensagem' => 'Projeto não encontrado']);
            http_response_code(404); // Não encontrado
        }
    } else {
        echo json_encode(['mensagem' => 'ID inválido']);
        http_response_code(400); // Requisição inválida
    }
    exit;
}


if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Recepção dos dados
    $nome = (isset($_POST['nome'])) ? $_POST['nome'] : '';
    $dados = (isset($_POST['dados'])) ? $_POST['dados'] : '';

    $dados = trim($dados, '"');
    $data = json_decode($dados, true);
    $datajson = json_encode($data);

    // Verifica se o JSON foi decodificado corretamente
    if (json_last_error() != JSON_ERROR_NONE) {
        echo json_encode(['mensagem' => 'Erro ao decodificar JSON']);
        http_response_code(400); // Bad Request
        exit;
    }

    // Verifica se o nome foi fornecido
    if (!empty($nome)) {
        $sql = 'INSERT INTO projetos (nome, dados) VALUES (:nome, :dados)';
        $stm = $pdo->prepare($sql);
        $stm->bindParam(':nome', $nome);
        $stm->bindParam(':dados', $datajson);
        $stm->execute();

        if ($stm) {
            echo json_encode(['mensagem' => 'Projeto registrado com sucesso']);
            http_response_code(201); // Sucesso na criação
            exit;
        } else {
            echo json_encode(['mensagem' => 'Erro ao registrar projeto']);
            http_response_code(500); // Erro no servidor
            exit;
        }
    } else {
        echo json_encode(['mensagem' => 'Nome não informado']);
        http_response_code(400); // Bad Request
        exit;
    }
} else {
    echo json_encode(['mensagem' => 'Método de requisição inválido']);
    http_response_code(405); // Method Not Allowed
    exit;
}
?>
