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

//* ========== app start controller ==========
const controlAppStart = async function() {
    try {
        savedView.render(storage.getStoredLocations()); // retrieve and render bookmarked locations from local storage

        await geoLoc.getGeolocation(); // get current (browser location allowed) or random location(browser location blocked)

        // if location allowed
        if(geoLoc.coords.locPermission) {
            await model.getForecast(geoLoc.coords); // retrieve current location forecast
            weatherView.render(model.store) // render current weather
            maps.weatherMap(geoLoc.coords); // render map to current location
            infoView.toggleInfoView(); // display app instructions modal
        }

        // if location blocked
        if(!geoLoc.coords.locPermission) {
            //! marker comment here---------------------------------------
            const marker = false;
            searchView.toggleSearchViewBlockedGeoLoc(); // auto navigate to search view
            maps.searchMap(geoLoc.coords, 4, marker); // render map to a random location
            infoView.toggleInfoView(); // display app instructions modal
            return;
        } 
    } catch(err) {
        console.error('app start error!!!', err);
        weatherView.renderError(err);
    }
}

//* ========== Current weather page controller ==========
const controlCurrentLocation = async function(loc) {
    
    const { bookmarked, id } = loc.at(-1).data;

    try {
        console.log()
        if(!bookmarked) {
            await model.updateBookmark();
            storage.addStoredLocation(loc);

            savedView.render(storage.getStoredLocations())
        }

        if(bookmarked) { 
            storage.removeStoredLocation(id); //*
            await model.updateBookmark(); //*
            savedView.removeEl(id);
            savedView.render(storage.getStoredLocations());
        }
        
    } catch(err) {
        console.error('current location error!!!', err);
        weatherView.renderError(err);
    }
}

//* ========== Call a saved location controller ==========
const controlCallSaved = async function(id) {
    try {
        storage.incrementViewCount(id);

        //this should probably be abstracted
        let loc = storage.getStoredLocations();
        loc.forEach(async (place) => {
            if(place.data.id === Number(id)) {
                const coords = { 
                    latitude: place.data.lat,
                    longitude: place.data.lon,
                    bookmarked: true, 
                    id: place.data.id
                };
                
                await model.getForecast(coords);
                weatherView.render(model.store)
                // const weatherMap = new Map();
                maps.weatherMap(coords); //*
            }
        })
        // console.log(storage.getStoredLocations());

    } catch(err) {
        console.error('saved location error!!!', err);
        
    }
    
}

//* ========== Remove a saved location controller ==========
const controlRemoveSaved = async function(id) {
    try {
        storage.removeStoredLocation(Number(id));
        await savedView.render(storage.getStoredLocations());
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
        const coords = { 
            latitude: model.store.at(-1).data.lat, 
            longitude: model.store.at(-1).data.lon
        }
        console.log(model.store);
        weatherView.render(model.store);
        await maps.weatherMap(coords) //*
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
        // coords.push(true);
        console.log(coords);

        await model.getForecast(coords);

        weatherView.render(model.store);
        await maps.weatherMap(coords);
    } catch(err) {
        console.log('an error has occured');
        weatherView.renderError(err);
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
    const sortedData = savedView.sortSavedView(storage.getStoredLocations(), sort);

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