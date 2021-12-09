

class searchView {
    
    _parentElement = document.querySelector('#city-input');
    
    
    async addHandlerSearch(handler) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const city = form.elements.city.value.split(', ');
            handler(city);
            this._clear();        
            // console.log(city);
        })
    }

    _clear() {
        this._parentElement.value = '';
    }

    // html = `

    // `
    // render(data){
    //     this._data = data;
    //     // console.log(this._data);
        


    //     // this._clear();
    // }

    // _clear() {
    //     this._parentElement.innerHTML = '';
    // }
   

    // _generateMarkup(result) {
    //     // const favorites = document.querySelector('#favorites');    
    //     //TODO --- change to insertAdjacentHTML---------------------------------------
    //     return `
    //     <div class='searchPage__results--item'><a href='#'>result</a></div>
                
    //         `;
    //     // this._parentElement.insertAdjacentHTML('beforeend', html);
    // }      
    

}
export default new searchView();






