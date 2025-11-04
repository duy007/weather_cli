export const errorHelper = (msg, err, yargs) => {
    console.error(`${msg ? msg : err.message}`)
    if(Object.hasOwn(err.cause, "httpStatus")){
        console.error("Http Status Code: " + err.cause.httpStatus)
        console.error("Title: " + err.cause.title)
        console.error("Detail: " + err.cause.detail)
        console.error(err.cause.type)
    }
    if(Object.hasOwn(err.cause, "reason")) {
        console.error(`Reason: ${err.cause.reason}`)
    }
    console.error('You should be doing', yargs.help())
    process.exit(1)
}