<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Paths
    |--------------------------------------------------------------------------
    |
    | Define qué rutas estarán disponibles para solicitudes CORS.
    | Normalmente se habilitan todas las rutas de la API y Sanctum.
    |
    */
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Methods
    |--------------------------------------------------------------------------
    |
    | Métodos HTTP permitidos. Con '*' aceptas todos (GET, POST, PUT, DELETE, etc).
    |
    */
    'allowed_methods' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins
    |--------------------------------------------------------------------------
    |
    | Aquí defines qué dominios pueden hacer solicitudes.
    | Con '*' aceptas cualquier origen (útil en desarrollo).
    | Para producción, pon tu dominio específico, ej: ['https://midominio.com']
    |
    */
    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    /*
    |--------------------------------------------------------------------------
    | Allowed Headers
    |--------------------------------------------------------------------------
    |
    | Con '*' aceptas cualquier encabezado (Authorization, Content-Type, etc).
    |
    */
    'allowed_headers' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Exposed Headers
    |--------------------------------------------------------------------------
    |
    | Encabezados que el navegador puede leer en la respuesta.
    |
    */
    'exposed_headers' => [],

    /*
    |--------------------------------------------------------------------------
    | Max Age
    |--------------------------------------------------------------------------
    |
    | Tiempo en segundos que el navegador puede cachear la respuesta CORS.
    |
    */
    'max_age' => 0,

    /*
    |--------------------------------------------------------------------------
    | Supports Credentials
    |--------------------------------------------------------------------------
    |
    | Si necesitas enviar cookies o credenciales, ponlo en true.
    | Normalmente se deja en false si usas tokens Bearer.
    |
    */
    'supports_credentials' => false,

];
