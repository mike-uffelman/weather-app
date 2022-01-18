
class DisplaySaved {

    _data;
    _sort;
    // _store;
    _parentElement = document.querySelector('#saved');
    // _sort = document.querySelector('#sort')


    render(data, ...sort){
        this._clear();

        // this._store = store;
        
        this._data = data;
        console.log('data length: ', this._data.length);
        console.log('bookmarked array length: ', this._data.length);        
        this.sortSavedView(this._data, sort);
        sort ? this._sort = sort : undefined;
        const markup = this._generateMarkup();

        this._parentElement.insertAdjacentHTML('beforeend', markup);
        
        if(!sort) return;

        this.sortBookmarks(sort);
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
                ${this._data.map(this._generateMarkupList).join('')}
                
            </div>

        `
    }      

    
    _generateMarkupList(result) {
        console.log('markup data', result)
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

    // appendBookmark() {
    //     const markup = this._generateMarkupList(this._store.at(-1));
    //     document.querySelector('.saved__box').insertAdjacentHTML('beforeend', markup);
    // }

    sortBookmarks(sort) {
        const previousList = document.querySelectorAll('.saved__card')
        previousList.forEach(item => item.remove());

        // console.log('sorting bookmarks..........', this._data, this._sort);

        const sortedLocationList = this._data.map(this._generateMarkupList).join('')

        document.querySelector('.saved__box').insertAdjacentHTML('beforeend', sortedLocationList);
        this.updateSortHeading(sort);
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
            // console.log(save.dataset.id);
            // console.log(id)
            
            if(Number(save.dataset.id) === id) {
                save.remove();
            }
        })
        // this.render(this.data
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
                if(this._parentElement.classList.contains('show')) {
                    this._parentElement.classList.toggle('show');
                };

           
            }

            if(e.target.classList.contains('close')) {
                this._parentElement.classList.toggle('show');
            }

            // if(e.target.classList.contains('sort__list--item')) {
                // console.log(e.target.closest('.sort'))

            // }
            if(e.target.classList.contains('sort__list--item')) {
                const sort = e.target.innerText;
                console.log(sort);
                console.log(this._data);

                const sortedData = this.sortSavedView(this._data, sort);
                this.render(sortedData, sort)
                
                // sortSaved(newSort);
                // sortSaved();
            }

            
        })


        // this._parentElement.addEventListener('mouseo')
    }

    moveToSaved() {
        this._parentElement.scrollIntoView({behavior: 'smooth'});
    }

    updateSortHeading() {
        if(this._sort.length === 0) return;
        const sortHeading = document.querySelector('.sort__header');
        sortHeading.innerText = this._sort;
    }

    sortSavedView(data, sort) {
        // console.log(`sortSavedView: now sorting by ${sort}`);
        
        // const loc = storage.getLocation();
        // console.log(data);
        // console.log(sort);

        // if(!sorting) return loc;

        if(sort === 'A ➡ Z') {
            this._data.sort((a, b) => (a.data.name > b.data.name) ? 1 : -1);
            console.log(this._data);
            return this._data;

        };

        if(sort === 'RECENT') {
            this._data.sort((a, b) => (a.data.created < b.data.created) ? 1 : -1);
            console.log(this._data);
            return this._data;

        };

        if(sort === 'VIEWS') {
            this._data.sort((a, b) => (a.data.clicks < b.data.clicks) ? 1 : -1);
            console.log(this._data);
            return this._data;
        };


        // console.log(loc);
        // const sortVal = document.querySelector('.sort__header');

        // document.querySelector('.sort__list').addEventListener('click', (e) => {
        //     if(e.target.classList.contains('sort__list--item')) {
        //         console.log(this);
        //     }
        // })

        // console.log(this._sort);
        // this._sort.addEventListener('click', (e) => {
        //     console.log(e.target);
        // })


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