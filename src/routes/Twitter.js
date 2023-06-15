import express from 'express';
import { DB } from '../db.js';

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
    if (!REQUIRED_FIELDS.every(field => field in data)) return res.status(400).json({ message: 'Faltan campos requeridos.' });
    const result = await DB.post('CITT2023', 'Twitter', data);
    if (!result) return res.status(500).json({ message: 'Error al guardar el tweet.' });
    return res.status(201).json({ message: 'Tweet guardado correctamente.' });
});

router.put('/:id', async (req, res) => {
    const data = req.body;
    const REQUIRED_FIELDS = ['user', 'title', 'content'];
    if (!REQUIRED_FIELDS.every(field => field in data)) return res.status(400).json({ message: 'Faltan campos requeridos.' });
    const result = await DB.put('CITT2023', 'Twitter', { _id: req.params.id }, data);
    if (!result) return res.status(500).json({ message: 'Error al actualizar el tweet.' });
    return res.status(200).json({ message: 'Tweet actualizado correctamente.' });
});

router.delete('/:id', async (req, res) => {
    const result = await DB.delete('CITT2023', 'Twitter', req.params.id );
    if (!result) return res.status(500).json({ message: 'Error al eliminar el tweet.' });
    return res.status(200).json({ message: 'Tweet eliminado correctamente.' });
});