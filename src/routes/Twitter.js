import express from 'express';
import { DB } from '../db.js';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const router = express.Router();
export const path = '/twitter';

router.get('/', async (req, res) => {
    let posts;
    if (!req.params.id) posts = await DB.get('CITT2023', 'Twitter');
    else posts = await DB.get('CITT2023', 'Twitter', { _id: req.params.id });
    res.status(200).json(posts);
});

router.post('/', async (req, res) => {
    const data = req.body;
    const REQUIRED_FIELDS = ['user', 'title', 'content'];
    const POSSIBLE_FIELDS = ['user', 'icon', 'title', 'content', 'attachments'];
    if (!REQUIRED_FIELDS.every(field => field in data)) return res.status(400).json({ message: 'Faltan campos requeridos.' });
    if (!POSSIBLE_FIELDS.filter(r_field => POSSIBLE_FIELDS.includes(r_field))) return res.status(400).json({ message: 'Hay campos no permitidos.' });
    let result;
    data.date = new Date();
    if (!data.icon) {
        data.icon = 'https://citt2023.up.railway.app/no_pfp.svg'
    } else {
        let uuid = uuidv4();
        let iconPath = base64Decoder(data.icon, uuid);
        data.icon = `https://citt2023.up.railway.app/${iconPath}`
    }
    let attachments = [];
    if (data.attachments) {
        for (let attachment of data.attachments) {
            let uuid = uuidv4();
            let attachmentPath = base64Decoder(attachment, uuid);
            attachments.push(`https://citt2023.up.railway.app/${attachmentPath}`);
        }
    }
    data.attachments = attachments;
    await DB.post('CITT2023', 'Twitter', data);
    if (!result) return res.status(500).json({ message: 'Error al guardar el tweet.' });
    return res.status(201).json({ message: 'Tweet guardado correctamente.' });
});

router.put('/:id', async (req, res) => {
    const data = req.body;
    const REQUIRED_FIELDS = ['user', 'title', 'content'];
    const POSSIBLE_FIELDS = ['user', 'icon', 'title', 'content', 'attachments'];
    if (!REQUIRED_FIELDS.every(field => field in data)) return res.status(400).json({ message: 'Faltan campos requeridos.' });
    if (!POSSIBLE_FIELDS.filter(r_field => POSSIBLE_FIELDS.includes(r_field))) return res.status(400).json({ message: 'Hay campos no permitidos.' });
    const result = await DB.put('CITT2023', 'Twitter', { _id: req.params.id }, data);
    if (!result) return res.status(500).json({ message: 'Error al actualizar el tweet.' });
    return res.status(200).json({ message: 'Tweet actualizado correctamente.' });
});

router.delete('/:id', async (req, res) => {
    const result = await DB.delete('CITT2023', 'Twitter', req.params.id );
    if (!result) return res.status(500).json({ message: 'Error al eliminar el tweet.' });
    return res.status(200).json({ message: 'Tweet eliminado correctamente.' });
});

function base64Decoder(base64Data, nombre) {
    const mimeType = getExtensionFromB64(base64Data);
    const extension = getImageTypeFromMimeType(mimeType);

    const newB64Data = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(newB64Data, 'base64');
    fs.writeFileSync(`uploads/${nombre}.${extension}`, buffer);
    return `${nombre}.${extension}`;
}

function getExtensionFromB64(base64Data) {
    const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,/);
    if (matches && matches.length > 1) {
      return matches[1];
    }
    return '';
}

function getImageTypeFromMimeType(mimeType) {
    const mimeTypeToImageTypeMap = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      // Agrega otros tipos MIME y tipos de imagen según sea necesario
    };
  
    return mimeTypeToImageTypeMap[mimeType] || '';
  }