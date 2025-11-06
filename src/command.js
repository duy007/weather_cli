import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { findZone, getAllZones, newZone, removeAllZone } from './server/ORM/zones.js';
import { fetchForecast, formatForecast, getAllValidZones } from './utils.js';
import { errorHelper } from './errorHelper.js';
import { forecastHelper, searchHelper, zoneHelper } from './networkHelper.js';

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
            ).coerce("lot", (arg) => {
                if (isNaN(arg)) {
                    throw new RangeError("Non-number argument")
                }
                if(-180 > arg || arg > 180) {
                    throw new RangeError("Longtitude value out of range")
                }
                return arg
            })
            .coerce("lat", (arg) => {
                if (isNaN(arg)) {
                    throw new RangeError("Non-number argument")
                }
                if(-90 > arg || arg > 90) {
                    throw new RangeError("Latitude value out of range")
                }
                return arg
            })
            .fail((msg, err, yargs) => {
                errorHelper(msg, err, yargs)
            })
        }, async (args) => {
            await searchHelper(args)
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
                    throw new RangeError("Unavailable is not a valid value for city or state")
                }
                return arg.toLowerCase();
            }).fail((msg, err, yargs) => {
                errorHelper(msg, err, yargs)
            })
        },
        async (argv) => {
            const forecasts = await forecastHelper(argv);
            formatForecast(forecasts)
        }
    )
    .command(["zones", "z"], "get all saved locations", (yargs) => {
        yargs.fail((msg, err, yargs) => {
            errorHelper(msg, err, yargs)
        })
    }, 
        async (argv) => {
            const validZones = await zoneHelper()
            if(validZones.length > 0) {
                console.log("All Zones: ")
                validZones.forEach(zone => {
                    console.log(`${zone.city}, ${zone.state}`)
                })
            } else {
                throw new Error("No Zone in database.", {
                    cause: {
                        reason: "User has yet to input Zone into database."
                    }
                })
            }
        })
    .command(["all", "a"], "Get the forecast of all saved locations", (yargs) => {
        yargs.fail((msg, err, yargs) => {
            errorHelper(msg, err, yargs)
        })
    },
        async (argv) => {
            console.log("All Forecast")
            const validZones = await zoneHelper()
            if(validZones.length > 0) {
                validZones.forEach(async zone => {
                    const forecast = await fetchForecast(zone);
                    const shortForecast = forecast.splice(0, 2);
                    console.log(`${zone.city}, ${zone.state}`)
                    formatForecast(shortForecast)
                })
            } else {
                throw new Error("No Zone in database to get forecasts for.", {
                    casuse: {
                        reason: "no Zone data availible to make NWS API call."
                    }
                })
            }
        })
    .command(['clean', 'wipe', 'c'], "Wipe Zone database of all saved location", 
        () => {},
        async (argv) => {
            await removeAllZone();
            console.log("cleaned")
        }
    )
.parse()

