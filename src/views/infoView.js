class InfoView {
    _data;
    _sort;
    _parentElement = document.querySelector('#info');

    render(){
        this._clear();
        this._data = data;
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
            

        `
    }      

    toggleInfoView() {
        this._parentElement.addEventListener('click', (e) => {
            if(e.target.classList.contains('close')) {
                console.log('closing info modal...')
                this._parentElement.classList.toggle('show');

            }

        })

    }
 
}

export default new InfoView();