'use strict';



// event listeners for navigation buttons
export const addHandlerToggleNav = function(searchLink, savedLink, infoLink, currentWeatherLink) {
    const nav = document.querySelector('.nav');

    // mouseover to open small screen nav menu
    nav.addEventListener('mouseover', (e) => {
        // open/close mobile nav on mouseover
        if(e.target.closest('.nav__toggle')) {
            e.target.closest('.nav').classList.toggle('is-open');
        };
    });

    nav.addEventListener('click', (e) => {
        // search
        if(e.target.closest('.search__link')) {
            searchLink();
        };

        // saved locations
        if(e.target.closest('.saved__link')) {
            savedLink();
        };

        // info/help button
        if(e.target.closest('.info__link')) {
            document.querySelector('#info').classList.toggle('show');
        };

        // current weather button
        if(e.target.closest('.weather__link')) {
            currentWeatherLink();
        }
    });
};


