'use strict';

// package imports - transpiling and polyfilling
import 'core-js/stable';
import 'regenerator-runtime/runtime'; 

// logic module imports
import * as model from './model.js';
import * as geoLoc from './geoLocation.js';
import * as storage from './localStorage.js';
import * as search  from './search.js';

// view module imports
import * as maps from '../views/mapView.js';
import * as weatherView from '../views/weatherView.js';
import * as savedView from '../views/savedView.js';
import * as searchView from '../views/searchView.js';
import * as infoView from '../views/infoView.js';
import * as message from '../views/messageView.js';
import * as navigationView from '../views/navigationView.js';

// parcel hot module for development
if(module.hot) module.hot.accept();

// not needed - just a console notification that we're in the development branch - based on the npm script (i.e. start or build(production))
if(process.env.NODE_ENV === 'development') console.log('Happy developing!');
// ----------------------------------------------------------------------------------------

//* ========== app start controller ==========
const controlAppStart = async function() {
    try {
        // render saved, search, info views/modals
        const savedLocs = await storage.getStoredLocations();
        model.state.bookmarks = savedLocs;
        savedView.render(model.state.bookmarks);
        infoView.render();
        searchView.render();
        
        // get current (location allowed) or random location(location blocked)
        await geoLoc.getGeolocation();

        // retrieve current location forecast
        await model.getForecast(model.state.geoLocation); 

        // render current weather
        await weatherView.render(model.state);

        // render weather map to current location weather view
        maps.weatherMap(model.state); 

        // start navigation event handlers
        navigationView.addHandlerNavigation(searchLink, savedLink, infoLink, currentWeatherLink);

        // infoView.toggleInfo();
        // model.clearGeoLocation();

        // await fetch('../../.netlify/functions/fetch-weather?name="mike"')
        // .then(response => console.log(response.json()))

    } catch(err) {
        console.error('app start error!!!', err);
        message.renderMessage(err, 'error');
    }
}



//* ========== Current weather page controller ==========
// save toggle for current location
const controlCurrentLocation = async function() {

    const { saved, id } = model.state.location

    try {
        // if current location is not saved, update model to saved: true, refresh local storage, re-render saved view, and display a success message
        if(!saved) { 
            await model.updateSaved(); // update 'saved' property to true
            storage.addStoredLocation(model.state); // add location to local storage
            savedView.render(storage.getStoredLocations()); // re-render the saved view
            message.renderMessage('Location successfully saved!', 'success');

        }

        // if current location is already saved, update to saved: false, remove saved item from saved view, re-render saved view, display a message
        if(saved) { 
            storage.removeStoredLocation(id); // remove saved location from local storage 
            await model.updateSaved(); // update 'saved' property of location model
            savedView.removeEl(id); // remove saved DOM element
            savedView.render(storage.getStoredLocations()); // re-render the saved view
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
        let coords;

        //!this should probably be abstracted===================
        let loc = storage.getStoredLocations(); // get saved locations
        //? change to access state.bookmarks
        // look for the saved location in the local storage that matches the id of the selected element in the saved view
        // when found, create a search param object for the model.getforecast
        // when forecast retrieved render the weatherview and the weather map
        loc.forEach(async (place) => {
            if(place.id === id) {
                coords = { 
                    latitude: place.lat,
                    longitude: place.lon,
                    saved: place.saved, 
                    id: place.id,
                    locPermission: 'allowed'
                };

            }
        })
        await model.getForecast(coords);
        await weatherView.render(model.state)

        maps.weatherMap(model.state);
        
        navigationView.addHandlerNavigation(searchLink, savedLink, infoLink, currentWeatherLink);
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
        await storage.removeStoredLocation(id); 

        const bookmarks = await storage.getStoredLocations()

        model.updateBookmarks(bookmarks)
        // retrieve updated local storage and re-render savedView
        savedView.render(bookmarks);
        // if location being removed from saved is also displayed in current  weather, remove saved icon styling
        weatherView.toggleSaveIcon(id);
        // display message 
        message.renderMessage('Location successfully removed', 'info');

    } catch(err) {
        console.error('unable to remove this location', err);
        message.renderMessage('Unable to remove saved location!')
    }
}
 
//* ========== Remove search map overlay ==========
const enableSearchMap = () => maps.searchMap(model.state.geoLocation, 2);

//* ========== toggle navigation items ==========
const searchLink = () => searchView.toggleSearch();
const savedLink = () => savedView.moveToSaved();
const infoLink = () => infoView.toggleInfo();
const currentWeatherLink = () => weatherView._moveToCurrentWeather();
    
//* ========== sort savedView locations ==========
const sortSaved = async function(sort) {
    // retrieve saved from local storage
    // const getSaved = await storage.getStoredLocations();
    
    // sorts the data array based on sort type
    // const sortedData = await savedView.sortSavedView(model.state.bookmarks, sort);
    
    // re-render savedview based on the newly sorted data array
    savedView.render(model.state.bookmarks, sort)
}

//* ========== global error/message handler ==========
const errorHandled = (messageText, type) => message.renderMessage(messageText, type)

//* ========== search controller ==========
const controlLocationSearch = async function (e) {
    try {
        // retrieve search inputs from submit
        const params = searchView.getInputs();
         
        // sets the state.query property
        await model.setStateQuery(params);
        // //? move conditional and state assignment to a function inside of model
        // if search is a text input location, call getCity
        if(model.state.query.searchType === 'text') {
            await model.getCity(model.state.query.locParams);
            // await model.callServer(model.state.query.locParams)
        }

        // if search is from the map, getForecast with the map marker coordinates
        if(model.state.query.searchType === 'map') {

            // throw error if map coords not set
            if(!model.state.query.locParams.hasOwnProperty('latitude') || !model.state.query.locParams.hasOwnProperty('longitude')) throw new Error('Please enter or select a location.', 'info');
            
            await model.getForecast(model.state.query.locParams);    
        }
        // render weatherView and map
        await weatherView.render(model.state);
        await maps.weatherMap(model.state);
        
        searchView.toggleSearch(); // hides searchView after submit
        searchView._clearForm(); // clear form details
        maps.clearMarkers(); // clear map markers
        message._autoClear(); // remove messages

        navigationView.addHandlerNavigation(searchLink, savedLink, infoLink, currentWeatherLink);
    } catch(err) {
        message.renderMessage(err);
    }
}

//* ========== app load controller ==========
const init = async function() {
    await controlAppStart(); // initial application load/render

    // event handler publishers
    searchView.addHandlerSearch();
    savedView.addHandlerSaved(controlCallSaved, controlRemoveSaved, sortSaved);
    weatherView.addHandlerCurrent(controlCurrentLocation);
    maps.addHandlerMapClick(enableSearchMap);
    search.addHandlerSearchForm(controlLocationSearch);
    infoView.addHandlerInfo();

    // global event listener for errors
    window.addEventListener('error', function(e) {
        const messageText = e.error;
        e.preventDefault();
        errorHandled(messageText, 'error');
    })

    
}

// execute app
init();