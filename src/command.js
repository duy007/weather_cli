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
            console.log(result)
        }
    )
    .command(["get <name>", "g <name>"], "Get the forest of the given location if its lat and lot are saved in storage.", 
        (yargs) => {
            yargs.positional(
                'name', {
                    describe: "the name of the location get the forecast",
                    type: "string"
                }
            )
        },
        async (argv) => {
            console.log(argv.name.toLowerCase())
        }
    )
    .command(["zones", "z"], "get all saved locations", () => {}, 
        async (argv) => {
            console.log("All Zones")
        })
    .command(["all", "a"], "Get the forest of all saved locations", () => {},
        async (argv) => {
            console.log("All Forecast")
        })
.parse()

