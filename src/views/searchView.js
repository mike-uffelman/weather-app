

class searchView {
    
    _parentElement = document.querySelector('#search__modal');
    _searchInput = document.querySelector('#city-input');
    
    async addHandlerSearch(handler) {
        const form = document.querySelector('form');
        form.addEventListener('submit', (e) => {
            try {
                
                e.preventDefault();
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
    }

    moveToSearch() {
        this._parentElement.scrollIntoView({behavior: 'smooth'})
    }


    _clear() {
        this._searchInput.value = '';
    }
}
export default new searchView();






