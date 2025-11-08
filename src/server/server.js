import http from 'node:http'
import fs from 'node:fs/promises'

export const createServer = () => {
    return http.createServer(async (req, res) => {

    })
}

export const start = ( port) => {
    const server = createServer()
    server.listen(port, () => {
        const address = `http://localhost:${port}`
        console.log(`Server is listening on ${address}`);
        open(address)
    });
}
// POST: SEARCH <LAT> <LOT>

// GET: GET <CITY> <STATE>

// GET: ZONES

// GET: ALLFORECAST

// POST: CLEAN