import * as storage from '../localStorage.js';
// import View from './view.js';

class DisplaySaved {

    _parentElement = document.querySelector('#favorites');


    displayFavorites =  function(loc, windowLoad, store) {
        // let loc = storage.getLocation();
        console.log('Local Storage: ', loc)
        
        if(!windowLoad) this.buildFavoriteDivs(store.at(-1))
        
        loc.forEach(place => this.buildFavoriteDivs(place))
        
        
    }  

    render(data, windowLoad, store){
        this._data = data;
        this._store = store;
        // console.log(this._data);
        if(windowLoad) {
            console.log(this._data);
            const markup = this._data.map(this._generateMarkup).join('');
            this._parentElement.insertAdjacentHTML('beforeend', markup);

        } 
        // else 
        if(!windowLoad) {
            console.log(this._store);
            console.log(this._store.at(-1))
            const markup = this._generateMarkup(this._store.at(-1));
            this._parentElement.insertAdjacentHTML('beforeend', markup);

        }


        // this._clear();
    }

    _clear() {
        this._parentElement.lastChildElement.innerHTML = '';
    }
   

    _generateMarkup(result) {
        // const favorites = document.querySelector('#favorites');    
        //TODO --- change to insertAdjacentHTML---------------------------------------
        return `
                <div class='favorites__card' data-id='${result.data.id}'> 
                    <div class='favorites__card--detail'>
                        <h2 id='city-favorite' class='favorites__card--detail-header '>
                            <a href='#current-weather-box' class='call-favorite'>${result.data.name}, ${!result.data.state ? '' : result.data.state}${!result.data.state ? '' : ', '} ${result.data.country}</a>
                            <p class='favorites__card--locationID'>${result.data.id}</p>
                        </h2> 
                        <a href='#' class='favorite__card--remove-favorite remove-favorite'>
                            <svg class='remove-fav' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path fill-rule="evenodd" d="M4.5 12.75a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75z"></path>
                            </svg>

                        </a>           
                        <p class='favorites__card--locationID'>${result.data.id}</p>

                    </div>
                </div>
                
            `;
        // this._parentElement.insertAdjacentHTML('beforeend', html);
    }      

    //remove UI favorite item, e is defined in the calling event
    removeFavoriteUI = function(e) {
        e.remove();
    }


    addHandlerSaved(handler, removeSaved) {
        this._parentElement.addEventListener('click', (e) => {
            if(e.target.classList.contains('remove-fav')) {
                const div = e.target.closest('.favorites__card');

                const id = div.dataset.id;

                removeSaved(id);

                div.remove();

            }

            if(e.target.classList.contains('call-favorite')) {
                console.log('call favorite: ', e.target);
                const id = e.target.closest('.favorites__card').dataset.id;
                handler(id);
           
            }
        })
    }

    // favoritesActions = function(e) {
    //     //! targets may change after layour redesign------------------------
    //     if(e.target.classList.contains('remove-fav')) {
    //         removeFavoriteUI(e.target.closest('.favorites__card'));
    //         let id = Number(e.target.parentElement.nextSibling.nextSibling.innerText);
    //         return id;
    //         // storage.removeLocation(id);
    //     }

    //     //if the e.target is the city name we use the cityID again to iterate through the LS to find the lat/lon to re-load the favorite as the current weather    
    //     if(e.target.classList.contains('call-favorite')) {

    //         console.log('get this favorite location weather');

    //         let eid = Number(e.target.nextElementSibling.innerText);
    //         console.log(eid);
    //         return eid;
    //     }
    // }
}

export default new DisplaySaved();