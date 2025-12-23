const API_CONFIG = {
    baseUrl: 'https://api.igdb.com/v4', // Nota: IGDB requiere usar un proxy CORS en frontend puro o un backend
    clientId: 'lexhrfxh29xqjzpmaozu35s0iocp4y',
    clientSecret: 'vur4q2yrs1foxr51ibn5iuocs24sgn',
    authUrl: 'https://id.twitch.tv/oauth2/token'
};

// Función para obtener el token de acceso (Client Credentials Grant)
async function getAccessToken() {
    // Implementar lógica de autenticación aquí
}

// Función genérica para hacer peticiones a la API
async function fetchIGDB(endpoint, query) {
    // Implementar fetch con headers de Client-ID y Authorization
}
