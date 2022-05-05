'use strict';

// savedView class
class DisplaySaved {

    // savedView variables
    _data; 
    _sort;
    _parentElement = document.querySelector('#saved');


    // render the saved locations view
    render(data, ...sort){
        this._clear(); // clear the saved locations container
        this._data = data; // set data to _data private variable

        this.sortSavedView(this._data, sort); // sort the saved locations by the sort type
        sort ? this._sort = sort : undefined; // if sort is defined set _sort, otherwise undefined

        // assign markup variable and insert to HTML
        const markup = this._generateMarkup();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
        
        // if sort is not defined, then return; i.e. if this is the initial page load the saved sort of the savedView is the default (chronological)
        // if sort is defined then call sortSaved passing in the sort type
        if(!sort) return; 

        this.sortSaved(sort); // if sort is defined sort the Saved and return, //TODO refactor this
    }

    // clear savedView html for re-rendering
    _clear() {
        this._parentElement.innerHTML = '';
    }

    // savedView html markup
    _generateMarkup() {
        return `
            <div class='c-card saved__box'>
                <div class='c-card__header c-card__header--row '>
                    <h3 class='c-card__header--modals' tabindex=0>Saved Locations</h3>
                    <div class='saved__header--icons'>
                        <div id='sort' class='sort'>
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
                        <button class='btn--close'>
                            <svg class='close__btn--icon' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
                        </button>
                    </div>
                </div>
                    ${this._data.length > 0 ? this._data.map(this._generateMarkupList).join('') : this._generateEmptyMessage()}
            </div>
        `
    }      

    // if no locations are saved, display this in the savedView
    _generateEmptyMessage() {
        return `
        <div class='saved__card--empty'>
            <span>No locations have been saved</span>
        </div>
    `
    }
    

    // html markup for the locations saved
    _generateMarkupList(result) {
        return `
                <div class='saved__card' data-id='${result.data.id}'> 
                    <div class='saved__card--detail'>
                        <h2 id='city-favorite' class='saved__card--detail-header '>
                            <button class='call-favorite'>${result.data.name}, ${!result.data.state ? '' : result.data.state}${!result.data.state ? '' : ', '} ${result.data.country}</button       >
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


    // saved locations sort function, when the user selects a sort, this function removes all the items from the DOM, passes 
    // TODO refactor
    sortSaved(sort) {
        // console.log(this._data, sort);
        const previousList = document.querySelectorAll('.saved__card')
        previousList.forEach(item => item.remove()); // remove each saved location from DOM

        const sortedLocationList = this._data.map(this._generateMarkupList).join(''); // each saved location in the new sorted _data will be added to the markup and joined together 

        // renders the newly sorted and built saved locations list
        document.querySelector('.saved__box').insertAdjacentHTML('beforeend', sortedLocationList);

        // set the sort type header in the saved view dropdown
        this.updateSortHeading(sort);
    }

    // remove DOM element if the id paramter matches the 
    removeEl(id) {
        const saved = document.querySelectorAll('.saved__card');
        saved.forEach(save => {
            if(Number(save.dataset.id) === id) save.remove();
        })
    }

    // event handers and subscriber
    addHandlerSaved(handler, removeSaved, sortSaved) {

        this._parentElement.addEventListener('click', (e) => {
            // console.log(e.target);
            // if the remove saved button is clicked, call handler and pass id to controller, then remove the target from the DOM
            if(e.target.closest('.remove-favorite')) {
                const div = e.target.closest('.saved__card');
                const id = div.dataset.id;
                removeSaved(id);
                div.remove();
            }

            // if user clicks on the location in the card, call the handler and pass id to the controller, then toggle the savedView to hide it
            if(e.target.classList.contains('call-favorite')) {
                console.log('call favorite: ', e.target);
                const id = e.target.closest('.saved__card').dataset.id;
                handler(id);
                if(this._parentElement.classList.contains('show')) {
                    this._parentElement.classList.toggle('show');
                };
            }

            // close button, toggle show
            if(e.target.closest('.btn--close')) {
                this._parentElement.classList.toggle('show');
            }

            // sort button, call sortSaved and pass sort type to controller
            if(e.target.classList.contains('sort__box--button-item')) {
                const sort = e.target.innerText;
                sortSaved(sort); 
            }

        })

        // event handler for keypress to open sort dropdown
        this._parentElement.addEventListener('keypress', (e) => {
            if(e.code === 'Space') {
                console.log('keypress sort')
                document.querySelector('.sort__box').style.transform = 'scale(1, 1)';

            }
        })
    }

    // move to saved view 
    moveToSaved() {
        this._parentElement.scrollIntoView({behavior: 'smooth'});
    }

    // set the sort type header in saved view
    updateSortHeading() {
        if(this._sort.length === 0) return;
        const sortHeading = document.querySelector('.saved__header--icons .sort__header--heading');
        sortHeading.innerText = this._sort;
    }

    // sort the saved location data array depending on the sort selection, return the newly sorted array
    sortSavedView(data, sort) {
        try {
            if(!sort) return;
            if(sort === 'A-Z') {
                return this._data.sort((a, b) => (a.data.name > b.data.name) ? 1 : -1);
            };
    
            if(sort === 'RECENT') {
                return this._data.sort((a, b) => (a.data.created < b.data.created) ? 1 : -1);
            };
    
            if(sort === 'VIEWS') {
                return this._data.sort((a, b) => (a.data.clicks < b.data.clicks) ? 1 : -1);
            };
        } catch(err) {
            console.log(err);
            throw new Error('unable to sort...', err);
        }
        
    }
}

export default new DisplaySaved();