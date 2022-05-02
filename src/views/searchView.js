'use strict';

import weatherView from "./weatherView";
import * as maps from './mapView.js';


class searchView {
    
    _parentElement = document.querySelector('#search');
    _searchInput;
    _radioInput;
    

    render() {
        this._clear();

        const markup = this._generateHTML()
        this._parentElement.insertAdjacentHTML('afterbegin', markup);

        this._searchInput = document.querySelector('#city-input');
        this._radioInput = document.querySelector('#textRadio');
        // this._toggleSearchView();

    }

    _generateHTML() {
            return  `
            <div class='c-card search__box'>
                <div class='c-card__header c-card__header--row'>
                    <h2 class='c-card__header--modals'>Search</h2>
                    <button class='btn--close'>
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
                    <button id='search-btn' class='btn--submit' tabIndex=6>Search!</button>
                </form>
            </div>`
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    addHandlerSearch() {
        // const search = document.querySelector('#search')
        // form.addEventListener('submit', (e) => {
        //         e.preventDefault();
        //         const city = this.getInputs();
        //         this._parentElement.classList.toggle('show');

        //         handler(city);
        //         this._clearForm();
        // })        
        // this._radioInput.addEventListener('change', (e) => {
            
        //     const cityRadio = form.elements.textRadio.checked;
        //     console.log(cityRadio);
        //     handler(cityRadio)
        // })

        this._parentElement.addEventListener('click', (e) => {
            if(e.target.closest('.btn--close')) {
                console.log(e.target);
                this._parentElement.classList.toggle('show');
                

            }
        })

        //! just testing input required on radio toggle
        // document.querySelectorAll('input[type=radio]').forEach(r => {
        //     r.addEventListener('change', e => {
        //         console.log(e.target);
        //         if(document.querySelector('#textRadio').checked) {
        //             // document.querySelector('#city-input').classList.toggle('required');
        //             document.querySelector('#city-input').autofocus = 'true';

        //             document.querySelector('input[for=').classList.toggle('required');

        //         }

        //         if(document.querySelector('#mapRadio').checked) {
        //             document.querySelector('#city-input').classList.toggle('required');
        //             document.querySelector('label[for=mapRadio]').style.backgroundColor = 'blue';
        //         }
        //     })
        // })
    };

    

    getInputs() {
            const form = document.querySelector('form');
            const cityRadio = form.elements.textRadio.checked;
            const mapRadio = form.elements.mapRadio.checked;

            // if(form.elements.city.value === '') throw new Error('enter a valid location');

            // const city = form.elements.city.value?.split(',').map(place => place.trim());


            //*ok
            if(!cityRadio && !mapRadio) throw new Error('Please select a search type');

            //*ok
            let searchObj = {
                searchType: '',
                locParams: {}
            };

            if(cityRadio) {
                //*ok
                const city = form.elements.city.value.split(',').map(place => place.trim());
                
                //*ok
                if(city[0] === '' || city.length === 1) throw new Error('Unable to find location, please include city, state(US only), and country');

                searchObj.searchType = 'text';
                searchObj.locParams.city = city[0];
                
                if(city.length > 2) {
                    searchObj.locParams.state = city[1];
                    searchObj.locParams.country = city[2];
                }
                if(city.length === 2) {
                    searchObj.locParams.country = city[1];
                }
                console.log(city);
                console.log(searchObj)
                return searchObj;
            }

            if(mapRadio) {
                searchObj.searchType = 'map';
                console.log(searchObj);
                return searchObj;
            }

            
            // if(cityRadio && city) {
            //     return city;
            // } else {
            //     throw new Error('Search Failed! Please select search type and valid city name (city, state(US only), country) or map location.');
            // }
    }

    moveToSearch() {
        this._parentElement.scrollIntoView({behavior: 'smooth'})
    }

    toggleSearchViewBlockedGeoLoc() {
        document.querySelector('#search').classList.toggle('show');
    }

    _toggleSearchView() {
        document.querySelector('#search').classList.toggle('show');
    }

    _clearForm() {
        this._searchInput.value = '';
        this._radioInput.checked = false;
    }

    _showResults(cities) {
        const form = document.querySelector('#form');

        
    }
}
export default new searchView();






