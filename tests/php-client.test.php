<?php
require __DIR__ . '/../integrations/woocommerce/class-boopay-signed-http-client.php';
class WP_Error { public function __construct(public $code, public $message, public $data = null) {} }
$requests = [];
$response = ['response' => ['code' => 200], 'body' => '{}'];
function wp_json_encode($value) { return json_encode($value); }
function is_wp_error($value) { return $value instanceof WP_Error; }
function wp_remote_retrieve_response_code($result) { return $result['response']['code']; }
function wp_safe_remote_post($url, $options) { global $requests, $response; $requests[] = [$url, $options]; return $response; }
function check($condition, $label) { if (!$condition) { throw new RuntimeException($label); } echo "PASS: $label\n"; }
$credentials = ['token' => 'synthetic-token', 'signing_secret' => 'synthetic-secret', 'tenant_id' => 'tenant-a', 'integration_id' => 'test-integration'];
foreach (['http://api.example', 'https://evil.example', 'https://user:pass@api.example', 'https://api.example?redirect=1'] as $url) {
    try { new Boopay_Signed_Http_Client($url, ['https://api.example'], $credentials); throw new RuntimeException('Destino aceito'); }
    catch (InvalidArgumentException $expected) {}
}
check(count($requests) === 0, 'destinos não permitidos rejeitados antes do transporte');
$client = new Boopay_Signed_Http_Client('https://api.example', ['https://api.example'], $credentials);
$client->sync_catalog(['merchant_id' => 1, 'items' => []]);
[$url, $options] = $requests[0];
check($options['timeout'] === 10 && $options['redirection'] === 0 && $options['sslverify'] === true, 'timeout, redirects e TLS');
$headers = $options['headers'];
check($headers['X-Boopay-Signature'] === Boopay_Signed_Http_Client::signature('synthetic-secret', 'POST', '/v1/admin/catalog/sync', $headers['X-Boopay-Timestamp'], $headers['X-Boopay-Nonce'], $options['body']), 'assinatura do corpo exato');
$client->sync_catalog(['merchant_id' => 1, 'items' => []]);
check($requests[0][1]['headers']['X-Boopay-Nonce'] !== $requests[1][1]['headers']['X-Boopay-Nonce'], 'nonce novo por tentativa');
$response = new WP_Error('transport', 'secret-response');
check($client->sync_catalog([])->message === 'API indisponível; consulte o diagnóstico da integração.', 'erro de transporte sem vazamento');
$response = ['response' => ['code' => 403], 'body' => 'remote-secret'];
check($client->sync_catalog([])->data === ['status' => 403], 'erro HTTP sem corpo remoto');
echo "6 grupos de verificações PHP passaram; funções WordPress substituídas, sem instalação real.\n";
