'use strict';



// event listeners for navigation buttons
export const addHandlerToggleNav = function(searchLink, savedLink) {
    const nav = document.querySelector('.nav');

    // mouseover to open small screen nav menu
    nav.addEventListener('mouseover', (e) => {
        if(e.target.closest('.nav__toggle')) {
            e.target.closest('.nav').classList.toggle('is-open');
        };
    });

    nav.addEventListener('click', (e) => {
        // search button
        if(e.target.closest('.search__link')) {
            e.preventDefault();
            searchLink();
            e.target.closest('.nav').classList.toggle('is-open');
        };

        // saved locations
        if(e.target.closest('.saved__link')) {
            e.preventDefault();
            savedLink();
            e.target.closest('.nav').classList.toggle('is-open');
        };

        // info/help button
        if(e.target.closest('.info__link')) {
            document.querySelector('#info').classList.toggle('show');
        };
    });
};


