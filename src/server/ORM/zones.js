import { insertDB, readDB } from "../DB/db.js"

export const newZone = async (city, state, lat, lot, gridX, gridY, status, detail) => {
    const newZone = {
      city: city,
      state: state,
      lat: lat,
      lot: lot,
      gridX: gridX,
      gridY: gridY,
      gridID: gridID,
      status: status,
      detail: detail
    }

    await insertDB()
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