<?php
require __DIR__ . '/../integrations/woocommerce/class-boopay-signed-http-client.php';
echo Boopay_Signed_Http_Client::signature($argv[1], 'POST', '/v1/admin/catalog/sync', $argv[2], $argv[3], $argv[4]);
