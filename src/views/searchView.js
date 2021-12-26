

class searchView {
    
    _parentElement = document.querySelector('#city-input');
    
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

    _clear() {
        this._parentElement.value = '';
    }
}
export default new searchView();






