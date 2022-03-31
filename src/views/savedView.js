
class DisplaySaved {

    _data;
    _sort;
    // _store;
    _parentElement = document.querySelector('#saved');
    // _sort = document.querySelector('#sort')


    // render the bookmarked locations view, 
    render(data, ...sort){
        console.log(sort);

        this._clear(); // clear the bookmarked locations container
        // this._store = store;
        this._data = data; // set data to _data private variable

        console.log('bookmarked array length: ', this._data.length);        
        this.sortSavedView(this._data, sort); // sort the bookmarks by the sort type
        sort ? this._sort = sort : undefined; // if sort is defined set _sort, otherwise undefined
        const markup = this._generateMarkup();

        this._parentElement.insertAdjacentHTML('beforeend', markup);
        
        if(!sort) return; // if sort is not defined return, do not proceed

        this.sortBookmarks(sort); // if sort is defined sort the bookmarks and return
        console.log(this._sort);
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    _generateMarkup() {
        return `
            <div class='saved__box'>
                <div class='saved__header'>
                    <h3 class='saved__header--heading'>Bookmarked Locations</h3>
                    <div class='saved__header--icons'>
                        <div class='close'></div>
                        <div id='sort' class='sort'>
                            <h3 class='sort__header'>Sort</h3>
                            <div class='sort__box'>
                                <ul class='sort__list'>
                                    <li class='sort__list--item'>A ➡ Z</li>
                                    <li class='sort__list--item'>Recent</li>
                                    <li class='sort__list--item'>Views</li>

                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
                ${this._data.length > 0 ? this._data.map(this._generateMarkupList).join('') : this._generateEmptyMessage()}
            </div>
        `
    }      

    _generateEmptyMessage() {
        return `
        <div class='saved__card--empty'>
            <span>No locations have been bookmarked</span>
        </div>
    `
    }
    

    _generateMarkupList(result) {
        // if(!result) document.querySelector('.saved__card--empty').classList.toggle('empty');
        // console.log('markup data', result)
        return `
                <div class='saved__card' data-id='${result.data.id}'> 
                    <div class='saved__card--detail'>
                        <h2 id='city-favorite' class='saved__card--detail-header '>
                            <a href='#' class='call-favorite'>${result.data.name}, ${!result.data.state ? '' : result.data.state}${!result.data.state ? '' : ', '} ${result.data.country}</a>
                        </h2> 
                        <a href='#' class='favorite__card--remove-favorite remove-favorite'>
                            <svg class='remove-fav' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path fill-rule="evenodd" d="M4.5 12.75a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75z"></path>
                            </svg>

                        </a>           

                    </div>
                </div>
            `;
    }


    // bookmarked locations sort function
    sortBookmarks(sort) {
        const previousList = document.querySelectorAll('.saved__card')
        previousList.forEach(item => item.remove()); // remove each bookmarked location from DOM

        const sortedLocationList = this._data.map(this._generateMarkupList).join(''); // each bookmarked location in the new sorted _data will be added to the markup and joined together 

        document.querySelector('.saved__box').insertAdjacentHTML('beforeend', sortedLocationList);
        this.updateSortHeading(sort); // set the sort type header in bookmarked view
    }

    //remove UI favorite item, e is defined in the calling event
    removeFavoriteUI(e) {
        e.remove();
    }

    removeEl(id) {
        const saved = document.querySelectorAll('.saved__card');
        saved.forEach(save => {
            if(Number(save.dataset.id) === id) save.remove();
        })
    }


    addHandlerSaved(handler, removeSaved, sortSaved) {
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
                if(this._parentElement.classList.contains('show')) {
                    this._parentElement.classList.toggle('show');
                };
            }

            if(e.target.classList.contains('close')) {
                this._parentElement.classList.toggle('show');
            }

            if(e.target.classList.contains('sort__list--item')) {
                const sort = e.target.innerText;
                console.log(sort);
                console.log(this._data);
                sortSaved(sort); //? what was this for again?
            }
        })
    }

    moveToSaved() {
        this._parentElement.scrollIntoView({behavior: 'smooth'});
    }

    // set the sort type header in bookmarked view
    updateSortHeading() {
        if(this._sort.length === 0) return;
        const sortHeading = document.querySelector('.sort__header');
        sortHeading.innerText = this._sort;
    }

    sortSavedView(data, sort) {
        if(!sort) return;
        if(sort === 'A ➡ Z') {
            return this._data.sort((a, b) => (a.data.name > b.data.name) ? 1 : -1);
        };

        if(sort === 'RECENT') {
            return this._data.sort((a, b) => (a.data.created < b.data.created) ? 1 : -1);
        };

        if(sort === 'VIEWS') {
            return this._data.sort((a, b) => (a.data.clicks < b.data.clicks) ? 1 : -1);
        };
    }
}

export default new DisplaySaved();