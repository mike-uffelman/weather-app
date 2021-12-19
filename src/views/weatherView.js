class WeatherView {
    #currentWeather = document.querySelector('#current-weather-box');
    

    //TODO ===== instead of conditional firstWeatherCall, we can just completely remove the weather card and recreate it, no need to update the content after building it

    _data;
    #firstWeatherCall = true; //? need 'static', should this be private?
    // constructor() {
    //     this._data = data;
    //     this.#currentWeather.innerHTML = '';
    // }

    render(data) {
        this._clear();

        // this.#currentWeather.innerHTML = '';
        // console.log('RENDERING WEATHER VIEW...........')
        this._data = data;
        console.log(this._data);
        // console.log('store data: ', this._data);
        
        // console.log(`Welcome to ${this._data}`)
        //add a clear() function
        const markup = this._displayCurrent(this._data);
        this.#currentWeather.insertAdjacentHTML('afterbegin', markup);
    }

    _clear() {
        this.#currentWeather.innerHTML = '';
    }

    addHandlerCurrent(handler) {       
        this.#currentWeather.addEventListener('click', (e) => {
            if(e.target.closest('.header')) {
                console.log('clicking add location...')
                // console.log('add location!')
                //add current location to LS
                handler(this._data)
                // storage.addLocation(store.at(-1));
                //add current location search to favorites on UI
                // saved.displayFavorites();
            }
        })
        
        
    }


    //upon receipt of the api data we pass to the displayCurrent() which displays the desired weather data in the browser by creating a new element appending within the DOM
    //in order to prevent duplicate elements from consecutive searches we set a flag variable to firstWeatherCall true so it will add once, else it will simply update the existing html displayed
    //* view=====================================================================================
    _displayCurrent(location) {
        // console.log(location.at(-1));
        // this.#currentWeather.innerHTML = '';
        let weeklyForecastHTML = '';
        let hourlyForecastHTML = '';
        // console.log(location[1].data)
        const { current, daily, hourly } = location[location.length - 1].data
        // console.log(current, daily, hourly, location[location.length - 1].data)

        // console.log(location[location.length - 1].data.name);
        // console.log(location[location.length - 1].data.state);
        // console.log(location[location.length - 1].data.country);



        const timeIndex = [1, 4, 7, 10, 13];      

        timeIndex.map((i) => hourly[i])        
        .forEach(hour => {
            const hourlyTime = new Date((hour.dt * 1000)).toLocaleTimeString('en-US', {hour: 'numeric'});
            const hourlyTemp = hour.temp.toFixed(0);
            const hourlyIcon = hour.weather[0].icon;

            hourlyForecastHTML += `
                <div class='hourly__detail--box'>
                    <div class='hourly__detail--box-time'>${hourlyTime}</div> 
                    <div class='hourly__detail--box-temp'>${hourlyTemp}°F</div>
                    <img src='http://openweathermap.org/img/wn/${hourlyIcon}@2x.png' class='hourly__detail--box-icon'>
                </div>`
        })
      
        daily.slice(1).forEach((day, i) => {
            const dailyDay = new Date((day.dt * 1000)).toLocaleDateString('en-US', {weekday: 'long'});
            const lowTemps = day.temp.min.toFixed(0);
            const highTemps = day.temp.max.toFixed(0);
            const precip = (day.pop * 100).toFixed(0);
            const icon = day.weather[0].icon

            weeklyForecastHTML +=  
                `
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

        

        // if(this.#firstWeatherCall) {
            
            

            let html = 
                `
                    <div class='weatherCard'>
                        

                        <div class='header'>
                            <div class='header__container'>
                                <div class='header__box'>
                                    <div class='header__headers'>
                                        <h3 id='city-display' class='header__heading'>${location.at(-1).data.name}</h3>
                                        <h5 class='header__heading--sub'>${location.at(-1).data.state}, ${location.at(-1).data.country}</h5>
                                    </div>
                                    <svg class='header--add-fav' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path fill-rule="evenodd" d="M11.75 4.5a.75.75 0 01.75.75V11h5.75a.75.75 0 010 1.5H12.5v5.75a.75.75 0 01-1.5 0V12.5H5.25a.75.75 0 010-1.5H11V5.25a.75.75 0 01.75-.75z">
                                        </path>
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
                                    ${hourlyForecastHTML}
                                </div>
                            </div>     
                            <div class='daily'>
                                <h3 class='daily__header'>Weekly Forecast</h3>
                                <div class='daily__detail'>
                                    ${weeklyForecastHTML}
                                </div>
                            </div>  
                        </div>
                        <div class='map'>
                            <div class='weather__map' id='mapid'></div>
                                
                        </div>
                    </div>
                `;
            // const pseudoAfter = document.querySelector('.pseudos', ':after').getComputedStyle()
            // console.log(pseudoAfter)
            // pseudoAfter.style.width = `${val}%`;
            
            this.#currentWeather.insertAdjacentHTML('afterbegin', html);
            this.#currentWeather.firstChild.remove();

            this.#currentWeather.scrollIntoView({behavior: 'smooth'})
            this.#firstWeatherCall = false;
            this.#currentWeather.style.display = 'flex';

            //display temperature bar
            
            

        // } else {

        //     document.querySelectorAll('.daily__detail').forEach(el => el.remove());
        //     document.querySelectorAll('.hourly__detail').forEach(el => el.remove());

        //     document.querySelector('#icon').src = `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;        
        //     document.querySelector('#city-display').innerText = 
        //         `${location.data.name}, ${!location.data.state ? '' : location.data.state}${!location.data.state ? '' : ' '} ${location.data.country === 'US' ? '' : location.data.country}`;
        //     document.querySelector('#temp-display').innerText = `${current.temp.toFixed(0)}°F`;
        //     document.querySelector('#weather-desc').innerText = `${current.weather[0].description}`;
        //     // document.querySelector('#sun-set-rise').innerText = `Sunrise | Sunset `;
        //     // currentWeather.scrollIntoView({behavior: 'smooth'})

        //     document.querySelector('.daily').insertAdjacentHTML('afterbegin', weeklyForecastHTML);
        //     document.querySelector('.hourly').insertAdjacentHTML('afterbegin', hourlyForecastHTML);
            
            

        // }

        setTimeout(() => {
            document.querySelectorAll('.temp__bars--low').forEach(bar => {
                bar.style.width = `${bar.dataset.lowTemp}%`
                bar.style.backgroundColor = `hsl(${Math.abs((bar.dataset.lowTemp / 100) * 240 - 240)}, 80%, 60%)`
            })

            document.querySelectorAll('.temp__bars--high').forEach(bar => {
                bar.style.width = `${bar.dataset.highTemp }%`
                bar.style.backgroundColor = `hsl(${Math.abs((bar.dataset.highTemp / 100) * 240 - 240)}, 80%, 60%)`
            })
        }, 0)
        

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