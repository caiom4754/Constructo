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

    if ($id == "novoProjeto") {
        exit;
    }
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
    $nome = $_POST['nome'] ?? '';
    $dados = $_POST['dados'] ?? '';
    $acao = $_POST['acao'] ?? 'verificar'; // Novo campo para controle do fluxo

    $dados = trim($dados, '"');
    $data = json_decode($dados, true);
    $datajson = json_encode($data);

    // Verificação do JSON
    if (json_last_error() != JSON_ERROR_NONE) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao decodificar JSON']);
        http_response_code(400);
        exit;
    }

    // Verificação do nome
    if (empty($nome)) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Nome não informado']);
        http_response_code(400);
        exit;
    }

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM projetos WHERE nome = ?");
    $stmt->execute([$nome]);
    $projetoExiste = $stmt->fetchColumn() > 0;

    if ($projetoExiste && $acao === 'verificar') {
        echo json_encode([
            'status' => 'confirmacao',
            'mensagem' => 'Já existe um projeto com esse nome. Deseja sobrescrever?'
        ]);
        exit;
    }

    try {
        if ($projetoExiste) {
            // UPDATE
            $sql = 'UPDATE projetos SET dados = ? WHERE nome = ?';
            $stm = $pdo->prepare($sql);
            $stm->execute([$datajson, $nome]);
            $mensagem = 'Projeto salvo com sucesso!';
        } else {
            // INSERT
            $sql = 'INSERT INTO projetos (nome, dados) VALUES (?, ?)';
            $stm = $pdo->prepare($sql);
            $stm->execute([$nome, $datajson]);
            $mensagem = 'Projeto registrado com sucesso!';
        }

        echo json_encode(['status' => 'sucesso', 'mensagem' => $mensagem]);
        http_response_code($projetoExiste ? 200 : 201);
        
    } catch (PDOException $e) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao salvar projeto: ' . $e->getMessage()]);
        http_response_code(500);
    }
    exit;
}