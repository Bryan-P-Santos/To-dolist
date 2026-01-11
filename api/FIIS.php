<?php
header('Content-Type: application/json');

$fii = $_GET['fii'] ?? null;

if (!$fii) {
    echo json_encode(['erro' => 'FII não informado']);
    exit;
}

$url = "https://brapi.dev/api/quote/$fii";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

echo $response;
