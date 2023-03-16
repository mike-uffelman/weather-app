'use strict';

import * as navigationView from "./navigationView";
import * as utility from "../js/utility.js";

let _currentWeather = document.querySelector('#current-weather-box');
let _data;

// rendering controller for weatherView
export const render = async function(data) {
    // console.log(data)
    try {

        // document.querySelector('.nav__main')?.remove();
        _loadStyles(); // render laod specific styling
        _clear(); // clear
        _data = data; // set data parameter to class variable
        console.log(_data)
        //build main nav container
        await buildMainNavContainer(_data);


        // if user location is blocked, display data and nav menu in desktop if no location (blocked)
        if(!_data.location) {
            document.querySelector('.nav__main').classList.add('blocked');  
            _currentWeather.style.display = 'none';
        }
        
        // if rendering location weather
        if(_data.location) {
            const weatherMarkup = await _generateMarkup(_data);
            _currentWeather.insertAdjacentHTML('afterbegin', weatherMarkup);

            await buildWeatherNavContainer(_data);
            // document.querySelector('.nav__menu').classList.('blocked'); 
                

            _tempBars(); // build color temperature bars
            _windDirection(); // build wind direction arrow

            // if the latest(current weather) is saveed, fill the bookmark icon
            if(_data.location.saved === true) {
                document.querySelector('.c-location__save--icon').classList.add('is-saved');
            }
            
            _currentWeather.style.display = 'flex'; //prevents mobile view overflow
            _weatherAlertToggle();

            setTimeout(() => {
                _currentWeather.scrollIntoView({behavior: 'smooth'})
            }, 1000) 

        }
        document.querySelectorAll('.nav__toggle').forEach(n => n.classList.add(`${_data.geoLocation.locPermission}`))

    } catch(err) {
        console.error('error rendering location forecast!!!', err);
        throw err;
    }   
}

const _loadStyles = function() {

    _currentWeather.classList.toggle('show');
    _currentWeather.style.opacity = 0;
    _currentWeather.style.transition = 'opacity ease 500ms';
    _currentWeather.style.opacity = 1;
}

// clear the weatherView
const _clear = function() {
    _currentWeather.innerHTML = null;

    // document.querySelectorAll('nav')?.forEach(n => n.innerHTML = '');
    document.querySelectorAll('nav')?.forEach(n => n.remove());

}

// export const removeHandlerCurrent = function() {
//     _currentWeather.removeEventListener('click', () => weatherEvents());
// }

const weatherEvents = (e, handler, showDetails) => {
    // save a location event
    if(e.target.closest('.c-cw__location')) {
        document.querySelector('.c-location__save--icon').classList.toggle('is-saved');
        // handler(_data);
        handler();

    };

    // link to weather alerts
    if(e.target.classList.contains('details__header--alerts')) {
        document.querySelector('#alerts').scrollIntoView({behavior: 'smooth'});
    }

    if(e.target.closest('.l-current__extras')) {
        console.log('extras clicked', e.target)
        const showMore = document.querySelector('.l-current__extras');
        showMore.classList.toggle('showMore')
        showDetails();
    }

    
}

// weatherView event handler and subscriber
export const addHandlerCurrent = function(handler, showDetails) {       
    _currentWeather.addEventListener('click', (e) => weatherEvents(e, handler, showDetails));
}

// toggle save icon stylings
export const toggleSaveIcon = function(id) {
    const currentId = _data.location.id;
    if(id !== currentId) return;   
    const currentLocationSave = document.querySelector('#saveIcon');
    currentLocationSave.classList.toggle('is-saved');
}

const _buildWeatherExtras = function(current, daily) {

    return `
        <div class='l-current__extras--more'>
            <h3 class='l-current__extras--header text text__current'>More</h3>
            <span class="material-symbols-outlined l-current__extras--icon">
                arrow_forward_ios
            </span>
        </div>
        <div class='l-current l-current__extras--detail'>
            <div class='l-current__content'>
                <div class='l-current__content--icons'>
                    <svg alt='wind direction and speed' class='details__box--wind-direction' data-wind-direction='${current.wind_deg}' height="25" width="25">
                        <polygon points='12.5,5 20,20 12.5,16 5,20'>
                    </svg>
                    <p class='text text--extras'>${_windCardinalDirection(current.wind_deg)}</p>
                </div>
                <p class='text text--extras'>${current.wind_speed.toFixed(0)} mph</p>
            </div>
            <div class='l-current__content'>
                
                <p class='text text--extras'>Precip</p>
                <p class='text text--extras'>${(daily[0].pop * 100).toFixed(0)}%</p>
            </div>
            <div class='l-current__content'>
                <p class='text text--extras'>UV Index</p>
                <p class='text text--extras'>${_uvIndexRating(current.uvi)}</p>
            </div>
            <div class='l-current__content' >
                        
                <p class='text text--extras'>Humidity</p>
                <p class='text text--extras'>${(current.humidity).toFixed(0)}%</p>
                
            </div>
        </div>
    `

    
}

const buildMainNavContainer = async function(data) {
    // if data.location exists and locpermission is defined, otherwise use data.geoLoc.locPermission - nullish coalescing
    const permission = data.location?.locPermission ?? data.geoLocation.locPermission;
    const mainNav = `
        <nav id='nav' class='nav nav__main'>
            ${await navigationView.render(permission)}
        </nav>`;

    document.querySelector('main').insertAdjacentHTML('beforeend', mainNav);
}

const buildWeatherNavContainer = async function(data) {
    const permission = data.geoLocation.locPermission;

    const weatherNav = `
        <nav class='nav__current--large nav__weather'>
            ${await navigationView.render(permission)}
        </nav>`;

    document.querySelector('.l-weather').insertAdjacentHTML('beforeend', weatherNav);
}

//* view=====================================================================================
const _generateMarkup =  function(data) {
    const { alerts, current, daily, hourly, id, name, state, country } = data.location;
    
    // const { alerts, current, daily, hourly, id, name, state, country } = data.at(-1)?.data;
    const today = data.location.daily[0].temp;

    return `
        <div class='l-weather'>
            <section class='l-cw'>
                <div class='l-cw__container' data-id='${id}'>
                    <section class='c-cw__location'>
                        <header class='c-location'>
                            <h3 id='city-display' class='c-location__header'>
                                <button class='c-location__header--link'>${name}</button>
                            </h3>
                            <h5 class='c-location__header--sub'>${(!state) ? '' : state + ', '} ${country}</h5>
                            <p class='c-location__date'>${utility.getTodaysDate()}</p>
                        </header>

                        <svg id='saveIcon' class='c-location__save--icon' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                        </svg>
                    </section>

                    
                        <section class='c-card c-card--current'>
                            <header class=''>
                                <h3 class='c-card__header'>Right Now</h3>
                                <a href='#alerts' class='c-card__header c-card__cw-alerts c-card__cw-alerts--link ${alerts ? "" : "hide"}' data-alerts=${alerts?.length}>Weather Advisory</a>
                            </header>
                            <div class='c-card__content c-card__content--current '>
                                <div class='l-current l-current__weather'>
                                    <p class='text__current--temp'>${current.temp.toFixed(0)}° F</p>    
                                    <p class='text text__current'>${current.weather[0].description}</p>
                                    <div class='l-current__feels-like'>
                                        <p class='text current'>${today.max.toFixed(0)}°F / ${today.min.toFixed(0)}°F</p>
                                        <p class='details__box--feels-like text current'>, feels like ${current.feels_like.toFixed(0)}° F</p>
                                    </div>
                                </div>
                                <div class='l-current__extras'>
                                    ${_buildWeatherExtras(current, daily)}
                                </div>
                                
                                
                                
                                    <img id='icon' src='https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png' data-img-src='https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png' alt='' class='l-current l-current__icon'>
                                    
                            </div>    
                        </section>
                    
                </div>
            </section>
            
                
            <section class='l-forecast-container'>
                <div class='c-card c-card--hourly' tabindex=0>
                    <h3 class='c-card__header'>Hourly Forecast</h3>
                    <div class='c-card__detail c-card__detail--hourly' >
                        ${_generateHourly(hourly)}
                    </div>
                </div>     
                <div class='c-card c-card--weekly'>
                    <h3 class='c-card__header'>Weekly Forecast</h3>
                    <div class='c-card__detail c-card__detail--weekly'>
                        ${_generateWeekly(daily)}
                    </div>
                </div>  
            </section>
            <section class='c-card c-card__map'>
                <h3 class='c-card__header'>Weather Map</h3>
                <div id='mapid' class='' ></div>
                    
            </section>
            <section id='alerts' class='c-card c-card--alert ${alerts ? "alert" : "hide"}'>
                <h3 class='c-card__header c-card__cw-alerts c-card__cw-alerts--header'>Weather Alerts</h3>
                ${alerts ? _generateWeatherAlert(alerts) : ''}
            </section>                        

            
        </div>
    `;
};

// set UV index level
const _uvIndexRating = function(n) {
    const val = +n;
    let uvIndex;

    switch(true) {
        case val < 3:
            uvIndex = 'low';
            break;
        case (val >= 3 && val < 6):
            uvIndex = 'moderate';
            break;
        case (val >= 6 && val < 8):
            uvIndex = 'high';
            break;
        case (val >= 8 && val < 11):
            uvIndex = 'very high';
            break;
        case (val >= 11):
            uvIndex = 'extreme';
            break;
        default:
            uvIndex = 'n/a';
            break;
    };
    return uvIndex;
};

export const _moveToCurrentWeather = function() {
    _currentWeather.scrollIntoView({behavior: 'smooth'});
}

// build all weather alerts
const _generateWeatherAlert = function(alerts) {
    let alertHTML= ''; 

    alerts.map((alert, i) => {
        alertHTML += `
            <div class='alert__box'>
                <h3 class='alert__heading' data-alert-id=${i}>
                    <button class='alert__heading--link'>${alert.event}</button>
                    

                    <svg class='alert__heading--icon' xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
                </h3>
                <div class='alert__detail'>
                    <p class='alert__detail--time text'><span class='time--heading'>Beginning:</span> ${utility.getHourTime(alert.start)}<span class='time--heading'> | Ending:</span> ${utility.getHourTime(alert.end)}</p>

                    <p class='alert__detail--text text'>${_weatherAlertDescription(alert.description)}</p>
                </div>
            </div>`
    })

    return alertHTML;
};

// returns alert date and time period


// add event listener to each weather alert item, to toggle/expand details, also set item height based on scrollable height (height of text space)
const _weatherAlertToggle = function() {
    const alerts = document.querySelectorAll('.alert__heading');
    alerts.forEach((alert, i) => {
        alert.addEventListener('click', (e) => {
            if(e.target.closest('.alert__heading')) {
                const alertDetail = alert.nextElementSibling;                
                const icon = alert.querySelector('.alert__heading--icon');

                icon.classList.toggle('open');
                alertDetail.classList.toggle('expand');
                // alertDetail.style.display = 'flex';
                alert.classList.toggle('active');

                // sets the detail box height to the height of the content
                if(alertDetail.style.maxHeight) {
                    alertDetail.style.maxHeight = null;
                } else {
                    const scrollableHeight = alertDetail.scrollHeight;
                    alertDetail.style.maxHeight = scrollableHeight + 'px';
                };
            }
            
        });
    });
};

// clean up weather alert description, remove * asterisks
const _weatherAlertDescription =  function(desc) {
    if(!desc) return '';
    return desc.replaceAll('* ', '\n');
}

// rotate the wind direction arrow based on the degrees provided in the weather api call
const _windDirection = function() {
    const windEl = document.querySelector('.details__box--wind-direction');
    windEl.style.transform += `rotate(${windEl.dataset.windDirection}deg) scale(1)`; 
}

// retrieve wind direction based on degree range
const _windCardinalDirection = function(deg) {
    let direction;

    switch(true) {
        case (deg >= 11.25 && deg < 33.75):
            direction = 'NNE';
            break;
        case (deg >= 33.75 && deg < 56.25):
            direction = 'NE';
            break;
        case (deg >= 56.25 && deg < 78.75):
            direction = 'ENE';
            break;
        case (deg >= 78.75 && deg < 101.25):
            direction = 'E';
            break;
        case (deg >= 101.25 && deg < 123.75):
            direction = 'ESE';
            break;
        case (deg >= 123.75 && deg < 146.25):
            direction = 'SE';
            break;
        case (deg >= 146.25 && deg < 168.75):
            direction = 'SSE';
            break;
        case (deg >= 168.75 && deg < 191.25):
            direction = 'S';
            break;
        case (deg >= 191.25 && deg < 213.75):
            direction = 'SSW';
            break;
        case (deg >= 213.75 && deg < 236.25):
            direction = 'SW';
            break;
        case (deg >= 236.25 && deg < 258.75):
            direction = 'WSW';
            break;
        case (deg >= 258.75 && deg < 281.25):
            direction = 'W';
            break;
        case (deg >= 281.25 && deg < 303.75):
            direction = 'WNW';
            break;
        case (deg >= 303.75 && deg < 326.25):
            direction = 'NW';
            break;
        case (deg >= 326.25 && deg < 348.75):
            direction = 'NNW';
            break;
        case (deg >= 348.75 || deg < 11.25):
            direction = 'N';
            break;
            
        default:
            direction = 'n/a';
            break;
    };
    return direction;
}

// create the color temperature bars on the weekly forecast
// delayed start, using the data-low-temp and data-high-temp set the element bar to that percent of the div space
// then set background color based on the temperature as a percent of the color range
const _tempBars = function() {
    setTimeout(() => {
        document.querySelectorAll('.temp-bars--low').forEach(bar => {
            bar.style.width = `${bar.dataset.lowTemp}%`
            bar.style.backgroundColor = `hsl(${Math.abs((bar.dataset.lowTemp / 100) * 300 - 300)}, 80%, 60%)`
        });

        document.querySelectorAll('.temp-bars--high').forEach(bar => {
            bar.style.width = `${bar.dataset.highTemp }%`
            bar.style.backgroundColor = `hsl(${Math.abs((bar.dataset.highTemp / 100) * 300 - 300)}, 80%, 60%)`
        });
    }, 1000);
};

// build the hourly forecast card
const _generateHourly = function(hourly) {
    
    const timeIndex = [1, 4, 7, 10, 13]; // display only these array time indexes (every 3 hours)  
    let hourlyHTML = '';

    // create an array for the hourly indexes that are defined by timeIndex
    // forEach in the new array, build the forecast card
    timeIndex.map((i) => hourly[i])
        .forEach(hour => {
            const hourlyTime = new Date((hour.dt * 1000)).toLocaleTimeString('en-US', {hour: 'numeric'});
            const hourlyTemp = hour.temp.toFixed(0);
            const hourlyIcon = hour.weather[0].icon;

            hourlyHTML += `
                <div class='c-card__content c-card__content--hourly'>
                    <p class='text'>${hourlyTime}</p> 
                    <p class='text text--temp'>${hourlyTemp}°F</p>
                    <img src='https://openweathermap.org/img/wn/${hourlyIcon}@2x.png' class='icon icon--hourly' alt=''>
                </div>`
        })

    return hourlyHTML;
}

// build the weekly/daily forecast card
const _generateWeekly = function(daily) {
    let dailyHTML = '';

    daily.slice(1).forEach((day, i) => {
        const dailyDay = new Date((day.dt * 1000)).toLocaleDateString('en-US', {weekday: 'long'}); // get long day format
        
        // retrieve high/low, precipication %, and icon
        const lowTemps = day.temp.min.toFixed(0);
        const highTemps = day.temp.max.toFixed(0);
        const precip = (day.pop * 100).toFixed(0);
        const icon = day.weather[0].icon

        // for each day, build this weather card and join together
        dailyHTML +=  `
                <div class='c-card__content c-card__content--weekly'>
                    <div class='l-forecast-day l-forecast-day__day'>
                        <img src='https://openweathermap.org/img/wn/${icon}@2x.png' class='icon icon--weekly' alt=''>
                        <p class='text text--weekly l-forecast-day__day--text'>${dailyDay}</p>
                    </div> 
                    <div id='precip' class='l-forecast-day l-forecast-day__precip'>
                        <p class='text text--weekly'>💧 ${precip}%</p>
                    </div>
                    <div class='l-forecast-day l-forecast-day__temperature'>
                        <p class='text text--weekly'>${lowTemps}°F</p>
                        <div class='temp-bars'>
                            <div class='temp-bars temp-bars--low' data-low-temp='${lowTemps}' data-bar='${i}'></div>
                            <div class='temp-bars temp-bars--high' data-high-temp='${highTemps}' data-bar='${i}'></div>
                        </div>
                        <p class='text text--weekly' data-temp=''>${highTemps}°F</p>
                    </div>
                </div>
            `;

    })

    return dailyHTML;

}