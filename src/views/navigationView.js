'use strict';


import * as utility from "../js/utility.js";

let _search = document.querySelector('#search');
let _saved = document.querySelector('#saved');
let _info = document.querySelector('#info');

export const render = function(permission) {
    // clear();
    const navMarkup = _generateMarkup(permission);
    // _navMenu = document.querySelectorAll('.nav__menu');

    return navMarkup
}

const clear = function() {
    // document.querySelectorAll('nav')?.forEach(n => n.innerHTML = '');
    
    document.querySelectorAll('nav')?.forEach(n => n.remove());

    document.querySelector('.nav__main').classList = 'nav nav__main'
}

// this handler toggles the .hide class to display the navbar when user location is blocked and screen size is > 700px
export const addHandlerNavigation = function(searchLink, savedLink, infoLink, currentWeatherLink) {
    document.querySelectorAll('nav').forEach(n => {
        n.addEventListener('click', (e) => {
            if (e.target.closest('.nav__toggle')) {
                document.querySelector('.nav').classList.toggle('is-open');

                document.querySelector('.nav__menu').classList.toggle('is-open');
                document.querySelector('.nav__toggle--burger').classList.toggle('is-active');
            };
        });
    });

    // create event listener for button button clicks on each navigation, selecting a navigation item will close the others if open
    document.querySelectorAll('.nav__menu').forEach(nav => {
        nav.addEventListener('click', (e) => {
            // search 
            if(e.target.closest('.search__link')) {
                searchLink();
                [_saved, _info].forEach(item => item.classList.remove('show'));
            };

            // saved locations
            if(e.target.closest('.saved__link')) {
                savedLink();
                [_search, info].forEach(item => item.classList.remove('show'));
            };

            // info/help button
            if(e.target.closest('.info__link')) {
                infoLink();
                [_saved, _search].forEach(item => item.classList.remove('show'));
            };

            // current weather button
            if(e.target.closest('.weather__link')) {
                currentWeatherLink();
                [_saved, _search, _info].forEach(item => item.classList.remove('show'));
            }
        });
    });
};


// navbar markup function for rendering
const _generateMarkup = function(permission) {
    
    return `
        <h3 class='nav__date date'>${utility.getTodaysDate()}</h3>
        <div class='nav__container'>
            <header class="nav__toggle">
                <svg class='nav__toggle--burger' xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M6 36V33H42V36ZM6 25.5V22.5H42V25.5ZM6 15V12H42V15Z"/></svg>
            </header>
            
            <div class='nav__links nav__links--large'> 
                <section class="nav__menu ${permission}">
                    <button class='nav__link search__link'>
                        <svg class='search__link--icon' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                            <path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                        <span class='text__nav'>search</span>
                    </button>
                    <button class='nav__link weather__link'>

                        <svg class='current__link--icon' xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><rect fill="none" height="24" width="24"/><path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"/></svg>
                        <span class='text__nav'>Current</span></button>
                    <button class='nav__link info__link'>
                        <svg class='info__link--icon' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/>
                            <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        </svg>
                        <span class='text__nav'>info</span></button>
                    
                    <button class='nav__link saved__link'>
                        <svg class='saved__link--icon' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/>
                            <path d="M15 7v12.97l-4.21-1.81-.79-.34-.79.34L5 19.97V7h10m4-6H8.99C7.89 1 7 1.9 7 3h10c1.1 0 2 .9 2 2v13l2 1V3c0-1.1-.9-2-2-2zm-4 4H5c-1.1 0-2 .9-2 2v16l7-3 7 3V7c0-1.1-.9-2-2-2z"/>
                        </svg>
                        <span class='text__nav'>saved</span>
                    </button>
                </section>
            </div>
        </div>`
};
