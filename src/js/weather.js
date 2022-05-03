'use strict';

// not needed - just a console notification that we're in the development branch - based on the npm script (i.e. start or build(production) it will change the )
if (process.env.NODE_ENV === 'development') {
    console.log('Happy developing!');

}

// package imports - transpiling and polyfilling
import 'core-js/stable';
import 'regenerator-runtime/runtime'; 

// module imports
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

//* ========== app start controller ==========
const controlAppStart = async function() {
    try {
        infoView.render(); // display app instructions modal
        
        savedView.render(await storage.getStoredLocations()); // retrieve and render saved locations from local storage

        await geoLoc.getGeolocation(); // get current (browser location allowed) or random location(browser location blocked)

        // if location allowed
        if(geoLoc.coords.locPermission) {
            await model.getForecast(geoLoc.coords); // retrieve current location forecast
            weatherView.render(model.store) // render current weather
            maps.weatherMap(geoLoc.coords); // render weatherView map to current location
            searchView.render() // render search element
        }

        // if location blocked
        if(!geoLoc.coords.locPermission) {
            searchView.render(); // render search element
            searchView.moveToSearch(); // auto navigate to search view
        } 
    } catch(err) {
        console.error('app start error!!!', err);
        message.renderMessage(err, 'error');
    }
}

//* ========== Current weather page controller ==========
// save toggle for current location
const controlCurrentLocation = async function(loc) {
    
    const { saved, id } = loc.at(-1).data; // retrieve properties from 

    try {
        // if current location is not saved, update model to saved: true, refresh local storage, re-render saved view, and display a success message
        if(!saved) { 
            await model.updateSaved();
            storage.addStoredLocation(loc);
            savedView.render(storage.getStoredLocations())
            message.renderMessage('Location successfully saved!', 'success');

        }

        // if current location is already saved, update to saved: false, remove saved item from saved view, re-render saved view, display a message
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
        storage.incrementViewCount(id); // increment saved location view count for user sorting

        //this should probably be abstracted
        let loc = storage.getStoredLocations(); // get saved locations

        // look for the saved location in the local storage that matches the id of the selected element in the saved view
        // when found, create a search param object for the model.getforecast
        // when forecast retrieved render the weatherview and the weather map
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
// from the saved view remove a location
const controlRemoveSaved = async function(id) {
    try {
        // removed saved location from local storage if it matches id of selected element
        storage.removeStoredLocation(Number(id)); 
        // retrieve updated local storage and re-render savedView
        await savedView.render(storage.getStoredLocations());
        // if location being removed from saved is also displayed in current  weather, remove saved icon styling
        weatherView.toggleSaveIcon(Number(id));
        // display message 
        message.renderMessage('Location successfully removed', 'info');

    } catch(err) {
        console.error('unable to remove this location', err);
        message.renderMessage('Unable to remove saved location!')
    }
}

//* ========== Remove search map overlay ==========
const enableSearchMap = function() {
    // console.log('enabling search map!')
    maps.searchMap(geoLoc.coords, 9);
}

// toggle navigation items
const searchLink = () => searchView.moveToSearch();
const savedLink = () => savedView.moveToSaved();
const infoLink = () => infoView.toggleInfoView();
    
// sort savedView locations
const sortSaved = async function(sort) {
    // retrieve saved from local storage
    const getSaved = await storage.getStoredLocations();
    // sorts the data array based on sort type
    const sortedData = await savedView.sortSavedView(getSaved, sort);
    // re-render savedview based on the newly sorted data array
    savedView.render(sortedData, sort)
}

// global error/message handler
const errorHandled = (message, type) => message.renderMessage(message, type)

// search controller
const controlLocationSearch = async function (e) {
    try {
        // retrieve search inputs from submit
        const params = searchView.getInputs();

        // if search is a text input location, call getCity
        if(params.searchType === 'text') {
            await model.getCity(Object.values(params.locParams));
        }

        // if search is from the map, getForecast with the map marker coordinates
        if(params.searchType === 'map') {
            // throw error if map coords not set
            if(!maps.eCoords.hasOwnProperty('latitude') || !maps.eCoords.hasOwnProperty('longitude')) throw new Error('Please enter or select a location.', 'info');
            
            await model.getForecast(maps.eCoords);    
        }

        // set map coords for weatherMap render
        const coords = { 
            latitude: model.store.at(-1).data.lat, 
            longitude: model.store.at(-1).data.lon
        }
        // render weatherView and map
        weatherView.render(model.store);
        await maps.weatherMap(coords);
        
        // searchView.toggleSearchViewBlockedGeoLoc();
        searchView._clearForm(); // clear form details
        maps.clearMarkers(); // clear map markers
        message._autoClear(); // remove messages
    } catch(err) {
        message.renderMessage(err);
    }
}

// app load controller
const init = async function() {
    
    await controlAppStart(); // initial application load/render

    // event handler publishers
    searchView.addHandlerSearch();
    savedView.addHandlerSaved(controlCallSaved, controlRemoveSaved, sortSaved);
    weatherView.addHandlerCurrent(controlCurrentLocation);
    maps.addHandlerMapClick(enableSearchMap);
    layout.addHandlerToggleNav(searchLink, savedLink, infoLink);
    search.addHandlerSearchForm(controlLocationSearch);

    // parcel hot module for development
    if (module.hot) module.hot.accept();

    // global event listener for errors
    window.addEventListener('error', function(e) {
        console.log(e)
        console.log(e.error.stack);
        const message = e.error;
        console.log(message);

        e.preventDefault();
        
        errorHandled(message, 'error');
    })
}

// execute app
init();



// manually delete local storage index
        // function storageDeleteItem(locIndexStart) {
        //     const loc = JSON.parse(localStorage.getItem('loc'));
        //     console.log('LOCAL STORAGE; ', loc);
        //     loc.splice(locIndexStart, 3);
        //     localStorage.setItem('loc',JSON.stringify(loc))
        // }
        
        // storageDeleteItem(0);

