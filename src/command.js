import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { findZone, newZone } from './server/ORM/zones.js';

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
            )
        }, async (args) => {
            console.log(args.lat + " " + args.lot)
            const response = await fetch(`https://api.weather.gov/points/${args.lat},${args.lot}`, {
                method: "GET",
                headers: {
                    "accept": "application/geo+json"
                }
            })
            const result = await response.json()
            if (response.status !== 200) {
                // TODO: Clean this up with better error handling
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
                console.error('You broke it!')
                console.error(msg)
                console.error('You should be doing', yargs.help())
                process.exit(1)
            })
        },
        async (argv) => {
            // TODO: Look into the DB if the location is present. Do a fetch request if it is. Process that JSON result.
            const result = await findZone(argv.city, argv.state)
            const zone = result.pop()
            const response = await fetch(`https://api.weather.gov/gridpoints/${zone.gridId}/${zone.gridX},${zone.gridY}/forecast`)
            if(response.status !== 200) {
                //TODO: Write a better error handeling when fetch call fails (server down or something else)
                console.log("Fetch unsuccessful!")
            } else {
                const forecastJson = await response.json()
                const forecastPeroid = forecastJson.properties.periods
                // TODO: Move clean this up and move it into its own module
                forecastPeroid.forEach(e => {
                    console.log(e.name)
                    console.log(e.temperature + " " + e.temperatureUnit)
                    console.log("Likelyhood of Rain: " + e.probabilityOfPrecipitation.value + e.probabilityOfPrecipitation.unitCode)
                    console.log("Wind Speed: " + e.windSpeed + " " + e.windDirection)
                    console.log("Start Time: " + `${new Date(e.startTime).toTimeString()}`)
                    console.log("End Time: " + `${new Date(e.endTime).toTimeString()}`)
                    console.log(e.shortForecast)
                    console.log(e.detailedForecast)
                    console.log()
                });
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

