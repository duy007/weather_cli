## Introduction

A simple weather app intended to be used in the CLI. 
Initial mapping of using NodeJS and Yargs as the body of the programming.


## Basic Functionaility

wcli search <lat> <lot>
alias s
Given Lat and Lot, search for city and state, and save it to storage
If can't find it, list reason why, save it to storage, give error if user try to do again

wcli get <name>
if lat and lot of a city is save, give as much of the forecast as possible right now.
response in with error statement if city is not in.

wcli zones
return save zone

wcli all
return all current forcast of all zone

## API

This program will use the National Weather Service (NWS) API to get its forecast.