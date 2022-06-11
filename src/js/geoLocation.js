'use strict';
import * as model from './model.js'

//navigator.permissions is current experimental - would have used this instead to handle the state of navigator.geolocation

// get current user location (allow location) or return random lat/lon (block location)
export const getGeolocation = async function() {
    try{
        if(await navigator.geolocation) { //if allowed
            try {
                const res = await _getPosition();
                const { latitude, longitude } = res.coords;
                model.state.geoLocation = {
                    latitude: latitude,
                    longitude: longitude,
                    locPermission: 'allowed'
                };

            } catch(err) { // if blocked
                await _randomCoords();
            };
        };
        if (await !navigator.geolocation) { // if blocked
            await _randomCoords(); // get a random latitude/longitude for searchMap render
        }
    } catch(err) {
        throw err;
    };
};

// return new promise with geolocation object
function _getPosition() {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);    
    });
};
 
// get random lat, lon and push to coord array, indicate false for random
function _randomCoords() {
    try {
        model.state.geoLocation = {
            latitude: Math.random() * (90 - (-90)) + (-90),
            longitude: Math.random() * (180 - (-180)) + (-180),
            locPermission: 'blocked'
        };
    } catch(err) {
        throw new Error('Unable to get random location');
    };
};


//? may be able to use the resolve reject to access allow/block