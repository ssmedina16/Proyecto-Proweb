const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
    // Enable CORS for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Client-ID');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Proxy requests to IGDB API or Twitch OAuth
    if (req.url.startsWith('/api/igdb/')) {
        proxyRequest(req, res, 'https://api.igdb.com/v4/', req.url.replace('/api/igdb/', ''));
        return;
    }

    if (req.url.startsWith('/api/twitch/')) {
        proxyRequest(req, res, 'https://id.twitch.tv/', req.url.replace('/api/twitch/', ''));
        return;
    }

    // Serve static files
    let filePath = '.' + req.url;

    // Default to main/index.html
    if (filePath === './') {
        filePath = './main/index.html';
    }

    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Proxy function for API requests
function proxyRequest(clientReq, clientRes, targetHost, targetPath) {
    const parsedUrl = url.parse(targetHost + targetPath);

    let body = '';
    clientReq.on('data', chunk => {
        body += chunk.toString();
    });

    clientReq.on('end', () => {
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || 443,
            path: parsedUrl.path,
            method: clientReq.method,
            headers: {
                ...clientReq.headers,
                host: parsedUrl.hostname
            }
        };

        delete options.headers['host'];

        const proxyReq = https.request(options, (proxyRes) => {
            clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(clientRes);
        });

        proxyReq.on('error', (error) => {
            console.error('Proxy error:', error);
            clientRes.writeHead(500);
            clientRes.end('Proxy error');
        });

        if (body) {
            proxyReq.write(body);
        }
        proxyReq.end();
    });
}

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/`);
    console.log(`📂 Serving files from: ${__dirname}`);
    console.log(`🔄 CORS enabled - API calls will work`);
    console.log(`\n✨ Open your browser and go to: http://localhost:${PORT}/`);
});
