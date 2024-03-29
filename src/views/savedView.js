'use strict';

// savedView variables
let _data; 
let _sort;
let _parentElement = document.querySelector('#saved');


// render the saved locations view
export const render = async function(data, ...sort){
    _clear(); // clear the saved locations container

    _data = data; // set data to _data private variable
    sort ? _sort = sort[0] : undefined; // if sort is defined set _sort, otherwise undefined

    await sortSavedView(); // sort the saved locations by the sort type, on intial render - don't sort, just use order from local storage

    // assign markup variable and insert to HTML
    const markup = _generateMarkup();
    _parentElement.insertAdjacentHTML('afterbegin', markup);

    // if sort is not defined (falsey), then return; if this is the initial page load the saved sort of the savedView falsey and therefore the default order of saved location in database (local storage)
    _sort && updateSortHeading(_sort);
}

// clear savedView html for re-rendering
const _clear = function() {
    _parentElement.innerHTML = '';
}

// savedView html markup
const _generateMarkup = function() {
    return `
        <div class='c-card saved__box'>
            <div class='c-card__header c-card__header--row '>
                <h3 class='c-card__header--modals' tabindex=0>Saved Locations</h3>
                <div class='saved__header--icons'>
                    <div id='sort' class='sort ${_data.length < 2 ? "hide" : ""}'>
                        <button class='sort__header'>
                            <h3 class='sort__header--heading'>Sort</h3>
                            <svg class='sort__header--icon' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>
                        </button>
                        <div class='sort__box'>
                                <button class='sort__box--button-item'>A-Z</button>
                                <button class='sort__box--button-item'>RECENT</button>
                                <button class='sort__box--button-item'>VIEWS</button>
                        </div>
                    </div>
                    <button class='btn btn--close'>
                        <svg class='close__btn--icon' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
                    </button>
                </div>
            </div>
                ${_data.length > 0 ? _data.map(_generateMarkupList).join('') : _generateEmptyMessage()}
        </div>
    `
}      


// if no locations are saved, display this in the savedView
const _generateEmptyMessage = function() {
    return `
    <div class='saved__card--empty'>
        <span>No locations have been saved</span>
    </div>
`
}

    

// html markup for the locations saved
const _generateMarkupList = function(result) {
    return `
            <div class='saved__card' data-id='${result.id}'> 
                <div class='saved__card--detail'>
                    <h2 id='city-favorite' class='saved__card--detail-header '>
                        <button class='call-favorite'>${result.name}, ${!result.state ? '' : result.state}${!result.state ? '' : ', '} ${result.country}</button       >
                    </h2> 
                    <button class='saved__card--remove-favorite remove-favorite'>
                        <svg class='remove-fav' alt='Select to remove location from favorties' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path fill-rule="evenodd" d="M4.5 12.75a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75z"></path>
                        </svg>

                    </button>           

                </div>
            </div>
        `;
}

// remove DOM element if the id paramter matches the 
export const removeEl = function(id) {
    const saved = document.querySelectorAll('.saved__card');
    saved.forEach(save => {
        if(Number(save.dataset.id) === id) save.remove();
    })
}

// event handers and subscriber
export const addHandlerSaved = function(handler, removeSaved, sortSaved) {

    _parentElement.addEventListener('click', (e) => {
        // if the remove saved button is clicked, call handler and pass id to controller, then remove the target from the DOM
        if(e.target.closest('.remove-favorite')) {
            const locationCard = e.target.closest('.saved__card');
            
            removeSaved(locationCard.dataset.id);
            locationCard.remove();
        }

        // if user clicks on the location in the card, call the handler and pass id to the controller, then toggle the savedView to hide it
        if(e.target.classList.contains('call-favorite')) {

            const id = e.target.closest('.saved__card').dataset.id;
            handler(id);
            if(_parentElement.classList.contains('show')) {
                _parentElement.classList.toggle('show');
            };
        }

        // close button, toggle show
        if(e.target.closest('.btn--close') || e.target.id === 'saved') {
            _parentElement.classList.toggle('show');
        }

        // sort button, call sortSaved and pass sort type to controller
        if(e.target.classList.contains('sort__box--button-item')) {
            const sort = e.target.innerText;
            sortSaved(sort); 
        }

    })

    // event handler for keypress to open sort dropdown
    _parentElement.addEventListener('keypress', (e) => {
        if(e.code === 'Space') {
            document.querySelector('.sort__box').style.transform = 'scale(1, 1)';

        }
    })
}

// move to saved view
export const moveToSaved = function() {
    _parentElement.classList.toggle('show');

    _parentElement.scrollIntoView({behavior: 'smooth'});
}

// set the sort type header in saved view
const updateSortHeading = function() {
    if(!_sort) return;
    const sortHeading = document.querySelector('.saved__header--icons .sort__header--heading');
    sortHeading.innerText = _sort;
}

// sort the saved location data array depending on the sort selection, return the newly sorted array
export const sortSavedView = function() {
    try {
        if(!_sort) return; // on initial render, don't sort, just use the saved location order as saved

        if(_sort === 'A-Z') {
            return _data.sort((a, b) => (a.name > b.name) ? 1 : -1);
        };

        if(_sort === 'RECENT') {
            return _data.sort((a, b) => (a.created < b.created) ? 1 : -1);
        };

        if(_sort === 'VIEWS') {
            return _data.sort((a, b) => (a.clicks < b.clicks) ? 1 : -1);
        };

    } catch(err) {
        console.log(err);
        throw new Error('unable to sort...', err);
    }
    
}
