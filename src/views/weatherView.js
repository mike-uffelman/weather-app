class WeatherView {
    #currentWeather = document.querySelector('#current-weather-box');
    #alerts;

    //TODO ===== instead of conditional firstWeatherCall, we can just completely remove the weather card and recreate it, no need to update the content after building it

    _data;
    // #firstWeatherCall = true; //? need 'static', should this be private?
    // constructor() {
    //     this._data = data;
    //     this.#currentWeather.innerHTML = '';
    // }

    removeEl() {
        

    }

    render(data) {
        this.#currentWeather.style.opacity = 0;
        this.#currentWeather.style.transition = 'opacity ease 500ms';
        this.#currentWeather.scrollIntoView({behavior: 'smooth'})
        this._clear();

        
        // this.#currentWeather.innerHTML = '';
        // console.log('RENDERING WEATHER VIEW...........')
        this._data = data;
        console.log(this._data);
        // console.log('store data: ', this._data);
        
        // console.log(`Welcome to ${this._data}`)
        //add a clear() function
        this.#currentWeather.style.opacity = 1;
        

        const markup = this._generateMarkup(this._data);
        this.#currentWeather.insertAdjacentHTML('afterbegin', markup);
        this._tempBars();
        this._windDirection();
        if(this._data.at(-1).data.bookmarked === true) {
            document.querySelector('.location__bookmark--icon').classList.add('bookmarked');
        }


        
        // this.#currentWeather.style.opacity = 1;
        // this.#currentWeather.style.transition = 'all ease 300ms';
        // this.#firstWeatherCall = false;
        this.#currentWeather.style.display = 'flex';
        this._alertMessageToggle();
    }

    _clear() {
        this.#currentWeather.innerHTML = '';
    }

    addHandlerCurrent(handler) {       
        this.#currentWeather.addEventListener('click', (e) => {
            if(e.target.closest('.cw__box--location')) {
                console.log(e.target)
                document.querySelector('.location__bookmark--icon').classList.toggle('bookmarked');
                handler(this._data);
            };

            if(e.target.classList.contains('search__link--icon')) {
                console.log('search link clicked');
                document.querySelector('.search__modal').classList.toggle('show');
            }
            if(e.target.classList.contains('saved__link--icon')) {
                console.log('saved link clicked');
                document.querySelector('.saved').classList.toggle('show');
                
            }
            if(e.target.classList.contains('alerts')) {
                console.log(e.target);
                document.querySelector('#alerts').scrollIntoView({behavior: 'smooth'})

            }
        });
        
        
        // const alertBox = document.querySelectorAll('.hourly__detail')
        // // console.log(alertBox);

        // alertBox?.addEventListener('click', (e) => {
                
        // })
    // };

    

    //     otherEventHandlers() {
    //         console.log(document.querySelectorAll('.alert-heading').innerText)
        
    }

    

    toggleBookmarkIcon() {
        document.querySelector('.location__bookmark-icon').classList.toggle('bookmarked');
    }


    //upon receipt of the api data we pass to the displayCurrent() which displays the desired weather data in the browser by creating a new element appending within the DOM
    //in order to prevent duplicate elements from consecutive searches we set a flag variable to firstWeatherCall true so it will add once, else it will simply update the existing html displayed
    //* view=====================================================================================
    _generateMarkup(location) {
        
        const { alerts, current, daily, hourly } = location.at(-1).data;
        const today = location.at(-1).data.daily.at(-1).temp;
        console.log(today);

        const todaysDate = new Date(daily[0].dt * 1000)
        const date = todaysDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
        



            return `
                
                <div class='weatherCard'>
                    <div class='cw'>
                        <div class='cw__box' data-id='${location.at(-1).data.id}'>
                            <div class='cw__box--location'>
                                <div class='location'>
                                    <h3 id='city-display' class='location__header'><a href='#' class='location__header--link'>${location.at(-1).data.name}</a></h3>
                                    <h5 class='location__header--sub'>${(!location.at(-1).data.state) ? '' : location.at(-1).data.state + ', '} ${location.at(-1).data.country}</h5>
                                    <p class='location__date'>${date}</p>
                                </div>
                                <svg class='location__bookmark--icon' height="50" width="50">
                                    <polygon points='6,2 42,2 42,48 24,32 6,48'>
                                </svg>
                            </div>

                            <div class='cw__box--details'>
                                <div class='details'>
                                    <div class='details__header'>
                                        <h3 class='details__header--heading'>Right Now</h3>
                                        <a href='#' class='details__header--alerts ${alerts ? "" : "hide"}' data-alerts=${alerts?.length}>Weather Advisory</a>
                                    </div>
                                    <div class='details__box'>
                                        <p class='details__box--feels-like'>${current.weather[0].description}, feels like ${current.feels_like.toFixed(0)}° F
                                        <p class='details__box--temp'>${current.temp.toFixed(0)}° F
                                        </p>
                                        <div class='details__box--wind'>
                                            <svg class='details__box--wind-direction' data-wind-direction='${current.wind_deg}' height="25" width="25">
                                                <polygon points='12.5,5 20,20 12.5,16 5,20'>

                                            </svg>

                                            <p class='detail__box--wind-speed'>${current.wind_speed.toFixed(0)} mph</p>
                                        </div>
                                        <div class='details__box--averages'>
                                            <p class='temp'>Today ${today.day.toFixed(0)}°F </p>
                                            <p class='temp'>Tonight ${today.night.toFixed(0)}°F</p>
                                        

                                        </div>
                                        <div class='weather-icon'>
                                            <img id='icon' src='https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png' alt='' class='weather-icon--img'>
                                            
                                        </div>
                                    </div>    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="nav__large">
                        <p class='header__details--date date'>${date}</p>
                        <div class='nav__links'> 
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
                    </div>
                        
                    <div class='forecast'>
                        <div class='hourly'>
                            <h3 class='hourly__header'>Hourly Forecast</h3>
                            <div class='hourly__detail'>
                                ${this._generateHourly(hourly)}
                            </div>
                        </div>     
                        <div class='daily'>
                            <h3 class='daily__header'>Weekly Forecast</h3>
                            <div class='daily__detail'>
                                ${this._generateWeekly(daily)}
                            </div>
                        </div>  
                    </div>
                    <div class='map'>
                        <div class='weather__map' id='mapid'></div>
                            
                    </div>
                    <div id='alerts' class='${alerts ? "alert" : "hide"}'>
                        <h3 class='alert__header'>Weather Alerts</h3>
                        ${alerts ? this._generateWeatherAlert(alerts) : ''}
                    </div>                        
                </div>`;
    };

    // <p class='weather-icon--description'>${current.weather[0].description}</p>


    _generateWeatherAlert(alerts) {
        let alertHTML= ''; 
        
        alerts.map((alert, i) => {

            alertHTML += `
                <div class='alert__box'>
                    <h3 class='alert__heading' data-alert-id=${i}>
                        <a href='#alerts' class='alert__heading--link'>${alert.event}</a>
                        <svg height='25' width='25' class='alert__heading--icon'>
                    <polyline  points='4,5 12.5,20 21,5 20,5 12.5,18 5,5'>

                </svg>
                    </h3>
                    <div class='alert__detail'>
                        <p class='alert__detail--time'>Beginning: ${this._getHourTime(alert.start)}</p>
                        <p class='alert__detail--time'>Ending: ${this._getHourTime(alert.end)}</p>

                        <p class='alert__detail--text'>${this._alertDescription(alert.description)}</p>
                    </div>
                </div>`
        })

        // this.#alerts =  document.querySelector('#alerts');

        // this.#alerts.addEventListener('click', (e) => {
        //     if(e.target.closest('.alert__heading')) {
        //         console.log(e.target);
                
        //     }
        // })
        // this.#alerts?.addEventListener('click', this._alertMessageToggle.bind(this))
        return alertHTML;
    };


    _getHourTime(n) {
        const time = new Date(n * 1000);
        const alertDate = time.toLocaleDateString('en-us', {weekday: 'long'});
        const alertTime = time.toLocaleTimeString('en-us', {hour: 'numeric', hour: '2-digit', minute: '2-digit'});

        return `${alertDate} ${alertTime}`;
    }


    _alertMessageToggle(e) {
        console.log(e);
        const alerts = document.querySelectorAll('.alert__heading');

        alerts.forEach((alert, i) => {
            alert.addEventListener('click', (e) => {
                const alertDetail = alert.nextElementSibling
                alertDetail.classList.toggle('expand');
                if(alertDetail.style.maxHeight) {
                    alertDetail.style.maxHeight = null;
                } else {
                    alertDetail.style.maxHeight = alertDetail.scrollHeight + 'px';
                }

                console.log(alertDetail);
                console.log('clicked alert!', e);
            })
        })

        // console.log(alerts);
        // if(e.target.classList.contains('alert__heading--link') || e.target.className === 'alert__heading') {
        //     const deets = e.target.closest('.alert__heading').nextElementSibling;
        //     console.log(deets);
        //     deets.classList.toggle('expand');

        // }
        // const details = document.querySelector('.alert__detail');
        // this.classList.toggle('expand');
    }

    _alertDescription(desc) {
        if(!desc) return '';
        let alertDesc = '';
        return desc.replaceAll('* ', '\n');
        // console.log(lines);

        // lines.map(line => console.log(`${line}\n`))

    }

    _windDirection() {
        const windEl = document.querySelector('.details__box--wind-direction');
        windEl.style.transform += `rotate(${windEl.dataset.windDirection}deg) scale(1)`; 
        
    }

    _tempBars() {
        setTimeout(() => {
            document.querySelectorAll('.temp__bars--low').forEach(bar => {
                bar.style.width = `${bar.dataset.lowTemp}%`
                bar.style.backgroundColor = `hsl(${Math.abs((bar.dataset.lowTemp / 100) * 240 - 240)}, 80%, 60%)`
            });

            document.querySelectorAll('.temp__bars--high').forEach(bar => {
                bar.style.width = `${bar.dataset.highTemp }%`
                bar.style.backgroundColor = `hsl(${Math.abs((bar.dataset.highTemp / 100) * 240 - 240)}, 80%, 60%)`
            });
        }, 0);
    };

    _generateHourly(hourly) {
        
        const timeIndex = [1, 4, 7, 10, 13];      
        let hourlyHTML = '';
        timeIndex.map((i) => hourly[i])        
        .forEach(hour => {
            const hourlyTime = new Date((hour.dt * 1000)).toLocaleTimeString('en-US', {hour: 'numeric'});
            const hourlyTemp = hour.temp.toFixed(0);
            const hourlyIcon = hour.weather[0].icon;

             hourlyHTML += `
                <div class='hourly__detail--box'>
                    <div class='hourly__detail--box-time'>${hourlyTime}</div> 
                    <div class='hourly__detail--box-temp'>${hourlyTemp}°F</div>
                    <img src='https://openweathermap.org/img/wn/${hourlyIcon}@2x.png' class='hourly__detail--box-icon' alt=''>
                </div>`
        })

        return hourlyHTML;
    }

    _generateWeekly(daily) {
        let dailyHTML = '';

        daily.slice(1).forEach((day, i) => {
            const dailyDay = new Date((day.dt * 1000)).toLocaleDateString('en-US', {weekday: 'long'});
            const lowTemps = day.temp.min.toFixed(0);
            const highTemps = day.temp.max.toFixed(0);
            const precip = (day.pop * 100).toFixed(0);
            const icon = day.weather[0].icon

            dailyHTML +=  `
                    <div class='daily__detail--box'>
                        <div class='daily__detail--box-weekday'>
                            <img src='https://openweathermap.org/img/wn/${icon}@2x.png' class='daily__detail--box-icon' alt=''>
                            <p class='daily__detail--box-day'>${dailyDay}</p>
                        </div> 
                        <div id='precip' class='daily__detail--box-precip'>
                            <p class=''>💧 <span class='text'>${precip}%</span></p>
                        </div>
                        <div class='daily__detail--box-temp'>
                            <p class='detail--temp' ><span class='detail-temp-col low-temps'>${lowTemps}°F</span></p>
                            <div class='temp__bars'>
                                <div class='temp__bars--low' data-low-temp='${lowTemps}' data-bar='${i}'></div>
                                <div class='temp__bars--high' data-high-temp='${highTemps}' data-bar='${i}'></div>
                            </div>
                            <p class='detail--temp' data-temp=''><span class='detail-temp-col high-temps'>${highTemps}°F</p>
                        </div>
                    </div>
                `;

        })
        return dailyHTML;

    }

    // static displayHelp() {
    //     const banner = document.createElement('div');
    //     banner.style.height = '2rem';
    //     banner.innerText = 'test text';
    //     banner.style.backgroundColor = 'blue';
    //     banner.style.color = 'white';

    //     const main = document.querySelector('main');
    //     main.append(banner);
    // }
   
    
    
    
}

export default new WeatherView();