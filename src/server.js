import express from 'express';
import fs from 'fs';
import cors from 'cors';
import { DB } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json({ limit: '2048mb' }));

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

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});