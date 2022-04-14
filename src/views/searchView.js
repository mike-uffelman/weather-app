
import weatherView from "./weatherView";

class searchView {
    
    _parentElement = document.querySelector('#search');
    _searchInput = document.querySelector('#city-input');
    _radioInput = document.querySelector('#textRadio');
    
    
    addHandlerSearch(handler) {
        // const search = document.querySelector('#search')
        // form.addEventListener('submit', (e) => {
        //         e.preventDefault();
        //         const city = this.getInputs();
        //         this._parentElement.classList.toggle('show');

        //         handler(city);
        //         this._clearForm();
        // })        
        this._radioInput.addEventListener('change', (e) => {
            const cityRadio = form.elements.textRadio.checked;
            console.log(cityRadio);
            handler(cityRadio)
        })

        this._parentElement.addEventListener('click', (e) => {
            if(e.target.classList.contains('close')) {
                console.log(e.target);
                this._parentElement.classList.toggle('show');
                

            }
        })
    }

    

    getInputs() {
            const form = document.querySelector('form');
            const city = form.elements.city.value.split(',').map(place => place.trim());
            console.log(city);
            return city;
            // if(cityRadio && city) {
            //     return city;
            // } else {
            //     throw new Error('Search Failed! Please select search type and valid city name (city, state(US only), country) or map location.');
            // }
    }

    moveToSearch() {
        this._parentElement.scrollIntoView({behavior: 'smooth'})
    }

    toggleSearchViewBlockedGeoLoc() {
        document.querySelector('.search').classList.toggle('show');
    }

    _clearForm() {
        this._searchInput.value = '';
        this._radioInput.checked = false;
    }

    _showResults(cities) {
        const form = document.querySelector('#form');

        
    }
}
export default new searchView();






