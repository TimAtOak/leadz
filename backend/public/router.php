<?php
if (php_sapi_name() === 'cli-server') {
    $req = $_SERVER['REQUEST_URI'] ?? '';
    // If the request is absolute-form (e.g. "http://host/path"), normalize to path
    if (strpos($req, 'http://') === 0 || strpos($req, 'https://') === 0) {
        $parts = parse_url($req);
        $_SERVER['REQUEST_URI'] = ($parts['path'] ?? '/') . (isset($parts['query']) ? '?' . $parts['query'] : '');
    }

    $file = __DIR__ . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (is_file($file)) {
        return false; // serve the requested resource as-is
    }
}

return require __DIR__ . '/index.php';
