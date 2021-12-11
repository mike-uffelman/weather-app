

class searchView {
    
    _parentElement = document.querySelector('#city-input');
    
    async addHandlerSearch(handler) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const city = form.elements.city.value.split(', ');
            // console.log('search value: ', city);

            handler(city);
            this._clear();        
        })
    }

    _clear() {
        this._parentElement.value = '';
    }
}
export default new searchView();






