export const coords = {
    latitude: 0,
    longitude: 0
}; 

//navigator.permissions is current experimental - would have used this instead to handle the state of navigator.geolocation

// get current user location (allow location) or return random lat/lon (block location)
export const getGeolocation = async function() {
    try{
        if(navigator.geolocation) { //if allowed
            try {
                const res = await _getPosition();
                console.log(res);
                const { latitude, longitude } = res.coords;
                coords.latitude = latitude,
                coords.longitude = longitude; // push lat/lon to coords array and true boolean indicating a user location
                coords.locPermission = true;
                console.log(coords);
               
            } catch(err) { // if blocked
                await _randomCoords();
                console.log(err);
                console.log(coords);
                console.log(navigator.permissions);
                console.log(`failed - random: ${err}`, coords);
                throw err;
            }
                            
        }
        if (!navigator.geolocation) {
            console.log('geolocation failure...')
            await _randomCoords();
        }
    } catch(err) {
        console.error(err);
    }
};


function _getPosition() {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);    
    })
}
 
// get random lat, lon and push to coord array, indicate false for random
async function _randomCoords() {
    try {
        coords.latitude = await Math.random() * (50 - (-50)) + (-50); 
        coords.longitude = await Math.random() * (180 - (-180)) + (-180);
        coords.locPermission = false;
        return coords;
    } catch(err) {
        throw new Error('Unable to get random location');
    }
}


//? may be able to use the resolve reject to access allow/block