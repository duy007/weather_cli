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

export const getAllValidZones = (zones) => {
    return zones.filter(zone => {
        return zone.city !== "Unavailable" && zone.state !== "Unavailable"
    })
}

export const fetchForecast = async (zone) => {
    const response = await fetch(`https://api.weather.gov/gridpoints/${zone.gridId}/${zone.gridX},${zone.gridY}/forecast`)
    const forecastJson = await response.json()
    if (response.status !== 200) {
        throw new Error("NWS API call was unsuccessful", {
            cause: {
                httpStatus:  response.status,
                title: forecastJson.title,
                type: forecastJson.type,
                detail: forecastJson.detail
            }
        })
    } else {
        return forecastJson.properties.periods
    }
}