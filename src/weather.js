'use strict';

// not needed - just a console notification that we're in the development branch - based on the npm script (i.e. start or build(production) it will change the )
if (process.env.NODE_ENV === 'development') {
    console.log('Happy developing!');

}

import 'core-js/stable';
import 'regenerator-runtime/runtime';



import * as model from './model.js';
import * as maps from './views/mapView.js';
import * as geoLoc from './geoLocation.js';
import * as storage from './localStorage.js';
import weatherView from './views/weatherView.js';
import savedView from './views/savedView.js';
import searchView from './views/searchView.js';
import * as layout from './layout.js';
import infoView from './views/infoView.js';



const saved = document.querySelector('#saved');
const map = document.querySelector('#mapid');
const locID = document.querySelector('.saved__card--locationID');




// let windowLoad = true;
const form = document.querySelector('form');


//* ========== app start controller ==========
const controlAppStart = async function() {
    try {
        // retrieve and render bookmarked locations from local storage
        const savedLocs = storage.getLocation();
        savedView.render(savedLocs)

        // get current (browser location allowed) or random location(browser location blocked)
        await geoLoc.getGeolocation();

        // if location allowed
        if(geoLoc.coords[2] === true) {
            
            // retrieve current location forecast
            await model.getForecast(geoLoc.coords);

            // render current weather
            weatherView.render(model.store)

            // render map to current location
            maps.buildMap(geoLoc.coords);

            // display app instructions modal
            infoView.toggleInfoView();
        }

        // if location blocked
        if(geoLoc.coords[2] === false) {
            //! marker comment here---------------------------------------
            const marker = false;
            
            // auto navigate to search view
            searchView.toggleSearchViewBlockedGeoLoc();

            // render map to a random location
            maps.searchMap(geoLoc.coords, 4, marker);

            // display app instructions modal
            infoView.toggleInfoView();

            return;
        } 
    } catch(err) {
        console.error('app start error!!!', err);
        weatherView.renderError(err);
    }
}

//* ========== Current weather page controller ==========
const controlCurrentLocation = async function(loc) {
    // console.log(loc)
    // console.log('storage pre ')
    
    const { bookmarked, id } = loc.at(-1).data;
    // console.log(id)
    const bookmarkedEl = document.querySelector('.header--add-fav');
    // let windowLoad = true;
    try {
        console.log()
        if(!bookmarked) {
            // console.log('no to yes: ', loc.at(-1).data)
            await model.updateBookmark();
            // console.log('no to yes: ', loc.at(-1).data)
            // console.log(loc);
            storage.addLocation(loc);
            const location = storage.getLocation();
            savedView.render(location)
            // console.log('storage on add: ', storage.getLocation())
            // console.log(model.store);
        }

        if(bookmarked) { 
            storage.removeLocation(id); //*

            await model.updateBookmark(); //*
            savedView.removeEl(id);
            const data = storage.getLocation();
            savedView.render(data);


        }
        
    } catch(err) {
        console.error('current location error!!!', err);
        weatherView.renderError(err);
    }
}

//* ========== Call a saved location controller ==========
const controlCallSaved = async function(id) {
    try {
        storage.incrementClicks(id);

        //this should probably be abstracted
        let loc = storage.getLocation();
        loc.forEach(async (place) => {
            if(place.data.id === Number(id)) {
                const coords = [place.data.lat, place.data.lon, true, true, place.data.id];
                
                await model.getForecast(coords);
                weatherView.render(model.store)
                // const weatherMap = new Map();
                maps.buildMap(coords); //*
            }
        })
        // console.log(storage.getLocation());

    } catch(err) {
        console.error('saved location error!!!', err);
        
    }
    
}

//* ========== Remove a saved location controller ==========
const controlRemoveSaved = async function(id) {
    try {

        storage.removeLocation(Number(id));
        const loc = storage.getLocation();
    
        await savedView.render(loc);
        weatherView.toggleBookmarkIcon(Number(id));

    } catch(err) {
        console.error('unable to remove this location', err);
    }
}

//* ========== Location search controller ==========
const controlSearch = async function(loc) {
    try {
        const [city, state, country] = loc
    
        await model.getCity(city, state, country);
        // searchView.render(getCityTest)
        // await model.getForecast(coords);
        // console.log(model.store);
        const coords = [model.store.at(-1).data.lat, model.store.at(-1).data.lon]
        // console.log(model.store.at(-1).data.lat, model.store.at(-1).data.lon);
        // console.log(getCityTest);
        // console.log('after getCity call: ', model.store);
        weatherView.render(model.store);
        await maps.buildMap(coords) //*
    } catch(err) {
        console.log('unable to find searched location', err);
        weatherView.renderError(err);
    }

}
    //? favorites get forecast

//* ========== Remove search map overlay ==========
const enableSearchMap = function() {
    // console.log('enabling search map!')
    maps.searchMap(geoLoc.coords, 9);
}

const controlMapClickSearch = async function() {
    try {
        const coords = maps.eCoords;
        console.log(coords);
        coords.push(true);
        // console.log(coords);
        // const [lat, lon] = maps.eCoords
        // console.log(lat, lon);
        // const { lat, lng }  = maps._eCoords[0];
        // Number(lat.toFixed(4)), Number(lng.toFixed(4)))
        // console.log(lat, lng);
        // const coords = [Number(lat.toFixed(4)), Number(lng.toFixed(4)), true];
        // console.log(coords);
        await model.getForecast(coords);
        weatherView.render(model.store);
        await maps.buildMap(coords);
    } catch(err) {
        console.log('an error has occured');
        throw error;
    }
}

const searchLink = function () {
    searchView.moveToSearch();
}

const savedLink = function () {
    savedView.moveToSaved();
}

const infoLink = function() {
    infoView.toggleInfoView();
}
    
const sortSaved = function(sort) {

    const data = storage.getLocation();

    const sortedData = savedView.sortSavedView(data, sort);
    savedView.render(sortedData, sort)
}



const init = function() {
    controlAppStart();
    searchView.addHandlerSearch(controlSearch);
    savedView.addHandlerSaved(controlCallSaved, controlRemoveSaved, sortSaved);
    weatherView.addHandlerCurrent(controlCurrentLocation);
    maps.addHandlerMapClick(enableSearchMap, controlMapClickSearch);
    layout.addHandlerToggleNav(searchLink, savedLink, infoLink);

    if (module.hot) {
        module.hot.accept();
    }


}

init();



// manually delete local storage index
        // function storageDeleteItem(locIndexStart) {
        //     const loc = JSON.parse(localStorage.getItem('loc'));
        //     console.log('LOCAL STORAGE; ', loc);
        //     loc.splice(locIndexStart, 3);
        //     localStorage.setItem('loc',JSON.stringify(loc))
        // }
        
        // storageDeleteItem(0);


        // clear timeout example from mdn------------------------------------------
// const alarm = {
//     remind(aMessage) {
//       alert(aMessage);
//       this.timeoutID = undefined;
//     },
    
//     setup() {
//       if (typeof this.timeoutID === 'number') {
//         this.cancel();
//       }
    
//       this.timeoutID = setTimeout(function(msg) {
//         this.remind(msg);
//       }.bind(this), 1000, 'Wake up!');
//     },
    
//     cancel() {
//       clearTimeout(this.timeoutID);
//     }
//   };
//   window.addEventListener('click', () => alarm.setup() );