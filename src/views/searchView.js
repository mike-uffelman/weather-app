'use strict';

import * as maps from './mapView.js';


let _parentElement = document.querySelector('#search');
let _searchInput; // search text box input
let _textRadio; // text box radio
let _mapRadio; // map radio


// on render, build the markup and assign elements to the class variables
export const render = function() {
    _clear();

    const markup = _generateHTML()
    _parentElement.insertAdjacentHTML('afterbegin', markup);

    _searchInput = document.querySelector('#city-input');
    _textRadio = document.querySelector('#textRadio');
    _mapRadio = document.querySelector('#mapRadio');
}

// html markup for the search module
const _generateHTML = function() {
        return  `
        <div class='c-card search__box'>
            <div class='c-card__header c-card__header--row'>
                <h2 class='c-card__header--modals'>Search</h2>
                <button class='btn btn--close'>
                    <svg class='' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
                </button>
            </div>
            <!--------------- Search Form -------------->
            <form action='/somewhere' class='c-card--current search__form' id='form'>
                <div class="search__form radio__box">
                    
                    <div class="search__form radio__box radio__box--select">

                        <input type="radio" class="" id="textRadio" name="search-location" value="textsearch">
                        
                        <label class="text" for="textRadio">Location name:</label>
                    </div>
                
                    <input type='text' id='city-input' name='city'  class='search__form-input' placeholder='e.g. "london, gb" OR "reno, nv, us"' autofocus>

                </div>    

                <div class="search__form radio__box radio__box--map">

                    <div class="search__form radio__box radio__box--select">

                        <input type="radio" class="" id="mapRadio" name="search-location" value="mapsearch">

                        <label for="mapRadio" class='text'>Location on the map:</label>

                    </div>
                <!-- Search Map -->
                    <div id='searchMap' class='search__form-map' tabIndex=5>
                        <span class='crosshair show'>

                        </span>
                        <div class="search__form-map--overlay">
                            <a href='#' class=''></a>Click to enable map</a></div>
                    </div>
                </div>

                <!-- -------- -->
                <button id='search-btn' class='btn btn--submit' tabIndex=6>Search!</button>
            </form>
        </div>`
}

// clears the html for re-rendering 
const _clear = function() {
    _parentElement.innerHTML = '';
}

// event handler for the close button in desktop view
export const addHandlerSearch = function() {
    _parentElement.addEventListener('click', (e) => {
        if(e.target.closest('.btn--close') || e.target.id === 'search') {
            _parentElement.classList.toggle('show');
        }
    })
};

// retrieves the form inputs on submit, event for the submit is in search.js however to prevent having an event listener in searchView and mapView
export const getInputs = function() {
        const form = document.querySelector('form');
        const textInputRadio = form.elements.textRadio.checked;
        const mapRadio = form.elements.mapRadio.checked;

        // the search params object passed returned to the controller
        let searchObj = {
            searchType: '',
            locParams: {}
        };

        // if neither radio are selected throw error notifying the user to select a search type
        if(!textInputRadio && !mapRadio) throw new Error('Please select a search type');


        // if searching by text input
        if(textInputRadio) {
            
            // split the location text into an array and trim excess spaces
            const city = form.elements.city.value.split(',').map(place => place.trim());
            
            // if the first index of the city array is an empty string or the city array contains 1 index, throw an error to be more specific for the geocoder
            if(city[0] === '' || city.length === 1) throw new Error('Unable to find location, please include city, state(US only), and country');

            
            // if city[0] is not blank and length greater than 1
            searchObj.searchType = 'text'; // assign the search type in our params
            searchObj.locParams.city = city[0]; // assign the first index to city
            
            // if city array length is greater than 2, only USA requires states
            if(city.length > 2) {
                searchObj.locParams.state = city[1]; // assign second index to state
                searchObj.locParams.country = city[2]; // assign third index to country
            }

            // if city array is equal to 2, for international (non-USA), major USA cities work here with just city, country too
            if(city.length === 2) {
                searchObj.locParams.country = city[1];
            }

            // return the searchObj parameters to the search controller
            return searchObj;
        }

        // if map radio selected
        if(mapRadio) {
            searchObj.searchType = 'map'; // assign map to the searchType
            searchObj.locParams.latitude = maps.eCoords.latitude;
            searchObj.locParams.longitude = maps.eCoords.longitude;
            // return the searchObj parameters to the search controller
            return searchObj;
        }
}

// function moves screen to the search view
export const toggleSearch = function() {
    _parentElement.classList.toggle('show');
    
    _parentElement.scrollIntoView({behavior: 'smooth'})

}

// function toggles the display for the searchView if location is blocked
export const toggleSearchViewBlockedGeoLoc = function() {
    _parentElement.classList.toggle('show');
}

// clear form inputs
export const _clearForm = function() {
    _searchInput.value = '';
    _textRadio.checked = false;
    _mapRadio.checked = false;
}






