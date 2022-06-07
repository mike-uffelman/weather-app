'use strict';

// event handler for search form, abstracts duplicate submit events from searchView and mapView
export const addHandlerSearchForm = function(handler) {
    const form = document.querySelector('#form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handler(e);
    });
}