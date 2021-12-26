import * as storage from '../localStorage.js';
// import View from './view.js';

class DisplaySaved {

    _parentElement = document.querySelector('#saved');


    displaySaved =  function(loc, windowLoad, store) {
        // let loc = storage.getLocation();
        console.log('Local Storage: ', loc)
        
        if(!windowLoad) this.buildFavoriteDivs(store.at(-1))
        
        loc.forEach(place => this.buildFavoriteDivs(place))
        
        
    }  

    render(data, windowLoad, store){
        this._data = data;
        this._store = store;
        if(windowLoad) {
            const markup = this._generateMarkup();
            this._parentElement.insertAdjacentHTML('beforeend', markup);

        } 
        // else 
        if(!windowLoad) {
            const markup = this._generateMarkupItems(this._store.at(-1));
            document.querySelector('.saved__box').insertAdjacentHTML('beforeend', markup);

        }


        // this._clear();
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }
   


    _generateMarkup() {

        return `
            <div class='saved__box'>
                <h3 class='saved__header'>Saved Locations</h3>

                ${this._data.map(this._generateMarkupItems).join('')}
            </div>

        `

        // const saved = document.querySelector('#saved');    
        //TODO --- change to insertAdjacentHTML---------------------------------------
        
    }      

    _generateMarkupItems(result) {
        return `
                <div class='saved__card' data-id='${result.data.id}'> 
                    <div class='saved__card--detail'>
                        <h2 id='city-favorite' class='saved__card--detail-header '>
                            <a href='#current-weather-box' class='call-favorite'>${result.data.name}, ${!result.data.state ? '' : result.data.state}${!result.data.state ? '' : ', '} ${result.data.country}</a>
                        </h2> 
                        <a href='#' class='favorite__card--remove-favorite remove-favorite'>
                            <svg class='remove-fav' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path fill-rule="evenodd" d="M4.5 12.75a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75z"></path>
                            </svg>

                        </a>           

                    </div>
                </div>
                
            `;
        // this._parentElement.insertAdjacentHTML('beforeend', html);
    }

    //remove UI favorite item, e is defined in the calling event
    removeFavoriteUI(e) {
        e.remove();
    }

    removeEl(id) {
        // console.log(loc)
        // const {id} = loc.at(-1).data
        const saved = document.querySelectorAll('.saved__card');
        saved.forEach(save => {
            // console.log(save);
            console.log(save.dataset.id);
            console.log(id)
            
            if(Number(save.dataset.id) === id) {
                save.remove();
            }
        })
    }


    addHandlerSaved(handler, removeSaved) {
        this._parentElement.addEventListener('click', (e) => {
            if(e.target.classList.contains('remove-fav')) {
                const div = e.target.closest('.saved__card');

                const id = div.dataset.id;

                removeSaved(id);

                div.remove();

            }

            if(e.target.classList.contains('call-favorite')) {
                console.log('call favorite: ', e.target);
                const id = e.target.closest('.saved__card').dataset.id;
                handler(id);
           
            }
        })
    }

    // savedActions = function(e) {
    //     //! targets may change after layour redesign------------------------
    //     if(e.target.classList.contains('remove-fav')) {
    //         removeFavoriteUI(e.target.closest('.saved__card'));
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