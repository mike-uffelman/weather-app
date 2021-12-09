import * as mapView from './views/mapView.js';
import * as model from './model.js';



export const coords = new Array(); 

export const getGeolocation = async function() {
    try{
        if(navigator.geolocation) {
            try {
                const res = await _getPosition();
                const { latitude: lat, longitude: lon } = res.coords;
                // console.log(lat, lon);
                coords.push(lat, lon, true);
                // console.log(coords);
                // console.log('Success: ', data);
               
            } catch(err) {
                const res = await _randomCoords();
                // console.log(res);
                // const { lat, lon } = res;
                // const coords = [lat, lon];

                console.log(`failed - random: ${err}`, coords);
            }
                            
        }
        if (!navigator.geolocation) {
            console.log('geolocation failure...')
            // _randomCoords();
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
 
async function _randomCoords() {
    const lat = await Math.random() * (90 - (-90)) + (-90);
    const lon = await Math.random() * (180 - (-180)) + (-180);
    coords.push(lat, lon, false);
}


