import { findZone, getAllZones, newZone } from './server/ORM/zones.js';
import { fetchForecast, getAllValidZones } from './utils.js';
export const searchHelper = async (args) => {
    const response = await fetch(`https://api.weather.gov/points/${args.lat},${args.lot}`, {
        method: "GET",
        headers: {
            "accept": "application/geo+json"
        }
    })
    const result = await response.json()
    if (response.status !== 200) {
        await newZone(
            "Unavailable",
            "Unavailable",
            args.lat, 
            args.lot,
            "Unavailable",
            "Unavailable",
            "Unavailable",
            response.status,
            result.detail
        )
        throw new Error("NWS API call was unsuccessful", {
            cause: {
                httpStatus:  response.status,
                title: result.title,
                type: result.type,
                detail: result.detail
            }
        })
    } else {
        const loc_info = result.properties;
        const zoneResult = await findZone(loc_info.relativeLocation.properties.city.toLowerCase(), 
        loc_info.relativeLocation.properties.state.toLowerCase())
        const zone = zoneResult.pop()
        if (zone === undefined) {
            await newZone(
                loc_info.relativeLocation.properties.city.toLowerCase(),
                loc_info.relativeLocation.properties.state.toLowerCase(), 
                args.lat, 
                args.lot,
                loc_info.gridX,
                loc_info.gridY,
                loc_info.gridId.toUpperCase(),
                result.status, 
                result.ok
            )
            console.log(`Saved ${loc_info.relativeLocation.properties.city.toLowerCase()}, ${loc_info.relativeLocation.properties.state.toLowerCase()} to Zone Database`)
        } else {
            throw new Error ("Location is already in Zone database", {
                cause: {
                    reason: "Lat and Lot given already belong to a location stored in the Zone database."
                }
            })
        }
    }
}

export const forecastHelper = async (argv) => {
    const result = await findZone(argv.city, argv.state)
    const zone = result.pop()
    if(zone === undefined) {
        throw new Error("Cannot find location with provided city and state in zone database", {
            cause: {
                reason: "Either city and/or state argument is not present in zone database."
            }
        })
    }
    const forecasts = await fetchForecast(zone);
    return forecasts
}

export const zoneHelper = async () => {
    const zones = await getAllZones();
    const validZones = getAllValidZones(zones);
    return validZones
}