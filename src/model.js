import {FORECAST_URL, GEOCODE_REVERSE_URL, GEOCODE_DIRECT_URL} from './config.js';
let { OWM_APIKEY } = process.env;



class Location {
    constructor(data) {
        this.data = data
        this.data.id = Date.now(); //create an easy unique id for favorited locations
    }


}

export let store = [];
export let searchResults = [];


//Get the city data, including lat/lon
export const getCity = async function (city, state, country) {
    try {
        if(!city) return;

        const res = await fetch(`${GEOCODE_DIRECT_URL}?q=${city}${!state? '' : ','+country}${!country? '' : ','+country}&limit=5&appid=${OWM_APIKEY}`)

        const data = await res.json();
        console.log(data);
        const locHeader = data[0];
        const coords = {
            latitude: locHeader.lat,
            longitude: locHeader.lon, 
        }

        await getForecast(coords);

    } catch(err) {
        console.error('cannot get city', err.message);
        throw new Error('Cannot get city, please try again.');
    }
}

//* model logic ===================================================================
//Get the forecast for the lat/lon provided
export const getForecast = async function(coords) {
    try {
        const { latitude: lat, longitude: lon, bookmarked = false, id } = coords;
        // if(!check) return; // if a random location i.e. false, return //? NOT SURE IF REALLY NEEDED...
        if(!lat || !lon) return; // if lat or lon is undefined, return 

        const res = await fetch(`${FORECAST_URL}onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely&appid=${OWM_APIKEY}`)

        const forecastData = await res.json();
        console.log('forecast data: ', forecastData);
        const loc = await fetch(`${GEOCODE_REVERSE_URL}?lat=${forecastData.lat}&lon=${forecastData.lon}&limit=10&appid=${OWM_APIKEY}`)
        

        const locData = await loc.json()
        console.log(locData);
        const locHeader = locData[0];
        console.log('location header: ', locHeader);
        let locationObj = {
            ...locHeader,
            ...forecastData,
            bookmarked
        }

        const location = new Location(locationObj);

        if(id) location.data.id = id;
        console.log('location data object: ', location);
        //add forecast to current data store
        store.push(location);
        // throw err;

    } catch(err) {
        console.error('error!', err.message, err.stack);
        throw err;
    }
}

export const updateBookmark = async function() {
    try {
        store.at(-1).data.bookmarked = !store.at(-1).data.bookmarked;

    } catch(err) {
        console.log('unable to toggle bookmark property', err);
        throw err;
    }

}