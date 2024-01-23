'use strict';

// import config and keys
import {FORECAST_URL, GEOCODE_REVERSE_URL, GEOCODE_DIRECT_URL, NETLIFY_DEV_SERVER} from './config.js';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export let state = {}

export let store = []; // array to store current session locations
// export let searchResults = []; //TODO add search results

//Get the city data, including lat/lon
// geocode, direct from location name
export const getCity = async function (loc) {
    try {
        const [city, ...region] = Object.values(loc);

        // if city is not defined, return
        if(!city) return;

        // fetch the geocode information from the params provided
        // region is optional so we map over and join together any region values that were passed in
        const directGeocodeRequestOptions = {
            method: 'get',
            url: NETLIFY_DEV_SERVER,
            params: {
                apiURL: GEOCODE_DIRECT_URL,
                q: `${city}${region.map(place => ','+place).join('')}`,
                limit: 5
            }
        }
    
        const response = await axios.request(directGeocodeRequestOptions)
        const data = response.data


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

        if(!lat || !lon) return; // if lat or lon is undefined, return 

        // fetch forecast data for coordinates
        const forecastRequestOptions = {
            method: 'get',
            url: NETLIFY_DEV_SERVER,
            params: {
                apiURL: FORECAST_URL,
                lat,
                lon,
                units: 'imperial',
                exclude: 'minutely'
            }
        }
    
        const forecastData = await axios.request(forecastRequestOptions)

        const reverseGeocodeRequestOptions = {
            method: 'get',
            url: NETLIFY_DEV_SERVER,
            params: {
                apiURL: GEOCODE_REVERSE_URL,
                lat: forecastData.data.lat,
                lon: forecastData.data.lon,
                limit: 10
            }
        }
    
        const reverseGeocodeRes = await axios.request(reverseGeocodeRequestOptions)

        // extract json from reverse geocode response
        const locData = reverseGeocodeRes.data

        state.location = {
            ...locData[0], 
            ...forecastData.data,
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

export const setStateQuery = function(data) {
    state.query = data;
}

export const updateBookmarks = function(data) {
    state.bookmarks = data;
}

export const clearGeoLocation = function() {
    state.geoLocation = {};
}