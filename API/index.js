const http = require('http');
const { registerUser, authenticateUser } = require('./auth');
const { getLights, updateLight, getDoors, updateDoor } = require('./actions');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const port = 3000;
const PIC_DIR = path.join(__dirname, 'fotos');
const PIC_PATH = path.join(PIC_DIR, 'ultima.jpg');

const server = http.createServer((req, res) => {
    const { method, url } = req;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
        res.writeHead(204); // No Content
        res.end();
        return;
    }

    if (url === '/register' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { username, password } = JSON.parse(body);
            const result = registerUser(username, password);
            res.writeHead(result.success ? 201 : 400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        });
    }
    else if (url === '/login' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { username, password } = JSON.parse(body);
            const result = authenticateUser(username, password);
            res.writeHead(result.success ? 200 : 401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        });
    }
    else if (req.method === 'POST' && req.url.startsWith('/lights/')) {
        let body = '';
        req.on('data', chunk => (body += chunk));
        req.on('end', () => {
            const { state } = JSON.parse(body);
            const room = req.url.split('/')[2];
            const result = updateLight(room, state);
            if (result) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, lights: result }));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ success: false, message: 'Luz no encontrada' }));
            }
        });
    }

    else if (req.method === 'POST' && req.url.startsWith('/doors/')) {
        let body = '';
        req.on('data', chunk => (body += chunk));
        req.on('end', () => {
            const { state } = JSON.parse(body);
            const door = req.url.split('/')[2];
            const result = updateDoor(door, state);
            if (result) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, doors: result }));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ success: false, message: 'Puerta no encontrada' }));
            }
        });
    }
    else if (req.method === 'GET' && req.url === '/picture') {
        exec(`fswebcam -r 640x480 --jpeg 90 -D 1 ${PIC_PATH}`, (err, stdout, stderr) => {
            if (err) {
                console.error('Error al tomar foto:', stderr);
                res.writeHead(500);
                res.end('Error al tomar la foto');
                return;
            }

            res.writeHead(200);
            res.end('Foto tomada y guardada como ultima.jpg');
        });

    } else if (req.method === 'GET' && req.url === '/last-picture') {
        // Enviar la última foto tomada
        if (fs.existsSync(PIC_PATH)) {
            fs.readFile(PIC_PATH, (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end('No se pudo leer la imagen');
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                res.end(data);
            });
        } else {
            res.writeHead(404);
            res.end('No hay ninguna foto almacenada');
        }

    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Ruta no encontrada' }));
    }
});

server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
