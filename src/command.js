import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { findZone, newZone } from './server/ORM/zones.js';
import { formatForecast } from './utils.js';
import { errorHelper } from './errorHelper.js';

yargs(hideBin(process.argv))
    .command(["search <lat> <lot>", "s <lat> <lot>"], "Search for city and state. If found, save it",
        (yargs) => {
            yargs.positional(
                'lat', {
                    describe: 'The Latitude of the location. Range from -90 to 90.', 
                    type: 'number',
                    default: 47.608013
                }
            ).positional(
                'lot', {
                    describe: 'The Longtitude of the location. Range from -180 to 180.',
                    type: 'number',
                    default: -122.335167
                }
            ).fail((msg, err, yargs) => {
                errorHelper(msg, err, yargs)
            })
        }, async (args) => {
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
                // TODO: Check if the location is already saved in storage. Do not store a new zone if it already is saved.
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
            }
        }
    )
    .command(["get <city> <state>", "g <city> <state>"], "Get the forecast of the given location if its lat and lot are saved in storage.", 
        (yargs) => {
            yargs.positional(
                'city', {
                    describe: "the name of the city to get the forecast",
                    type: "string"
                },
            ).positional(
                'state', {
                    describe: "the name of the state to get the forecast",
                    type: "string"
                }
            ).coerce(['city', 'state'], (arg) => {
                if(arg.toLowerCase() === 'unavailable') {
                    throw new Error("Unavailable is not a valid value for city or state")
                }
                return arg.toLowerCase();
            }).fail((msg, err, yargs) => {
                errorHelper(msg, err, yargs)
            })
        },
        async (argv) => {
            // TODO: Look into the DB if the location is present. Do a fetch request if it is. Process that JSON result.
            const result = await findZone(argv.city, argv.state)
            const zone = result.pop()
            if(zone === undefined) {
                throw new Error("Cannot find location with provided city and state in zone database", {
                    cause: {
                        reason: "Either city and/or state argument is not present in zone database."
                    }
                })
            }
            const response = await fetch(`https://api.weather.gov/gridpoints/${zone.gridId}/${zone.gridX},${zone.gridY}/forecast`)
            const forecastJson = await response.json()
            if(response.status !== 200) {
                throw new Error("NWS API call was unsuccessful", {
                    cause: {
                        httpStatus:  response.status,
                        title: forecastJson.title,
                        type: forecastJson.type,
                        detail: forecastJson.detail
                    }
                })
            } else {
                const forecastPeroid = forecastJson.properties.periods
                formatForecast(forecastPeroid)
            }
        }
    )
    .command(["zones", "z"], "get all saved locations", () => {}, 
        async (argv) => {
            console.log("All Zones")
            // TODO: Look up all the name of all saved zone.
        })
    .command(["all", "a"], "Get the forest of all saved locations", () => {},
        async (argv) => {
            console.log("All Forecast")
            // TODO: Get the forecast of all saved zone.
        })
.parse()

