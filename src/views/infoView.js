'use strict';

// variables
let _parentElement = document.querySelector('#info');

// rendering instructions
export const render = function(){
    _clear(); // clear parent on re-render
    const markup = _generateMarkup(); // build the markup 
    // _element = markup.querySelector('#info');
    _parentElement.insertAdjacentHTML('beforeend', markup); // add markup to DOM
    // toggleInfo(); // on render show info view
}

// function to clear parent element
const _clear = function() {
    _parentElement.innerHTML = '';
}

// function to generate info view markup
const _generateMarkup = function() {
    return `
    <section class='c-card c-card__info'>
        <header class=' '>
            <h3 class='c-card__header c-card__header--modals info__header--heading'>Welcome to the Weather App!</h3>
        </header>
        <div class='info__content'>
            <div class='info__content--tips text '>Check out these hints to get you started!</div>

            <ul class='info__list'>
                <li class='info__item'>
                    <div class='info__icon'>
                        <svg class='info__icon--location'xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"/><circle cx="12" cy="9" r="2.5"/></svg>
                    </div>
                    <p class='info__text text__secondary'>If you've allowed your location in the browser your local weather will be automatically loaded. </p>
                    </li>
                <li class='info__item'>
                    <div class='info__icon'>
                        <svg class='search__link--icon' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                            <path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                    </div>
                    <p class='info__text text__secondary'>If you've chosen to block your location you can search by a location name or select a location on the map, or you can load a previously saved location from the bookmarks!</p>
                    </li>
                <li class='info__item'>
                    <div class='info__icon'>
                        <svg class='info__icon--search' xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><rect fill="none" height="24" width="24"/><path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"/></svg>
                    </div>
                    <p class='info__text text__secondary'>In the location weather view you can find the selected locations' weather, including current, hourly, daily forecasts, and the weather map!</p>
                </li>
                <li class='info__item'>
                    <div class='info__icon'>
                        <svg class='info__icon--save' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                        </svg>
                    </div>
                    <p class='info__text text__secondary'>If you'd like to save a location hit the bookmark icon next to the location name!</p> 
                <li class='info__item'>
                    <div class='info__icon'>
                        <svg class='' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/>
                            <path d="M15 7v12.97l-4.21-1.81-.79-.34-.79.34L5 19.97V7h10m4-6H8.99C7.89 1 7 1.9 7 3h10c1.1 0 2 .9 2 2v13l2 1V3c0-1.1-.9-2-2-2zm-4 4H5c-1.1 0-2 .9-2 2v16l7-3 7 3V7c0-1.1-.9-2-2-2z"/>
                        </svg>
                    </div>
                    <p class='info__text text__secondary'>To view all your saved locations hit the multiple bookmarks icon!</p>
                </li>
            </ul>
            <button class='btn info__btn'>Got it!</button>
        </div>


    </section>

    `
};      

export const toggleInfo = function() {
    _parentElement.classList.toggle('show');
    _parentElement.scrollIntoView({behavior: 'smooth'})

};

// function toggles the info view show/hide
export const addHandlerInfo = function() {
    _parentElement.addEventListener('click', (e) => {
        if(e.target.classList.contains('info__btn') || e.target.id === 'info') {
            _parentElement.classList.toggle('show');
        };
    });
};
