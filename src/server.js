import express from 'express';
import fs from 'fs';
import cors from 'cors';
import { DB } from './db.js';
import dotenv from 'dotenv';
import WebSocket from 'ws';
import { WebSocketServer } from 'ws';
import http from 'http';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json({ limit: '2048mb' }));
app.use(express.static('public'));
app.use(express.static('uploads'));

DB.connect();

app.get('/', (req, res) => {
    res.send('Servidor para almacenar RestAPIs para el Track de Desarrollo Móvil CITT 2023.');
});

fs.readdirSync('./src/routes').forEach(async file => {
    if (file.endsWith('.js')) {
        let { path, router } = await import(`./routes/${file}`);
        app.use(path, router);
    }
});

const server = app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});

// const server = http.createServer(app);
const ws = new WebSocketServer({ server: server });
let connections = [];

ws.on('connection', (socket) => {
    connections.push(socket);
    console.log('Cliente conectado');
    socket.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        console.log('Mensaje recibido: ' + parsedMessage)
        connections.forEach((con) => {
            con.send(JSON.stringify(parsedMessage));
        });
        // socket.send('Respuesta del servidor: ' + message);
        // ws.emit('notification', message);
    });

    // Evento de cierre de la conexión WebSocket
    socket.on('close', () => {
        console.log('Cliente desconectado');
    });
});
