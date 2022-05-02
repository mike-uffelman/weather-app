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
import * as search  from './search.js';
import Nav from '../views/navigationView.js';

//* ========== app start controller ==========
const controlAppStart = async function() {
    try {
        infoView.render(); // display app instructions modal
        
        savedView.render(await storage.getStoredLocations()); // retrieve and render saved locations from local storage

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
    
    const { saved, id } = loc.at(-1).data;

    try {
        if(!saved) {
            await model.updateSaved();
            storage.addStoredLocation(loc);
            savedView.render(storage.getStoredLocations())
            message.renderMessage('Location successfully saved!', 'success');

        }

        if(saved) { 
            storage.removeStoredLocation(id); //*
            await model.updateSaved(); //*
            savedView.removeEl(id);
            savedView.render(storage.getStoredLocations());
            message.renderMessage('Save removed!', 'info');
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
                    saved: true, 
                    id: place.data.id
                };
                
                await model.getForecast(coords);
                weatherView.render(model.store)
                maps.weatherMap(coords);
            }
        })

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
        weatherView.toggleSaveIcon(Number(id));
        message.renderMessage('Location successfully removed', 'info');

    } catch(err) {
        console.error('unable to remove this location', err);
        message.renderMessage('An error has occured: Unable to remove saved location!')
    }
}

//* ========== Remove search map overlay ==========
const enableSearchMap = function() {
    // console.log('enabling search map!')
    maps.searchMap(geoLoc.coords, 9);
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
    try {
        const params = searchView.getInputs();

        console.log('getInputs(): ', params);
        if(params.searchType === 'text') {
            await model.getCity(Object.values(params.locParams));
        }

        console.log('MAPS ECOORDS: ', maps.eCoords);
        if(params.searchType === 'map') {
            if(!maps.eCoords.hasOwnProperty('latitude') || !maps.eCoords.hasOwnProperty('longitude')) throw new Error('Please enter or select a location.', 'info');
            
            await model.getForecast(maps.eCoords);    
        }

        const coords = { 
            latitude: model.store.at(-1).data.lat, 
            longitude: model.store.at(-1).data.lon
        }
        weatherView.render(model.store);
        await maps.weatherMap(coords);
        
        searchView.toggleSearchViewBlockedGeoLoc();
        searchView._clearForm();
        message._autoClear();
        
        console.log('FORM SEARCH...: ', e)
    } catch(err) {
        message.renderMessage(err);
    }
}

const init = async function() {
    
    await controlAppStart();
    searchView.addHandlerSearch();
    savedView.addHandlerSaved(controlCallSaved, controlRemoveSaved, sortSaved);
    weatherView.addHandlerCurrent(controlCurrentLocation);
    maps.addHandlerMapClick(enableSearchMap);
    layout.addHandlerToggleNav(searchLink, savedLink, infoLink);
    search.addHandlerSearchForm(controlLocationSearch);


    if (module.hot) module.hot.accept();

    window.addEventListener('error', function(e) {
        console.log(e)
        console.log(e.error.stack);
        const message = e.error;
        console.log(message);

        e.preventDefault();
        
        errorHandled(message, 'error');
    })
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

