

class searchView {
    
    _parentElement = document.querySelector('#search__modal');
    _searchInput = document.querySelector('#city-input');
    
    async addHandlerSearch(handler) {
        const form = document.querySelector('form');
        form.addEventListener('submit', (e) => {
            try {
                


                e.preventDefault();
                this._parentElement.classList.toggle('show');

                const city = form.elements.city.value.split(', ');
                if(!city || city.length <= 1 || city === ' ') return;
                console.log('search value: ', city);
                console.log(city.length);
                handler(city);
                this._clear();

            } catch(err) {
                console.error('error!!!', err);
            }
        })

        form.addEventListener('click', (e) => {
            if(e.target.classList.contains('close')) {
                this._parentElement.classList.toggle('show');
            }
        })
    }

    moveToSearch() {
        this._parentElement.scrollIntoView({behavior: 'smooth'})
    }

    toggleSearchViewBlockedGeoLoc() {
        document.querySelector('.search__modal').classList.toggle('show');
    }

    _clear() {
        this._searchInput.value = '';
    }
}
export default new searchView();






