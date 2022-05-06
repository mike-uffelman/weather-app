'use strict';

class WeatherView {
    #currentWeather = document.querySelector('#current-weather-box');
    _data;

    // rendering controller for weatherView
    render(data) {
        try {
            
            this._loadStyles(); // render specific stylings - display, opacity, scroll transitions
            this._clear(); // clear
            this._data = data;
            
            const markup = this._generateMarkup(this._data);
            this.#currentWeather.insertAdjacentHTML('afterbegin', markup);
            this._tempBars(); // build color temperature bars
            this._windDirection(); // build wind direction arrow

            if(this._data.at(-1).data.saved === true) {
                document.querySelector('.c-location__save--icon').classList.add('is-saved');
            }
            
            this.#currentWeather.style.display = 'flex';
            this._weatherAlertToggle();

        } catch(err) {
            console.log('error rendering location forecast!!!', err);
            throw err;
        }
        
    }

    _loadStyles() {
        this.#currentWeather.classList.toggle('show');
        this.#currentWeather.style.opacity = 0;
        this.#currentWeather.style.transition = 'opacity ease 500ms';
        this.#currentWeather.scrollIntoView({behavior: 'smooth'})
        this.#currentWeather.style.opacity = 1;
    }

    // dismissMessage() {
    //     const message = document.querySelector('.message');
    //     if(!message) return;
    //     message.style.transform = 'translateY(-8rem)';
    //     message.style.transformOrigin = 'top';
    // }

    renderMessage(message, quality) {
        const markup = `
            <div class='message message__${quality}'>
                <div class='message__header'>
                    <h3 class='message__header--type'>${message === 'err' ? 'err.message' : message}</h3>
                    <p class='message__message'></p>
                </div>    
                <a href='#' class='message__close'><span class='message__close'></span></a>
            </div>
        `

        document.querySelector('.l-main').insertAdjacentHTML('afterbegin', markup);
        
        const messageEl = document.querySelector('.message');
        setTimeout(() => { messageEl.classList.toggle('show') }, 0);

        document.querySelector('.message').addEventListener('click', (e) => {
            console.log(e.target);
            if(e.target.classList.contains('message__close')) {
                document.querySelector('.message').classList.toggle('show');
                // document.querySelector('.message').style.transform = 'translateY(-8rem)';
                // document.querySelector('.message').style.transformOrigin = 'top';
                setTimeout(() => document.querySelector('.message').remove(), 1000);



            }
        })
    }

    // clear the weatherView
    _clear() {
        this.#currentWeather.innerHTML = '';
    }

    // weatherView event handler and subscriber
    addHandlerCurrent(handler) {       
        this.#currentWeather.addEventListener('click', (e) => {

            // save a location event
            if(e.target.closest('.c-cw__location')) {
                document.querySelector('.c-location__save--icon').classList.toggle('is-saved');
                handler(this._data);
            };

            // toggle search view
            if(e.target.closest('.search__link')) {
                console.log('search link clicked');
                document.querySelector('#search').classList.toggle('show');
            }

            // toggle saved view
            if(e.target.closest('.saved__link')) {
                console.log('saved link clicked');
                document.querySelector('#saved').classList.toggle('show');
            }

            // toggle info view
            if(e.target.closest('.info__link')) {
                console.log('info link clicked');
                document.querySelector('.info').classList.toggle('show');
            }

            // link to weather alerts
            if(e.target.classList.contains('details__header--alerts')) {
                document.querySelector('#alerts').scrollIntoView({behavior: 'smooth'});
            }
        });
    }

    // toggle save icon stylings
    toggleSaveIcon(id) {
        const currentId = this._data.at(-1).data.id;
        if(id !== currentId) return;   
        const currentLocationSave = document.querySelector('#saveIcon');
        currentLocationSave.classList.toggle('saved');
    }


    //* view=====================================================================================
    _generateMarkup(location) {
        
        const { alerts, current, daily, hourly } = location.at(-1).data;
        const today = location.at(-1).data.daily.at(-1).temp;

        const todaysDate = new Date(daily[0].dt * 1000)
        const date = todaysDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});

        return `
            
            <div class='l-weather'>
                <section class='l-cw'>
                    <div class='l-cw__container' data-id='${location.at(-1).data.id}'>
                        <section class='c-cw__location'>
                            <header class='c-location'>
                                <h3 id='city-display' class='c-location__header'>
                                    <button class='c-location__header--link'>${location.at(-1).data.name}</button>
                                </h3>
                                <h5 class='c-location__header--sub'>${(!location.at(-1).data.state) ? '' : location.at(-1).data.state + ', '} ${location.at(-1).data.country}</h5>
                                <p class='c-location__date'>${date}</p>
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
                                    
                                    <div class='l-current l-current__extras'>
                                        <div class='l-current__content'>
                                            <div class='l-current__content--icons'>
                                                <svg alt='wind direction and speed' class='details__box--wind-direction' data-wind-direction='${current.wind_deg}' height="25" width="25">
                                                    <polygon points='12.5,5 20,20 12.5,16 5,20'>

                                                </svg>
                                                <p class='text text--extras'>${this._windCardinalDirection(current.wind_deg)}</p>
                                            </div>
                                            <p class='text text--extras'>${current.wind_speed.toFixed(0)} mph</p>
                                        </div>
                                        <div class='l-current__content'>
                                            
                                            <p class='text text--extras'>Precip</p>
                                            <p class='text text--extras'>${(daily[0].pop * 100).toFixed(0)}%</p>
                                        </div>
                                        <div class='l-current__content'>
                                            <p class='text text--extras'>UV Index</p>
                                            <p class='text text--extras'>${this._uvIndexRating(current.uvi)}</p>
                                        </div>
                                        <div class='l-current__content' >
                                                    
                                            <p class='text text--extras'>Humidity</p>
                                            <p class='text text--extras'>${(current.humidity).toFixed(0)}%</p>
                                            
                                        </div>
                                    </div>
                                    
                                    
                                        <img id='icon' src='https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png' data-img-src='https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png' alt='' class='l-current l-current__icon'>
                                        
                                </div>    
                            </section>
                        
                    </div>
                </section>
                
                    
                <section class='forecast'>
                    <div class='c-card c-card--hourly' tabindex=0>
                        <h3 class='c-card__header'>Hourly Forecast</h3>
                        <div class='c-card__detail c-card__detail--hourly' >
                            ${this._generateHourly(hourly)}
                        </div>
                    </div>     
                    <div class='c-card c-card--weekly'>
                        <h3 class='c-card__header'>Weekly Forecast</h3>
                        <div class='c-card__detail c-card__detail--weekly'>
                            ${this._generateWeekly(daily)}
                        </div>
                    </div>  
                </section>
                <section class='c-card c-card__map'>
                    <div id='mapid' class='weather__map' ></div>
                        
                </section>
                <section id='alerts' class='c-card c-card--alert ${alerts ? "alert" : "hide"}'>
                    <h3 class='c-card__header c-card__cw-alerts c-card__cw-alerts--header'>Weather Alerts</h3>
                    ${alerts ? this._generateWeatherAlert(alerts) : ''}
                </section>                        
            
                <section class="nav__large">
                        <h3 class='date'>${date}</h3>
                        <div class='nav__links'> 
                            <a href='#' class='nav__link links info__link'>
                                <svg class='info__link--icon' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/>
                                    <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                </svg>
                            </a>
                            <a href='#' class='nav__link links search__link'>
                                <svg class='search__link--icon' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                                    <path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                </svg>
                            </a>
                            <a href='#' class='nav__link links saved__link'>
                                <svg class='saved__link--icon' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/>
                                    <path d="M15 7v12.97l-4.21-1.81-.79-.34-.79.34L5 19.97V7h10m4-6H8.99C7.89 1 7 1.9 7 3h10c1.1 0 2 .9 2 2v13l2 1V3c0-1.1-.9-2-2-2zm-4 4H5c-1.1 0-2 .9-2 2v16l7-3 7 3V7c0-1.1-.9-2-2-2z"/>
                                </svg>
                            </a>
                        </div>
                </section>
            </div>
        `;
    };

    // <p class='weather-icon--description'>${current.weather[0].description}</p>

    // set UV index level
    _uvIndexRating(n) {
        const val = Number(n);
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

    // build all weather alerts
    _generateWeatherAlert(alerts) {
        let alertHTML= ''; 

        alerts.map((alert, i) => {
            alertHTML += `
                <div class='alert__box'>
                    <h3 class='alert__heading' data-alert-id=${i}>
                        <button class='alert__heading--link'>${alert.event}</button>
                        

                        <svg class='alert__heading--icon' xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 0 24 24" width="36px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
                    </h3>
                    <div class='alert__detail'>
                        <p class='alert__detail--time text'><span class='time--heading'>Beginning:</span> ${this._getHourTime(alert.start)}<span class='time--heading'> | Ending:</span> ${this._getHourTime(alert.end)}</p>

                        <p class='alert__detail--text text'>${this._weatherAlertDescription(alert.description)}</p>
                    </div>
                </div>`
        })

        return alertHTML;
    };

    // returns alert date and time period
    _getHourTime(n) {
        const time = new Date(n * 1000);
        const alertDate = time.toLocaleDateString('en-us', {weekday: 'long'});
        const alertTime = time.toLocaleTimeString('en-us', {hour: 'numeric', hour: '2-digit', minute: '2-digit'});

        return `${alertDate} ${alertTime}`;
    }

    // add event listener to each weather alert item, to toggle/expand details, also set item height based on scrollable height (height of text space)
    _weatherAlertToggle() {
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
    _weatherAlertDescription(desc) {
        if(!desc) return '';
        return desc.replaceAll('* ', '\n');
    }

    // rotate the wind direction arrow based on the degrees provided in the weather api call
    _windDirection() {
        const windEl = document.querySelector('.details__box--wind-direction');
        windEl.style.transform += `rotate(${windEl.dataset.windDirection}deg) scale(1)`; 
    }

    // retrieve wind direction based on degree range
    _windCardinalDirection(deg) {
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
    _tempBars() {
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
    _generateHourly(hourly) {
        
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
    _generateWeekly(daily) {
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
}

export default new WeatherView();