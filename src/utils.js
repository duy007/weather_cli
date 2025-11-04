export const formatForecast = (forecastList) => {
    forecastList.forEach(e => {
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