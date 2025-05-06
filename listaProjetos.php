<?php
ini_set('display_errors', 1); // habilita os erros pra ajudar no debug
error_reporting(E_ALL); // mostra todos os erros

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$pdo = new PDO('mysql:host=localhost;dbname=constructo;port=3308;', 'root', '');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // mostra erro do PDO se der ruim

$sql = "SELECT * FROM projetos WHERE id > 3 ORDER BY id ASC";
$stmt = $pdo->query($sql);

$projetos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($projetos);
