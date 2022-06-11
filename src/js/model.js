'use strict';

// import config and keys
import {FORECAST_URL, GEOCODE_REVERSE_URL, GEOCODE_DIRECT_URL} from './config.js';
import { v4 as uuidv4 } from 'uuid';
let { OWM_APIKEY } = process.env;

export let state = {}

export let store = []; // array to store current session locations
// export let searchResults = []; //TODO add search results


//Get the city data, including lat/lon
// geocode
export const getCity = async function (loc) {
    try {

        const inputs = Object.values(loc);
        const [city, ...region] = inputs;

        // if city is not defined, return
        if(!city) return;

        // fetch the geocode information from the params provided
        // region is optional so we map over and join together any region values that were passed in
        const res = await fetch(`${GEOCODE_DIRECT_URL}?q=${city}${region.map(place => ','+place).join('')}&limit=5&appid=${OWM_APIKEY}`)

        // extract json response and assign to data variable
        const data = await res.json();

        // if the geocode returned zero locations throw an error
        if(data.length === 0) throw new Error('Unable to find this location, please make sure it is entered correctly.')

        // retrieve and assign coordinates object to be passed into getForecast
        const geocodedDataObj = data[0];
        let coords = {
            latitude: geocodedDataObj.lat,
            longitude: geocodedDataObj.lon,
            locPermission: 'allowed' 
        }

        // get the location forecast based on the coordinates defined from the geocoding
        await getForecast(coords);

    } catch(err) {
        console.error(err.message);
        throw err;
    }
}




//* model logic ===================================================================
//Get the forecast for the lat/lon provided
export const getForecast = async function(locCoords) {
    try {
        if(locCoords.locPermission === 'blocked') return;
        state.location = {};

        const { latitude: lat, longitude: lon, saved = false, id } = locCoords;
        // if(!check) return; // if a random location i.e. false, return //? NOT SURE IF REALLY NEEDED...
        if(!lat || !lon) return; // if lat or lon is undefined, return 

        // fetch forecast data for coordinates
        const res = await fetch(`${FORECAST_URL}onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely&appid=${OWM_APIKEY}`)

        // extract json from forecast fetch response
        const forecastData = await res.json();

        // fetch reverse geocode data for name, state, country
        const loc = await fetch(`${GEOCODE_REVERSE_URL}?lat=${forecastData.lat}&lon=${forecastData.lon}&limit=10&appid=${OWM_APIKEY}`)
        
        // extract json from reverse geocode response
        const locData = await loc.json()

        state.location = {
            ...locData[0], 
            ...forecastData,
            saved,
            id: uuidv4(),
            locPermission: 'allowed'
        }

        // if getForecast was called from the savedView, the id already exists so use that id
        if(id) state.location.id = id;

    } catch(err) {
        console.error('error!', err.message, err.stack);
        throw err;
    }
}

// function updates the 'saved' property for locations
export const updateSaved = async function() {
    try {
        state.location.saved = !state.location.saved;
    } catch(err) {
        console.error('unable to toggle saved property', err);
        throw err;
    }

}

export const getSearchInputs = function(data) {
    state.query = data;
}

export const updateBookmarks = function(data) {
    state.bookmarks = data;
}

export const clearGeoLocation = function() {
    state.geoLocation = {};
}