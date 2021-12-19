

class searchView {
    
    _parentElement = document.querySelector('#city-input');
    
    async addHandlerSearch(handler) {
        const form = document.querySelector('form');
        form.addEventListener('submit', (e) => {
            try {
                
                e.preventDefault();
                const city = form.elements.city.value.split(', ');
                if(!city) return;
                // console.log('search value: ', city);

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






