import {readFile, writeFile} from "node:fs/promises";

const DB_PATH = new URL("./db.json", import.meta.url).pathname

export const readDB = async () => {
    const result = await readFile(DB_PATH, 'utf-8')
    return JSON.parse(result)
}

export const saveDB = async (db) => {
    await writeFile(DB_PATH, JSON.stringify(db, null, 2))
    return db
}

export const insertDB = async (data) => {
    const db = await readDB()
    db.zones.push(data)
    await saveDB(db)
    return data
}