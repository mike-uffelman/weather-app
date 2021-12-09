const APIkey = '63c966c95ff05cfed696cec21d7ff716';

class Location {
    constructor(data) {
        this.data = data
        this.data.id = Date.now(); //create an easy unique id for favorited locations
    }


}

export let store = [];
export let searchResults = [];
// export const state = {
//     location: {},
// };


export const getCity = async function (city, ...stateCountry) {
    try {
        if(!city) return;

        const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${stateCountry},${stateCountry}&appid=${APIkey}`)
        const data = await res.json();
        console.log(data);
        const locHeader = data[0];
        console.log('Location Header:', locHeader);
        console.log(this);
        const coords = [locHeader.lat, locHeader.lon, true]
        console.log(coords);
        await getForecast(coords);

        //display weather in DOM          
        //? UI.displayCurrent(locHeader, forecastData, sunrise, sunset);        

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

        const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely&appid=${APIkey}`)
                    
        const forecastData = await res.json();
        console.log('Forecast Data:', forecastData);

        const loc = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${forecastData.lat}&lon=${forecastData.lon}&limit=10&appid=${APIkey}`)
        
        const locData = await loc.json()
        console.log(locData);
        const locHeader = locData[0];

        console.log('locHeader: ', locHeader);

        let locationObj = {
            ...locHeader,
            ...forecastData
        }
        const location = new Location(locationObj);
        console.log('LOCATION:    ', location);
        store.push(location);
        //display weather in DOM     
        // console.log(this.store);

    } catch(err) {
        console.error('error!', err.message, err.stack);
    }
}
