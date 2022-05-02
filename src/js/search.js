'use strict';


export const addHandlerSearchForm = function(handler) {
    const form = document.querySelector('#form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('submitting form now....')
        handler(e);
    });
}