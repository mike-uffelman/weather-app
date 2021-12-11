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

        const savedLocs = await storage.getLocation();
        // console.log('SAVED LOCATIONS: ', savedLocs);
        // saved.displayFavorites(savedLocs, windowLoad, model.store);
        savedView.render(savedLocs, true, model.store)
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
        console.log('DATA STORE: ', model.store)

        weatherView.render(model.store)


        // console.log('model.store: ', model.store);
        // const store = model.store;
        // console.log('new store: ', store);

        //*render saved favorites from local storate
        
        windowLoad = false;
        // console.log(model.store[0].data);
    } catch(err) {
        console.log('app start error!!!', err);
    }
    //! end of this controller ========================================
}

const controlCurrentLocation = async function(loc) {
    try {
        storage.addLocation(loc);
        await savedView.render(loc, false, model.store)
    } catch(err) {
        console.log('current location error!!!', err);
    }
}

const controlCallSaved = async function(id) {
    try {
        let loc = await storage.getLocation();
        loc.forEach(async (place) => {
            if(place.data.id === Number(id)) {
                const coords = [place.data.lat, place.data.lon, true];
                mapView.buildMap(coords);
                await model.getForecast(coords);
                await weatherView.render(model.store)
            }
        })

    } catch(err) {
        console.log('saved location error!!!', err);
    }
    
}

const controlRemoveSaved = async function(id) {
    try {
        storage.removeLocation(Number(id));
    } catch(err) {
        console.log('unable to remove this location', err);
    }
}

const controlSearch = async function(loc) {
    console.log(loc);
    const [city, state, country] = loc

    
    const getCityTest = await model.getCity(city, state, country);

    // searchView.render(getCityTest)
    // await model.getForecast(coords);
    const coords = [model.store.at(-1).data.lat, model.store.at(-1).data.lon]
    // console.log(model.store.at(-1).data.lat, model.store.at(-1).data.lon));
    mapView.buildMap(coords)
    // console.log(getCityTest);
    // console.log('after getCity call: ', model.store);
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