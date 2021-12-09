'use strict';

import * as model from './model.js';
import * as mapView from './views/mapView.js';
import * as geoLoc from './geoLocation.js';
import * as storage from './localStorage.js';
import weatherView from './views/weatherView.js';
import savedView from './views/savedView.js';
import searchView from './views/searchView.js';

//the Location class is a constructor to build the location object for storage


//windowLoad so the random map loaction is called once upon window laod
//firstWeatherCall to only build the current weather div once, any searches after only update the existing div
// let firstWeatherCall = true;
//defining a global array called store, to store the current data, basically temp storage a destroyed every window load
// let _currentLocation;
//api key for the getweather()
// const APIkey = '63c966c95ff05cfed696cec21d7ff716';
/*const callAddress = `https://api.openweathermap.org/data/2.5/weather?q=`;*/

//push key data to array then copy to local storage-------------------------------

class Storage {
    //pushing the current weather location to a temporary array, which will then be pushed to local storage if the user decides is a favorite
    // static storeLocation(place) {
        
    //     const cityObj = new Location(place);
    //     // Storage.addLocation(cityObj);
    //     // const clone = new Object(JSON.parse(JSON.stringify(cityObj)));
    //     // console.log(clone);
    //     store.push(cityObj);
    //     console.log('Store function: ', store);
    //     // _currentLocation = store.at(-1);
    //     // console.log(_currentLocation);
        
        
    // }

    //this is for retrieving locally stored locations to edit storage and for display
    //to use local storage we have three functions - getLocation, addLocation, and removeLocation
    //getLocation() basically retrieves the current data from the localstorage, we define a variable and say if the local storage item we desire is null, then we create an empty array, otherwise(i.e. returns data) we return the parsed data to the variable for access/manipulation

    //TODO change from if else------------------------------------------------------------

    
}

//api request function---------------------------------------------------

class Request {
    //upon user submitting the form, city is passed into this function to retreive the API data from the server
  
    //we're also taking the sunrise/sunset times and converting them to milliseconds and then to the locale time to display in a readable format and passing those along with the data variable to be displayed in the UI and copied to an array for storage
    //should we receive a failed response our catch(err) will notify and console log the error message

    static _getSunriseSunset(dt, timezone) {
        const timeStr = new Date(dt * 1000).toLocaleTimeString('en-US', {timeZone: `${timezone}`});
    }

    // static async getCity(city, ...stateCountry) {
    //     try {
    //         if(!city) return;

    //         const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${stateCountry},${stateCountry}&appid=${APIkey}`)
    //         const data = await res.json();
    //         const locHeader = data[0];
    //         console.log('Location Header:', locHeader);
    //         console.log(this);
    //         this.getForecast(locHeader.lat, locHeader.lon);

    //         //display weather in DOM          
    //         //? UI.displayCurrent(locHeader, forecastData, sunrise, sunset);        

    //     } catch(err) {
    //         console.error('error!', err.message);
    //     }
    // }

    // //* model logic ===================================================================
    // static async getForecast(lat, lon) {
    //     try {
    //         if(!lat || !lon) return;

    //         const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely&appid=${APIkey}`)
    //         const data = await res.json();            
    //         const forecastData = data;
    //         console.log('Forecast Data:', forecastData);

    //         const loc = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${forecastData.lat}&lon=${forecastData.lon}&limit=10&appid=${APIkey}`)
            
    //         const locData = await loc.json()
    //         const locHeader = locData[0];
    //         console.log('locHeader: ', locHeader);

            
    //         mapView.buildMap(lat, lon);
            
    //         const locationObj = {
    //             ...locHeader,
    //             ...forecastData
    //         }
    //         const location = new Location(locationObj);
    //         store.push(location);
    //         console.log('LOCATION:    ', location);

    //         //display weather in DOM     
    //         //! move out of this function - this is presentation logic
    //         UI.displayCurrent(location);    
    //         //!-----------------------------------------------------

    //     } catch(err) {
    //         console.error('error!', err.message, err.stack);
    //     }
    // }
    //possibility to combine this and the above
    //this runs the weather fetch again with the lat/lon of a favorite city

    
    
    // static async refreshWeather(lon, lat) {
    //     try {
    //         const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lon=${lon}&lat=${lat}&units=imperial&lang=en&appid=${APIkey}`)
    //         console.log(res.data);

    //         const data = await res.json();            

    //         //display weather in DOM          
    //         UI.displayCurrent(data);        
    //     } catch(err) {
    //         console.log('error!', err);
    //     }
    // }


    
}

//display in browser------------------------------------------------------------------------


                        // <div class='favorites__card--img'>
                        //     <img id='icon' src='https://picsum.photos/100/100' class='img'>
                        // </div>


// map functions ---------------------------------------------------------------------------



//event listeners----------------------------------------------------------------------
//user enters a city name (specifies with state and/or country, if desired/necessary)
//prevent default browser action (not posting anything)
//pass the city name to getWeather();
// document.querySelector('form').addEventListener('submit', (e) => {
//     e.preventDefault();
//     const city = document.querySelector('form').elements.city.value;
//     Request.getWeather(city);
//     document.querySelector('#current-weather-box').classList.remove('d-none');
//     document.querySelector('#current-weather-box').classList.add('d-flex');
//     //document.querySelector('form').classList.remove('top-50', 'start-50', 'flex-column');
//     //document.querySelector('form').classList.add('bottom-25', 'start-0', 'flex-row');

// })

//event on click of plus sign to add location to LS
//in the current weather section - when the user clicks the plus sign to add a favorite we call the addLocation() and pass in the last index of the temporary storage array called store
// document.querySelector('#current-weather-box').addEventListener('click', (e) => {
//     if(e.target.classList.contains('add-favorite') && e.target.nodeName === 'A') {
        


//remove favorite event - should call to local storage and a UI remove
//in the favorites section - when a user clicks the minus(-) svg we trace the click up to the element and pass the e.target into the removeFavoriteUI() function to remove it from the UI, then we find the cityID visibly hidden in the div and pass that city ID into the removeLocation() function that iterates through the LS object to find the matching index item and removes it


const favorites = document.querySelector('#favorites');
const map = document.querySelector('#mapid');
const locID = document.querySelector('.favorites__card--locationID');

class App {
    #mapEvent;
    #currentLocation;
    #store = [];

    
    constructor() {
        // console.log('Store: ', this.#store);
        // get and map current location on page load or random location
        //* good

        // this.execute();

        // geoLoc.getGeolocation();
        // model.store = this.#store;
        // mapView.buildMap(lat, lon)
        // console.log('store again', this.#store);

        //render saved favorite locations
        // let loc = storage.getLocation();
        // console.log('Local Storage: ', loc)
        
        // if(!windowLoad) this.buildFavoriteDivs(store.at(-1))
        
        // loc.forEach(place => this.buildFavoriteDivs(place))

        // if(!windowLoad) 



        // saved.displayFavorites(); 
        // set windowLoad flag to false
        // windowLoad = false;
    
        //search form event listener
        // form.addEventListener('submit', UI. displayCurrentWeatherBox.bind(this));

        // currentWeather event listener for add to favorites

        // favorite location event listener to remove or select location to get weather again
        // favorites.addEventListener('click', this._favoritesActions.bind(this));
        

        // mapView.buildMap(lat, lon);

        


    }


    //* navigator API - get current location or random location if block location
   
    

    //TODO||||||||||||||||| fix add favorite on click - class change
    

    
   
}


// const app = new App();



// manually delete local storage index
        // function storageDeleteItem(locIndexStart) {
        //     const loc = JSON.parse(localStorage.getItem('loc'));
        //     console.log('LOCAL STORAGE; ', loc);
        //     loc.splice(locIndexStart, 3);
        //     localStorage.setItem('loc',JSON.stringify(loc))
        // }
        
        // storageDeleteItem(0);

// let windowLoad = true;
const form = document.querySelector('form');



const controlAppStart = async function() {
    try {
        let windowLoad = true;

        // let windowLoad = true;
        //* get current or random location
        await geoLoc.getGeolocation();
        // console.log(geoData);
        //* render map on current location or random
        mapView.buildMap(geoLoc.coords, 9);
        // console.log(geoLoc.coords)
        // console.log('BOOLEAN TOO????: ', geoLoc.coords[2])

        //* get forecast for current location if navigator.
        await model.getForecast(geoLoc.coords);
        // console.log('DATA STORE: ', model.store)

        weatherView.render(model.store)


        // console.log('model.store: ', model.store);
        // const store = model.store;
        // console.log('new store: ', store);

        //*render saved favorites from local storate
        const savedLocs = await storage.getLocation();
        // console.log('SAVED LOCATIONS: ', savedLocs);
        // saved.displayFavorites(savedLocs, windowLoad, model.store);
        savedView.render(savedLocs, true, model.store)
        windowLoad = false;
        // console.log(model.store[0].data);
    } catch(err) {
        console.log('app start error!!!', err);
    }
    //! end of this controller ========================================
}

const controlCurrentLocation = async function(loc) {
    try {
        console.log('controlCurrentLocation: ', loc);
        console.log(model.store)

        storage.addLocation(loc)
        
        await savedView.render(loc, false, model.store)
    } catch(err) {
        console.log('current location error!!!', err);
    }
}

const controlCallSaved = async function(id) {
    try {
        //? favorites events -- add remove location
        // favorites.addEventListener('click', (e)=> {
        //     const id =  saved.favoritesActions(e);
        //     storage.removeLocation(id); 
        //     console.log(id);

        let loc = await storage.getLocation();
        loc.forEach(async (place) => {
            if(place.data.id === Number(id)) {
                const coords = [place.data.lat, place.data.lon, true];
                await model.getForecast(coords);
                // console.log('store: ', model.store);
                // console.log(model.store.at(-1));
                // console.log(`Welcome to ${model.store[0].name}`)
                
                weatherView.render(model.store)
            }
        })
    } catch(err) {
        console.log('saved location error!!!', err);
    }
    
}

const controlRemoveSaved = async function(id) {
    
    console.log('removing saved location!!!!!!!!!!!!!', id)
    storage.removeLocation(Number(id));

}

const controlSearch = async function(loc) {
        console.log(loc);
        const [ city, state, country ] = loc;

        // console.log(city, state, country);
        await model.getCity(city, state, country);
    //    searchView.render(getCityTest)
        // await model.getForecast(coords);
        // const coords = [loc.at(-1).data.lat, loc.at(-1).data.lon]
        // mapView.buildMap(coords)
        // console.log(getCityTest);
        console.log('after getCity call: ', model.store);
        weatherView.render(model.store);

}
    //? favorites get forecast
    


    // await model.getForecast(geoLoc.coords);
    // console.log(model.store.at(-1));



const init = function() {
    controlAppStart();
    searchView.addHandlerSearch(controlSearch);
    savedView.addHandlerSaved(controlCallSaved, controlRemoveSaved);
    weatherView.addHandlerCurrent(controlCurrentLocation);
    
    
}

init();