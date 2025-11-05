import { insertDB, readDB, saveDB } from "../DB/db.js"

export const newZone = async (city, state, lat, lot, gridX, gridY, gridId, status, detail) => {
    const newZone = {
        id: Date.now(),
        city: city,
        state: state,
        lat: lat,
        lot: lot,
        gridX: gridX,
        gridY: gridY,
        gridId: gridId,
        status: status,
        detail: detail
    }
    await insertDB(newZone)
    return newZone;

}

export const getAllZones = async () => {
    const {zones} = await readDB();
    return zones
}

export const findZone = async (city, state) => {
    const zones = await getAllZones()
    const result = zones.filter((zone) => {return zone.city === city && zone.state === state})
    return result
}

export const removeAllZone = async () => {
    await saveDB({zones:[]})
}