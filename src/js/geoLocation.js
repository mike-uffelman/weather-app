'use strict';


export const coords = {
    latitude: 0,
    longitude: 0
}; 

//navigator.permissions is current experimental - would have used this instead to handle the state of navigator.geolocation

// get current user location (allow location) or return random lat/lon (block location)
export const getGeolocation = async function() {
    try{
        if(await navigator.geolocation) { //if allowed
            try {
                const res = await _getPosition();
                const { latitude, longitude } = res.coords;
                coords.latitude = latitude,
                coords.longitude = longitude; // push lat/lon to coords array and true boolean indicating a user location
                coords.locPermission = 'allowed';
               
            } catch(err) { // if blocked
                const coords = await _randomCoords();
                if(coords) {
                    return coords;
                } else {
                    throw err;
                }
            }
                            
        }
        if (await !navigator.geolocation) { // if blocked
            console.log('geolocation failure...')
            await _randomCoords(); // get a random latitude/longitude for searchMap render
        }
    } catch(err) {
        throw err;
    }
};

// return new promise with geolocation object
function _getPosition() {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);    
    })
}
 
// get random lat, lon and push to coord array, indicate false for random
function _randomCoords() {
    try {
        coords.latitude = Math.random() * (90 - (-90)) + (-90); 
        coords.longitude = Math.random() * (180 - (-180)) + (-180);
        coords.locPermission = 'blocked';
        return coords;
    } catch(err) {
        throw new Error('Unable to get random location');
    }
}


//? may be able to use the resolve reject to access allow/block