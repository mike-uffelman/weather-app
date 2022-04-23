'use strict';

// not needed - just a console notification that we're in the development branch - based on the npm script (i.e. start or build(production) it will change the )
if (process.env.NODE_ENV === 'development') {
    console.log('Happy developing!');

}

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import * as maps from '../views/mapView.js';
import * as geoLoc from './geoLocation.js';
import * as storage from './localStorage.js';
import weatherView from '../views/weatherView.js';
import savedView from '../views/savedView.js';
import searchView from '../views/searchView.js';
import * as layout from './layout.js';
import infoView from '../views/infoView.js';
import message from '../views/errorView.js';
import * as search  from './js/search.js';
import Nav from '../views/navigationView.js';

//* ========== app start controller ==========
const controlAppStart = async function() {
    try {
        infoView.render(); // display app instructions modal
        
        savedView.render(await storage.getStoredLocations()); // retrieve and render bookmarked locations from local storage

        await geoLoc.getGeolocation(); // get current (browser location allowed) or random location(browser location blocked)
        // Nav._render();
        // if location allowed
        if(geoLoc.coords.locPermission) {
            await model.getForecast(geoLoc.coords); // retrieve current location forecast
            weatherView.render(model.store) // render current weather
            maps.weatherMap(geoLoc.coords); // render map to current location
            searchView.render()
        }

        // if location blocked
        if(!geoLoc.coords.locPermission) {
            //! marker comment here---------------------------------------
            const marker = false;
            searchView.render();
            searchView.moveToSearch(); // auto navigate to search view
            // maps.searchMap(geoLoc.coords, 4, marker); // render map to a random location
            // return;
        } 
    } catch(err) {
        console.error('app start error!!!', err);
        message.renderMessage(err, 'error');
    }
}

//* ========== Current weather page controller ==========
const controlCurrentLocation = async function(loc) {
    
    const { bookmarked, id } = loc.at(-1).data;

    try {
        if(!bookmarked) {
            await model.updateBookmark();
            storage.addStoredLocation(loc);
            savedView.render(storage.getStoredLocations())
            message.renderMessage('Location successfully saved!', 'success');

        }

        if(bookmarked) { 
            storage.removeStoredLocation(id); //*
            await model.updateBookmark(); //*
            savedView.removeEl(id);
            savedView.render(storage.getStoredLocations());
            message.renderMessage('Bookmark removed!', 'info');
        }
        
    } catch(err) {
        console.error('Unable to update saved location!', err);
        message.renderMessage(err, 'error');
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
                maps.weatherMap(coords);
                // message.renderMessage('Location successfully loaded!', 'success');

            }
        })
        // console.log(storage.getStoredLocations());

    } catch(err) {
        console.error('saved location error!!!', err);
        message.renderMessage('Unable to load saved location!', 'error')
    }
    
}

//* ========== Remove a saved location controller ==========
const controlRemoveSaved = async function(id) {
    try {
        storage.removeStoredLocation(Number(id));
        await savedView.render(storage.getStoredLocations());
        weatherView.toggleBookmarkIcon(Number(id));
        message.renderMessage('Location successfully removed', 'info');

    } catch(err) {
        console.error('unable to remove this location', err);
        message.renderMessage('An error has occured: Unable to remove saved location!')
    }
}

//* ========== Location search controller ==========
const controlSearch = async function(loc) {
    // try {
    //     const [city, ...region] = loc
    
    //     console.log(city, region);
    //     await model.getCity(city, region);

    //     // cities.forEach(city => console.log(city.name, city.state, city.country))


    //     const coords = { 
    //         latitude: model.store.at(-1).data.lat, 
    //         longitude: model.store.at(-1).data.lon
    //     }
    //     console.log(model.store);
    //     // weatherView.dismissMessage();
    //     weatherView.render(model.store);
    //     await maps.weatherMap(coords)
    //     message.renderMessage('Location successfully loaded!', 'success');

    // } catch(err) {
    //     console.log('unable to find searched location', err);
    //     message.renderMessage(err, 'error');
    // }

}
    //? favorites get forecast

//* ========== Remove search map overlay ==========
const enableSearchMap = function() {
    // console.log('enabling search map!')
    maps.searchMap(geoLoc.coords, 9);
}

const controlMapClickSearch = async function() {
    // try {
    //     const coords = maps.eCoords;
    //     // coords.push(true);
    //     console.log(coords);

    //     await model.getForecast(coords);

    //     weatherView.render(model.store);
    //     await maps.weatherMap(coords);
    //     message.renderMessage('Location successfully loaded!', 'success');

    // } catch(err) {
    //     console.log('an error has occured');
    //     message.renderMessage(err);
    // }
}

const searchLink = () => searchView.moveToSearch();
const savedLink = () => savedView.moveToSaved();
const infoLink = () => infoView.toggleInfoView();
    
const sortSaved = async function(sort) {
    const getSaved = await storage.getStoredLocations();
    // console.log('stored locations: ', getSaved);
    const sortedData = await savedView.sortSavedView(getSaved, sort);
    // console.log(sortedData);
    savedView.render(sortedData, sort)
}

const errorHandled = (message, type) => message.renderMessage(message, type)

const controlLocationSearch = async function (e) {
    const loc = searchView.getInputs();
    const [city, ...region] = loc;
    if(maps.eCoords.latitude === null && maps.eCoords.longitude === null && !loc) return;

    // const mapLoc = maps.eCoords;
    // console.log(inputs);
    // console.log(mapLoc);
    if(loc) await model.getCity(city, ...region);
    console.log(maps.eCoords);
    if(maps.eCoords) await model.getForecast(maps.eCoords);
    const coords = { 
        latitude: model.store.at(-1).data.lat, 
        longitude: model.store.at(-1).data.lon
    }
    weatherView.render(model.store);
    await maps.weatherMap(coords);
    
    searchView.toggleSearchViewBlockedGeoLoc();
    searchView._clearForm();

    
    console.log('FORM SEARCH...: ', e)
}

const init = async function() {
    
    await controlAppStart();
    searchView.addHandlerSearch(controlSearch);
    savedView.addHandlerSaved(controlCallSaved, controlRemoveSaved, sortSaved);
    weatherView.addHandlerCurrent(controlCurrentLocation);
    maps.addHandlerMapClick(enableSearchMap, controlMapClickSearch);
    layout.addHandlerToggleNav(searchLink, savedLink, infoLink);
    search.addHandlerSearchForm(controlLocationSearch);


    if (module.hot) module.hot.accept();

    // window.onerror = (e) => console.log(e)
    // window.onerror = function(error) {
    //     console.log(error);
    //  };

    window.addEventListener('error', function(e) {
        console.log(e)
        console.log(e.error.stack);
        const message = e.error;
        console.log(message);

        e.preventDefault();
        
        errorHandled(message, 'error');
    })
}

// init();



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