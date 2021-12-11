
class Location {
    constructor(data) {
        this.data = data
        this.data.id = Date.now(); //create an easy unique id for favorited locations
    }


}

export let store = [];
export let searchResults = [];

const APIkey = '63c966c95ff05cfed696cec21d7ff716';
const FORECAST_URL = `https://api.openweathermap.org/data/2.5/`
const GEOCODE_REVERSE_URL = `http://api.openweathermap.org/geo/1.0/reverse`;
const GEOCODE_DIRECT_URL = `http://api.openweathermap.org/geo/1.0/direct`;
// export const state = {
//     location: {},
// };


export const getCity = async function (city, state, country) {
    try {
        if(!city) return;

        const res = await fetch(`${GEOCODE_DIRECT_URL}?q=${city}${!state? '' : ','+country}${!country? '' : ','+country}&limit=5&appid=${APIkey}`)

        const data = await res.json();
        console.log(data);
        const locHeader = data[0];
        const coords = [locHeader.lat, locHeader.lon, true]

        await getForecast(coords);

    } catch(err) {
        console.error('error!', err.message);
    }
}

//* model logic ===================================================================
export const getForecast = async function(coords) {
    try {
        const [ lat, lon, check ] = coords;
        if(!check) return; // if a random location i.e. false, return
        if(!lat || !lon) return; // if lat or lon is undefined, return

        const res = await fetch(`${FORECAST_URL}onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely&appid=${APIkey}`)

        const forecastData = await res.json();
        const loc = await fetch(`${GEOCODE_REVERSE_URL}?lat=${forecastData.lat}&lon=${forecastData.lon}&limit=10&appid=${APIkey}`)
        
        const locData = await loc.json()
        const locHeader = locData[0];

        let locationObj = {
            ...locHeader,
            ...forecastData
        }
        const location = new Location(locationObj);
        store.push(location);

    } catch(err) {
        console.error('error!', err.message, err.stack);
    }
}
