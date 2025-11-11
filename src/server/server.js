import http from 'node:http'
import fs from 'node:fs/promises'
import url from 'node:url';

export const createServer = (port) => {
    return http.createServer(async (req, res) => {
        const basedURL = new URL(req.url, 'http://' + req.headers.host + '/')
        if(basedURL.pathname === '/') {
            res.writeHead(200, {'content-type': 'text/html'})
            res.end("Homepage")
        }
        if(basedURL.pathname === '/get' && req.method === 'GET') {
            console.log(basedURL.searchParams)
            res.writeHead(200, {'content-type': 'text/html'})
            res.end("get a zone")
        }
        if(basedURL.pathname === '/zones' && req.method === 'GET') {
            res.writeHead(200, {'content-type': 'text/html'})
            res.end("get all zone")

        }
        if(basedURL.pathname === '/allforecast' && req.method === 'GET') {
            res.writeHead(200, {'content-type': 'text/html'})
            res.end("all forecast")
        }
        if(basedURL.pathname === '/search' && req.method === 'POST') {
            res.writeHead(200, {'content-type': 'text/html'})
            res.end("search a zone")
        }
        if(basedURL.pathname === '/clean' && req.method === 'POST') {
            res.writeHead(200, {'content-type': 'text/html'})
            res.end("clean database")
        }
    })
}

export const startServer = (port) => {
    const server = createServer()
    server.listen(port, () => {
        const address = `http://localhost:${port}`
        console.log(`Server is listening on ${address}`);
    });
}
// POST: SEARCH <LAT> <LOT>

// GET: GET <CITY> <STATE>

// GET: ZONES

// GET: ALLFORECAST

// POST: CLEAN