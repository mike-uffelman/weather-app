

class searchView {
    
    _parentElement = document.querySelector('#search__modal');
    _searchInput = document.querySelector('#city-input');
    
    addHandlerSearch(handler) {
        const form = document.querySelector('form');
        // const search = document.querySelector('#search')

        form.addEventListener('submit', (e) => {
            try {
                e.preventDefault();
                this._parentElement.classList.toggle('show');
                console.log(form.elements.city.value);
                const city = form.elements.city.value.split(', ');
                const cityRadio = form.elements.textRadio.checked;
                if(!cityRadio || cityRadio && !city || city.length <= 1 || city === ' ') return;
                // throw new Error('Unable to find city...');
                console.log('search value: ', city);
                console.log(city.length);
                handler(city);
                this._clear();

            } catch(err) {
                console.error('error!!!', err);
                throw err;
            }
        })

        this._parentElement.addEventListener('click', (e) => {
            if(e.target.classList.contains('close')) {
                console.log(e.target);
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






