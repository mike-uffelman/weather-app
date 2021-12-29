class WeatherView {
    #currentWeather = document.querySelector('#current-weather-box');
    

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
        if(this._data.at(-1).data.bookmarked === true) {
            document.querySelector('.header--add-fav').classList.add('bookmarked');
        }
        
        // this.#currentWeather.style.opacity = 1;
        // this.#currentWeather.style.transition = 'all ease 300ms';
        // this.#firstWeatherCall = false;
        this.#currentWeather.style.display = 'flex';

    }

    _clear() {
        this.#currentWeather.innerHTML = '';
    }

    addHandlerCurrent(handler) {       
        this.#currentWeather.addEventListener('click', (e) => {
            if(e.target.closest('.header__container')) {
                console.log(e.target)
                // console.log('clicking add location...');
                // console.log('add location!')
                //add current location to LS
                // this._data.at(-1).bookmarked = true;
                document.querySelector('.header--add-fav').classList.toggle('bookmarked');
                handler(this._data);
                // storage.addLocation(store.at(-1));
                //add current location search to favorites on UI
                // saved.displayFavorites();
            };
        });
        
        
    };


    //upon receipt of the api data we pass to the displayCurrent() which displays the desired weather data in the browser by creating a new element appending within the DOM
    //in order to prevent duplicate elements from consecutive searches we set a flag variable to firstWeatherCall true so it will add once, else it will simply update the existing html displayed
    //* view=====================================================================================
    _generateMarkup(location) {
        const { current, daily, hourly } = location.at(-1).data;

            return `
                <div class='weatherCard'>
                        <div class='header'>
                            <div class='header__container'>
                                <div class='header__box' data-id='${location.at(-1).data.id}'>
                                    <div class='header__headers'>
                                        <h3 id='city-display' class='header__heading'>${location.at(-1).data.name}</h3>
                                        <h5 class='header__heading--sub'>${(!location.at(-1).data.state) ? '' : location.at(-1).data.state + ', '} ${location.at(-1).data.country}</h5>
                                    </div>
                                    <svg class='header--add-fav' height="50" width="50">
                                        <polygon points='6,2 42,2 42,48 24,32 6,48'>

                                    </svg>
                                    
                                </div>
                                
                                
                                <div class='header__icon'>
                                    <img id='icon' src='http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png' class='header__icon--img'>
                                    <p id='temp-display' class='header__details'>${current.temp.toFixed(0)}° F
                                    </p>

                                    <p  class='header__icon--description'><span id='weather-desc'>${current.weather[0].description}</span></p>
                                </div>
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
                    </div>`;

    };

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
                    <img src='http://openweathermap.org/img/wn/${hourlyIcon}@2x.png' class='hourly__detail--box-icon'>
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
                            <img src='http://openweathermap.org/img/wn/${icon}@2x.png' class='daily__detail--box-icon'>
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