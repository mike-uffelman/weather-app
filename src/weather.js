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



const saved = document.querySelector('#saved');
const map = document.querySelector('#mapid');
const locID = document.querySelector('.saved__card--locationID');




// let windowLoad = true;
const form = document.querySelector('form');


//app start controller
const controlAppStart = async function() {
    try {
        //on window load, only need to render the saved location container once, after that add/remove individually
        // let windowLoad = true;
        const savedLocs = await storage.getLocation();
        // console.log('storage on load: ', savedLocs);
        savedView.render(savedLocs)

        //* get current or random location
        await geoLoc.getGeolocation();
        console.log(geoLoc.coords[2]);

        if(geoLoc.coords[2] === true) {
            // const searchMap = new Map();
            
            // maps.searchMap(geoLoc.coords, 9);
            await model.getForecast(geoLoc.coords);
            console.log('DATA STORE: ', model.store)

            weatherView.render(model.store)
            maps.buildMap(geoLoc.coords);
        }

        if(geoLoc.coords[2] === false) {
            const marker = false;
            // const searchMap = new Map();
            searchView.toggleSearchViewBlockedGeoLoc();
            maps.searchMap(geoLoc.coords, 4, marker);
            return;
        } 
        

        //*render saved favorites from local storate
        
        // windowLoad = false;


        // console.log(model.store[0].data);
    } catch(err) {
        console.log('app start error!!!', err);
    }
    //! end of this controller ========================================
}

const controlCurrentLocation = async function(loc) {
    console.log(loc)
    console.log('storage pre ')
    const { bookmarked, id } = loc.at(-1).data;
    // console.log(id)
    const bookmarkedEl = document.querySelector('.header--add-fav');
    // let windowLoad = true;
    try {
        if(!bookmarked) {
            // console.log('no to yes: ', loc.at(-1).data)
            await model.updateBookmark();
            // console.log('no to yes: ', loc.at(-1).data)

            storage.addLocation(loc);
            const location = storage.getLocation();
            await savedView.render(location)
            // console.log('storage on add: ', storage.getLocation())
            // console.log(model.store);
        }

        if(bookmarked) { 
            storage.removeLocation(id); //*

            await model.updateBookmark(); //*
            savedView.removeEl(id);

        }
        
    } catch(err) {
        console.log('current location error!!!', err);
    }
}

const controlCallSaved = async function(id) {
    try {
        storage.incrementClicks(id);

        //this should probably be abstracted
        let loc = await storage.getLocation();
        loc.forEach(async (place) => {
            if(place.data.id === Number(id)) {
                const coords = [place.data.lat, place.data.lon, true, true, place.data.id];
                
                await model.getForecast(coords);
                await weatherView.render(model.store)
                // const weatherMap = new Map();
                maps.buildMap(coords); //*
            }
        })
        console.log(storage.getLocation());

    } catch(err) {
        console.log('saved location error!!!', err);
    }
    
}

const controlRemoveSaved = async function(id) {
    try {
        storage.removeLocation(Number(id));
        weatherView.toggleBookmarkIcon();
    } catch(err) {
        console.log('unable to remove this location', err);
    }
}

const controlSearch = async function(loc) {
    console.log(loc);
    const [city, state, country] = loc
    
    
    await model.getCity(city, state, country);

    // searchView.render(getCityTest)
    // await model.getForecast(coords);
    console.log(model.store);
    const coords = [model.store.at(-1).data.lat, model.store.at(-1).data.lon]
    console.log(model.store.at(-1).data.lat, model.store.at(-1).data.lon);
    // console.log(getCityTest);
    // console.log('after getCity call: ', model.store);
    weatherView.render(model.store);
    await maps.buildMap(coords) //*
}
    //? favorites get forecast
    
const enableSearchMap = function() {
    console.log('enabling search map!')
    maps.searchMap(geoLoc.coords, 9);
}

const controlMapClickSearch = async function() {
    const coords = await maps.eCoords;
    coords.push(true);
    console.log(coords);
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

    // // console.log(coords);
    // console.log(model.store);
    // alert('clicked the map')
}

const searchLink = function () {
    searchView.moveToSearch();
}

const savedLink = function () {
    savedView.moveToSaved();
}


    




const init = function() {
    controlAppStart();
    searchView.addHandlerSearch(controlSearch);
    savedView.addHandlerSaved(controlCallSaved, controlRemoveSaved);
    weatherView.addHandlerCurrent(controlCurrentLocation);
    maps.addHandlerMapClick(enableSearchMap, controlMapClickSearch);
    layout.addHandlerToggleNav(searchLink, savedLink);

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