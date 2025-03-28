<?php
//! PESQUISAR O QUE É ISSO AQUI
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

/*
~ onde parei:
~ refazer a conexão adaptando para o tipo de cod que o william nos ensinou
~ primeiro testar apenas com o nome, depois tentar inserir o Json
*/

$pdo = new PDO('mysql:host=localhost;dbname=constructo;port=3308;', 'root', '');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    //recepção
    $nome = (isset($_POST['nome'])) ? $_POST['nome'] : '';

    $dados = (isset($_POST['dados'])) ? $_POST['dados'] : ''; 

    $dados = trim($dados,'"');

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
        $stm ->bindParam(':nome', $nome);
        $stm ->bindParam(':dados', $datajson);
        $stm -> execute();


        if ($stm) {
            echo json_encode(['mensagem' => 'Projeto registrado com sucesso']);
            http_response_code(201); // Sucesso na criação
        } else {
            echo json_encode(['mensagem' => 'Erro ao registrar projeto']);
            http_response_code(500); // Erro no servidor
        }
    } else {
        echo json_encode(['mensagem' => 'Nome não informado']);
        http_response_code(400); // Bad Request
    }
} else {
    echo json_encode(['mensagem' => 'Parâmetros não encontrados']);
    http_response_code(400); // Bad Request
}


//! FUNCIONANDO ULTIMA VERÇÂO OK
