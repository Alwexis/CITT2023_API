import { MongoClient, ObjectId } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const URL = process.env.DB_URL;

export class DB {
    connection = undefined;

    static async connect() {
        try {
            const client = new MongoClient(URL);
            this.connection = await client.connect();
            return true;
        } catch (error) {
            console.error(error.message);
            return false;
        }
    }

    static async get(database, collection, query = undefined) {
        try {
            if (!this.connection) throw new Error('No hay conexión con la base de datos.');
            const db = this.connection.db(database);
            let data = undefined;
            if (!query) data = await db.collection(collection).find().toArray();
            else data = await db.collection(collection).find(query).toArray();
            return data;
        } catch (error) {
            console.error(error.message);
            return [];
        }
    }

    static async post(database, collection, data) {
        try {
            if (!this.connection) throw new Error('No hay conexión con la base de datos.');
            const db = this.connection.db(database);
            const result = await db.collection(collection).insertOne(data);
            return result;
        } catch (error) {
            console.error(error.message);
            return undefined;
        }
    }

    static async put(database, collection, id, data) {
        try {
            if (!this.connection) throw new Error('No hay conexión con la base de datos.');
            const db = this.connection.db(database);
            const result = await db.collection(collection).updateOne({ _id: ObjectId(id) }, { $set: data });
            return result;
        } catch (error) {
            console.error(error.message);
            return undefined;
        }
    }

    static async delete(database, collection, id) {
        try {
            if (!this.connection) throw new Error('No hay conexión con la base de datos.');
            const db = this.connection.db(database);
            const result = await db.collection(collection).deleteOne({ _id: new ObjectId(id) });
            return result;
        } catch (error) {
            console.error(error.message);
            return undefined;
        }
    }
}