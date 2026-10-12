<?php
/**
 * Transporte assinado com destino restrito pelo operador do WordPress.
 */
final class Boopay_Signed_Http_Client {
    private string $base_url;
    private array $credentials;

    public function __construct(string $base_url, array $allowed_bases, array $credentials) {
        $this->base_url = self::validate_base($base_url, $allowed_bases);
        foreach (['token', 'signing_secret', 'tenant_id', 'integration_id'] as $field) {
            if (empty($credentials[$field]) || !is_string($credentials[$field])
                || preg_match('/[\r\n]/', $credentials[$field])) {
                throw new InvalidArgumentException('Credencial incompleta.');
            }
        }
        $this->credentials = $credentials;
    }

    public static function validate_base(string $base_url, array $allowed_bases): string {
        $base_url = rtrim($base_url, '/');
        $parts = parse_url($base_url);
        if (!$parts || ($parts['scheme'] ?? '') !== 'https' || empty($parts['host'])
            || isset($parts['user']) || isset($parts['pass']) || isset($parts['query']) || isset($parts['fragment'])
            || !empty($parts['path'])
            || !in_array($base_url, array_map(static fn($url) => rtrim($url, '/'), $allowed_bases), true)) {
            throw new InvalidArgumentException('Destino da API não permitido.');
        }
        return $base_url;
    }

    public static function signature(string $secret, string $method, string $path, string $timestamp, string $nonce, string $body): string {
        return hash_hmac('sha256', implode("\n", ['v1', strtoupper($method), $path, $timestamp, $nonce, hash('sha256', $body)]), $secret);
    }

    public function sync_catalog(array $payload) {
        return $this->send('/v1/admin/catalog/sync', $payload);
    }

    public function send(string $path, $payload) {
        if (!in_array($path, ['/v1/admin/catalog/sync', '/v1/events', '/v1/integrations/health'], true)) {
            return new WP_Error('boopay_invalid_path', 'Operação não permitida.');
        }
        $body = wp_json_encode($payload);
        if (!is_string($body)) {
            return new WP_Error('boopay_invalid_payload', 'Não foi possível preparar o envio.');
        }
        $timestamp = (string) time();
        $nonce = bin2hex(random_bytes(16));
        $result = wp_safe_remote_post($this->base_url . $path, [
            'timeout' => 10,
            'redirection' => 0,
            'sslverify' => true,
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $this->credentials['token'],
                'X-Boopay-Tenant' => $this->credentials['tenant_id'],
                'X-Boopay-Integration' => $this->credentials['integration_id'],
                'X-Boopay-Timestamp' => $timestamp,
                'X-Boopay-Nonce' => $nonce,
                'X-Boopay-Signature' => self::signature($this->credentials['signing_secret'], 'POST', $path, $timestamp, $nonce, $body),
            ],
            'body' => $body,
            'limit_response_size' => 1048576,
        ]);
        // Não propagar corpo de erro remoto nem credenciais para logs/tela.
        if (is_wp_error($result)) {
            return new WP_Error('boopay_transport_error', 'API indisponível; consulte o diagnóstico da integração.');
        }
        $status = wp_remote_retrieve_response_code($result);
        if ($status < 200 || $status >= 300) {
            return new WP_Error('boopay_http_error', 'Envio rejeitado pela API.', ['status' => $status]);
        }
        return $result;
    }
}
