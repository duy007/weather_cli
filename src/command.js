import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

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
            // TODO: Error Processing and Save to DB
        }
    )
    .command(["get <city> <state>", "g <city> <state>"], "Get the forest of the given location if its lat and lot are saved in storage.", 
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
            )
        },
        async (argv) => {
            // TODO: Look into the DB if the location is present. Do a fetch request if it is. Process that JSON result.
            console.log(argv.city.toLowerCase())
            console.log(argv.state.toLowerCase())
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

