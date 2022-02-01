class InfoView {

    _data;
    _sort;
    // _store;
    _parentElement = document.querySelector('#info');
    // _sort = document.querySelector('#sort')


    render(){
        this._clear();

        // this._store = store;
        
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
                // const div = e.target.closest('.saved__card');
                // const id = div.dataset.id;
                // removeSaved(id);
                // div.remove();

            }

        })

    }
 
}

export default new InfoView();