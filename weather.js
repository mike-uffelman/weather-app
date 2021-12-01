'use strict';

//the Location class is a constructor to build the location object for storage
class Location {
    constructor(data) {
        this.data = data
        this.data.id = Date.now(); //create an easy unique id for favorited locations
    }


}

//windowLoad so the random map loaction is called once upon window laod
let windowLoad = true;
//firstWeatherCall to only build the current weather div once, any searches after only update the existing div
// let firstWeatherCall = true;
//defining a global array called store, to store the current data, basically temp storage a destroyed every window load
const store = [];
let _currentLocation;
//api key for the getweather()
const APIkey = '63c966c95ff05cfed696cec21d7ff716';
/*const callAddress = `https://api.openweathermap.org/data/2.5/weather?q=`;*/

//push key data to array then copy to local storage-------------------------------

class Storage {
    //pushing the current weather location to a temporary array, which will then be pushed to local storage if the user decides is a favorite
    // static storeLocation(place) {
        
    //     const cityObj = new Location(place);
    //     // Storage.addLocation(cityObj);
    //     // const clone = new Object(JSON.parse(JSON.stringify(cityObj)));
    //     // console.log(clone);
    //     store.push(cityObj);
    //     console.log('Store function: ', store);
    //     // _currentLocation = store.at(-1);
    //     // console.log(_currentLocation);
        
        
    // }

    //this is for retrieving locally stored locations to edit storage and for display
    //to use local storage we have three functions - getLocation, addLocation, and removeLocation
    //getLocation() basically retrieves the current data from the localstorage, we define a variable and say if the local storage item we desire is null, then we create an empty array, otherwise(i.e. returns data) we return the parsed data to the variable for access/manipulation

    //TODO change from if else------------------------------------------------------------

    static getLocation() {
        let loc;
        if(localStorage.getItem('loc') === null) {
            loc = [];
        } else {
            loc = JSON.parse(localStorage.getItem('loc'));
        }
        
        return loc;
    }
    //this is to add locations to the local storage
    //here we pass in last index of the temporary store array
    //so we set a variable to retrieve the data from localstorage and push the new data to the end of the LS array
    //then we re-add the variable with the new data back to the LS using setitem and stringify
    static addLocation(location) {

        //create new essentials only object for local storage
        const newLocObj = {
            data: {
                name: location.data.name,
                state: location.data.state,
                country: location.data.country,
                lat: location.data.lat,
                lon: location.data.lon,
                id: location.data.id
            }
            
        }

        let loc = this.getLocation();
        loc.push(newLocObj);
        localStorage.setItem('loc', JSON.stringify(loc));
    }

    //this is to remove locations from the local storage
    //to remove from the local storage we pass in the city id which serves as a unique identifier
    //so we retrieve the current LS data, then iterate through it to find the matching id, when found we splice(delete) the matching index, then put the data back in LS with setitem and stringify
    static removeLocation(id) {
        //retrieve local storage
        let loc = this.getLocation();
        // console.log(loc);
        
        //iterate through LS elements looking for a match by id, then remove the match
        loc.forEach((place, index) => {
            if(place.data.id === id) {
                loc.splice(index, 1)
            }
        })

        //re-set LS with modified object
        localStorage.setItem('loc',JSON.stringify(loc))
    }
}

//api request function---------------------------------------------------

class Request {
    //upon user submitting the form, city is passed into this function to retreive the API data from the server
  
    //we're also taking the sunrise/sunset times and converting them to milliseconds and then to the locale time to display in a readable format and passing those along with the data variable to be displayed in the UI and copied to an array for storage
    //should we receive a failed response our catch(err) will notify and console log the error message

    static _getSunriseSunset(dt, timezone) {
        const timeStr = new Date(dt * 1000).toLocaleTimeString('en-US', {timeZone: `${timezone}`});
    }

    static async getCity(city, ...stateCountry) {
        try {
            if(!city) return;

            const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${stateCountry},${stateCountry}&appid=${APIkey}`)
            const data = await res.json();
            const locHeader = data[0];
            console.log('Location Header:', locHeader);
            console.log(this);
            this.getForecast(locHeader.lat, locHeader.lon);

            //display weather in DOM          
            //? UI.displayCurrent(locHeader, forecastData, sunrise, sunset);        

        } catch(err) {
            console.error('error!', err.message);
        }
    }

    //* model logic ===================================================================
    static async getForecast(lat, lon) {
        try {
            if(!lat || !lon) return;

            const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely&appid=${APIkey}`)
            const data = await res.json();            
            const forecastData = data;
            console.log('Forecast Data:', forecastData);

            const loc = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${forecastData.lat}&lon=${forecastData.lon}&limit=10&appid=${APIkey}`)
            
            const locData = await loc.json()
            const locHeader = locData[0];
            console.log('locHeader: ', locHeader);

            
            MapLocation.buildMap(lat, lon);
            
            const locationObj = {
                ...locHeader,
                ...forecastData
            }
            const location = new Location(locationObj);
            store.push(location);
            console.log('LOCATION:    ', location);

            //display weather in DOM     
            UI.displayCurrent(location);    
            

        } catch(err) {
            console.error('error!', err.message, err.stack);
        }
    }
    //possibility to combine this and the above
    //this runs the weather fetch again with the lat/lon of a favorite city

    
    
    // static async refreshWeather(lon, lat) {
    //     try {
    //         const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lon=${lon}&lat=${lat}&units=imperial&lang=en&appid=${APIkey}`)
    //         console.log(res.data);

    //         const data = await res.json();            

    //         //display weather in DOM          
    //         UI.displayCurrent(data);        
    //     } catch(err) {
    //         console.log('error!', err);
    //     }
    // }


    
}

//display in browser------------------------------------------------------------------------
class UI {
    #currentWeather = document.querySelector('#current-weather-box');
    

    //TODO ===== instead of conditional firstWeatherCall, we can just completely remove the weather card and recreate it, no need to update the content after building it

    #data;
    #firstWeatherCall = true; //? need 'static', should this be private?
    constructor() {
        this.#data = data;
        this.#currentWeather.innerHTML = '';
    }


    //upon receipt of the api data we pass to the displayCurrent() which displays the desired weather data in the browser by creating a new element appending within the DOM
    //in order to prevent duplicate elements from consecutive searches we set a flag variable to firstWeatherCall true so it will add once, else it will simply update the existing html displayed
    //* view=====================================================================================
    static async displayCurrent(location) {
        this.#currentWeather.innerHTML = '';
        let weeklyForecastHTML = '';
        let hourlyForecastHTML = '';
        const { current, daily, hourly } = location.data



        const timeIndex = [1, 4, 7, 10, 13];      

        timeIndex.map((i) => hourly[i])        
        .forEach(hour => {
            const hourlyTime = new Date((hour.dt * 1000)).toLocaleTimeString('en-US', {hour: 'numeric'});
            const hourlyTemp = hour.temp.toFixed(0);
            const hourlyIcon = hour.weather[0].icon;

            hourlyForecastHTML += `
                <div class='hourly__detail'>
                    <div class='hourly__detail--time'>${hourlyTime}</div> 
                    <div class='hourly__detail--temp'>${hourlyTemp}°F</div>
                    <img src='http://openweathermap.org/img/wn/${hourlyIcon}@2x.png' class='hourly__detail--icon'>
                </div>`
        })
      
        daily.slice(1).forEach((day, i) => {
            const dailyDay = new Date((day.dt * 1000)).toLocaleDateString('en-US', {weekday: 'long'});
            const lowTemps = day.temp.min.toFixed(0);
            const highTemps = day.temp.max.toFixed(0);
            const precip = (day.pop * 100).toFixed(0);
            const icon = day.weather[0].icon

            const tempLowVal = lowTemps/100 * 100;
            const tempHighVal = highTemps/100 * 100;

            weeklyForecastHTML +=  `
            <div class='daily__detail'>
                <div class='daily__detail--weekday'>
                    <img src='http://openweathermap.org/img/wn/${icon}@2x.png' class='daily__detail--icon'>
                    <p class='daily__detail--day'>${dailyDay}</p>
                </div> 
                <div id='precip' class='daily__detail--precip'>
                    <p class=''>💧 ${precip}%</p>
                </div>
                <div class='daily__detail--temp'>
                    <p class='detail--temp' ><span class='detail-temp-col low-temps'>${lowTemps}°F</span></p>
                    <div class='temp__bars'>
                        <div class='temp__bars--low' data-low-temp='${lowTemps}' data-bar='${i}'></div>
                        <div class='temp__bars--high' data-high-temp='${highTemps}' data-bar='${i}'></div>
                    </div>
                    <p class='detail--temp' data-temp=''><span class='detail-temp-col high-temps'>${highTemps}°F</p>
                </div>
            </div>`

            
            


            // tempBarsLow.style.width = 
            // tempBarsHigh.style.width = `${tempHighVal}%`;


        })

        

        // if(this.#firstWeatherCall) {
            
            

            let html = `
            
                <div class='weatherCard'>
                    <div class='header'>
                        <div class='header__container'>
                            <div class='header__box'>
                                <h3 id='city-display' class='header__heading'>${location.data.name}, ${!location.data.state ? '' : location.data.state}${!location.data.state ? '' : ', '} ${location.data.country === 'US' ? '' : location.data.country}</h3>
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
                        <h3 class='forecast__header'>Hourly Forecast</h3>
                            <div class='hourly'>
                                ${hourlyForecastHTML}
                            </div>     
                        <h3 class='forecast__header'>Weekly Forecast</h3>
                        <div class='daily'>
                            ${weeklyForecastHTML}
                        </div>  
                    </div>
                    <div class='map'>
                        <div class='map__border'></div>
                        <div class='map__window' id='mapwindow'></div>
                        <div class='map__border'></div>
                    </div>
                </div>
            
            `
            
            // const pseudoAfter = document.querySelector('.pseudos', ':after').getComputedStyle()
            // console.log(pseudoAfter)
            // pseudoAfter.style.width = `${val}%`;
            
            this.#currentWeather.insertAdjacentHTML('afterbegin', html);
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
        
        // document.querySelector('body').addEventListener('click', (e) => {
        //     console.log(e.target);
            
        // })

        //reset input
        //after displaying the data we reset the input field for the next search
        document.querySelector('#city-input').value = '';
        
        //call map function to display map
        //lastly we call on the buildMap() to display the bg img of the city
        // MapLocation.buildMap(data.coord.lat, data.coord.lon);
    }

    //* more like a controller========================================================
    static displayCurrentWeatherBox (e) {
        e.preventDefault();
        const city = form.elements.city.value;
        Request.getCity(city);
        this.#currentWeather.addEventListener('click', this._currentWeatherActions.bind(this));

    }
    //*=================================================================================

    // static displayHelp() {
    //     const banner = document.createElement('div');
    //     banner.style.height = '2rem';
    //     banner.innerText = 'test text';
    //     banner.style.backgroundColor = 'blue';
    //     banner.style.color = 'white';

    //     const main = document.querySelector('main');
    //     main.append(banner);
    // }
   
    //how to display favorites saved to LS
    //this function displays the favorites as stored in the LS
    static displayFavorites() {
        let loc = Storage.getLocation();
        console.log('Local Storage: ', loc)
        if(windowLoad) {
            loc.forEach(place => this.buildFavoriteDivs(place))
        } else {
            this.buildFavoriteDivs(store.at(-1))
        };
    }  

    //this is the function to build a dynamic element to add our selected favorites to be displayed in the browser
    static buildFavoriteDivs(place) {
        const favorites = document.querySelector('#favorites');    
        //TODO --- change to insertAdjacentHTML---------------------------------------
            const div = document.createElement('div');
            div.classList.add('favorites__card');          
                div.innerHTML = `
                    
                        <div class='favorites__card--detail'>
                            <h2 id='city-favorite' class='favorites__card--detail-header '>
                                <a href='#current-weather-box' class='call-favorite'>${place.data.name}, ${!place.data.state ? '' : place.data.state}${!place.data.state ? '' : ', '} ${place.data.country}</a>
                                <p class='favorites__card--locationID'>${place.data.id}</p>
                            </h2> 
                            <a href='#' class='favorite__card--remove-favorite remove-favorite'>
                                <svg class='remove-fav' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                    <path fill-rule="evenodd" d="M4.5 12.75a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75z"></path>
                                </svg>

                            </a>           
                            <p class='favorites__card--locationID'>${place.data.id}</p>

                        </div>
                    
                    
                `;
            favorites.insertAdjacentElement('beforeend', div);
    }      
    
    //remove UI favorite item, e is defined in the calling event
    static removeFavoriteUI(e) {
        e.remove();
    }
    
}

                        // <div class='favorites__card--img'>
                        //     <img id='icon' src='https://picsum.photos/100/100' class='img'>
                        // </div>


// map functions ---------------------------------------------------------------------------
class MapLocation {
    
    

    //buildMap fixes the map re-render issue
    //to rerender the map we add select the required leaflet div and set the inner html again
    //then we use the leaflet syntax to create a new map and pass in the current lat/lon and zoom parameters, we also have to include attribution for the tiler host which provides the actual map
    //flyto just gives the map a zooming animation
    //the osm items are for the tiler, which require a tiler address and attribution to add to the map, then we add the layer to the map
    //also need to add css for the #map and #mapid ids -> the height, width, position

    static buildMap(lat, lon, zoom = 9) {     
        const mapid = document.querySelector('#mapid');
        mapid.innerHTML = "<div id='map'></div>";

        
        // mapid.style.transition = 'opacity ease 1000ms'
        mapid.style.opacity = 0;

        // const cardBody = document.createElement('div');
        

        //these map. add ons can be chained, but shown as is for clarity
        
        
         
        

        //for the tiler
        let osmURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        let osmAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        let osmLayer = new L.tileLayer(osmURL, {attribution: osmAttribution,}
        );

        
            

        let myDivIcon = L.divIcon({
            className: 'map-marker',
            html: `
                <div class='map-marker'>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketchjs="https://sketch.io/dtd/" version="1.1" sketchjs:metadata="eyJuYW1lIjoiRHJhd2luZy00LnNrZXRjaHBhZCIsInN1cmZhY2UiOnsibWV0aG9kIjoiZmlsbCIsImJsZW5kIjoibm9ybWFsIiwiZW5hYmxlZCI6dHJ1ZSwib3BhY2l0eSI6MSwidHlwZSI6InBhdHRlcm4iLCJwYXR0ZXJuIjp7InR5cGUiOiJwYXR0ZXJuIiwicmVmbGVjdCI6Im5vLXJlZmxlY3QiLCJyZXBlYXQiOiJyZXBlYXQiLCJzbW9vdGhpbmciOmZhbHNlLCJzcmMiOiJ0cmFuc3BhcmVudExpZ2h0Iiwic3giOjEsInN5IjoxLCJ4MCI6MC41LCJ4MSI6MSwieTAiOjAuNSwieTEiOjF9fSwiY2xpcFBhdGgiOnsiZW5hYmxlZCI6dHJ1ZSwic3R5bGUiOnsic3Ryb2tlU3R5bGUiOiJibGFjayIsImxpbmVXaWR0aCI6MX19LCJkZXNjcmlwdGlvbiI6Ik1hZGUgd2l0aCBTa2V0Y2hwYWQiLCJtZXRhZGF0YSI6e30sImV4cG9ydERQSSI6NzIsImV4cG9ydEZvcm1hdCI6InBuZyIsImV4cG9ydFF1YWxpdHkiOjAuOTUsInVuaXRzIjoicHgiLCJ3aWR0aCI6MTAwLCJoZWlnaHQiOjEwMCwicGFnZXMiOlt7IndpZHRoIjoxMDAsImhlaWdodCI6MTAwfV0sInV1aWQiOiI3MmI5NmI0Ny04YTczLTQ5YzgtYjQ5MS1mYjZmNjg3YmUxYzAifQ==" width="100" height="100" viewBox="0 0 100 100" sketchjs:version="2021.4.25.11">
                        <path sketchjs:tool="circle" style="fill: #f3228a; stroke: #000000; mix-blend-mode: source-over; paint-order: stroke fill markers; fill-opacity: 1; stroke-dasharray: none; stroke-dashoffset: 0; stroke-linecap: round; stroke-linejoin: miter; stroke-miterlimit: 4; stroke-opacity: 1; stroke-width: 4.9; vector-effect: non-scaling-stroke;" d="M49.99 0 C77.6 0 99.99 22.38 99.99 49.99 99.99 77.6 77.6 99.99 49.99 99.99 22.38 99.99 0 77.6 0 49.99 0 22.38 22.38 0 49.99 0 z" transform="matrix(0.9224924209125952,0.00010432257487092809,-0.00010432257487092809,0.9224924209125952,4,3)"/>
                    </svg>
                </div>`,
            iconSize: [5, 5],
            iconAnchor: [50, 50]
            

        })

        // let myicon = L.icon({
        //     iconUrl: `./public/images/dot1.svg`,
        //     iconSize: [12.5, 12.5],
        //     iconAnchor: [50, 50]
        // })


        

        const layerName = 'precipitation_new'
        const weatherUrl = `https://tile.openweathermap.org/map/${layerName}/{z}/{x}/{y}.png?appid=63c966c95ff05cfed696cec21d7ff716`

        let weatherLayer = new L.tileLayer(weatherUrl)


        let map = new L.Map('map', {
            zoomControl: true,
            // layers: [osmLayer, weatherLayer] //add back for weather layer 
            layers: [osmLayer]

        });

        map.addLayer(osmLayer)
        // .addLayer(weatherLayer);
        //* ^ add back for production

        const bounds = L.bounds([lat, lon]).getCenter()
        console.log('bounds: ', bounds)
        //     .bindPopup(L.popup({
        //         maxWidth: 250,
        //         minWidth: 100,
        //         autoClose: false,
        //         closeOnClick: true, 
        //         className: ''  //define a class to style the popup
        // }))
        // .setPopupContent(`this is a popup`)
        // .openPopup();    
        
        map.setView(new L.LatLng(lat, lon), 6)
        map.flyTo(new L.LatLng(lat, lon), 9) 
        setTimeout(()=> {
            map.panBy([0, 125], {duration: 1})
            
        }, 1000)

        L.marker([lat, lon], {icon: myDivIcon})
            .addTo(map)
        

        setTimeout(() => {
            console.log('map loaded')
            mapid.style.opacity = 1;
            mapid.style.transition = 'opacity ease 2000ms'

        },2000)    


    }


}

//event listeners----------------------------------------------------------------------
//user enters a city name (specifies with state and/or country, if desired/necessary)
//prevent default browser action (not posting anything)
//pass the city name to getWeather();
// document.querySelector('form').addEventListener('submit', (e) => {
//     e.preventDefault();
//     const city = document.querySelector('form').elements.city.value;
//     Request.getWeather(city);
//     document.querySelector('#current-weather-box').classList.remove('d-none');
//     document.querySelector('#current-weather-box').classList.add('d-flex');
//     //document.querySelector('form').classList.remove('top-50', 'start-50', 'flex-column');
//     //document.querySelector('form').classList.add('bottom-25', 'start-0', 'flex-row');

// })

//event on click of plus sign to add location to LS
//in the current weather section - when the user clicks the plus sign to add a favorite we call the addLocation() and pass in the last index of the temporary storage array called store
// document.querySelector('#current-weather-box').addEventListener('click', (e) => {
//     if(e.target.classList.contains('add-favorite') && e.target.nodeName === 'A') {
        


//remove favorite event - should call to local storage and a UI remove
//in the favorites section - when a user clicks the minus(-) svg we trace the click up to the element and pass the e.target into the removeFavoriteUI() function to remove it from the UI, then we find the cityID visibly hidden in the div and pass that city ID into the removeLocation() function that iterates through the LS object to find the matching index item and removes it


const form = document.querySelector('form');
const favorites = document.querySelector('#favorites');
const map = document.querySelector('#mapid');
const locID = document.querySelector('.favorites__card--locationID');

class App {
    #mapEvent;
    #currentLocation;
    
    constructor() {
        console.log('Store: ', store);
        // get and map current location on page load or random location
        this._getGeolocation();

        // manually delete local storage index
        // function storageDeleteItem(locIndexStart) {
        //     const loc = JSON.parse(localStorage.getItem('loc'));
        //     console.log('LOCAL STORAGE; ', loc);
        //     loc.splice(locIndexStart, 3);
        //     localStorage.setItem('loc',JSON.stringify(loc))
        // }
        
        // storageDeleteItem(0);

        //render saved favorite locations
        UI.displayFavorites(); 
        // set windowLoad flag to false
        windowLoad = false;
    
        //search form event listener
        form.addEventListener('submit', UI. displayCurrentWeatherBox.bind(this));

        // currentWeather event listener for add to favorites

        // favorite location event listener to remove or select location to get weather again
        favorites.addEventListener('click', this._favoritesActions.bind(this));
        

        


    }

   

    //* navigator API - get current location or random location if block location
    _getGeolocation() {
        try{
            if(navigator.geolocation) {
                this._getPosition()
            }
            if (!navigator.geolocation) {
                console.log('geolocation failure...')
                this._randomCoords();
            }


        } catch(err) {
            console.error(err);
        }
    }

    _getPosition() {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log('Navigator Geolocation: ', position)
            const { latitude: lat, longitude: lon } = position.coords;
            MapLocation.buildMap(lat, lon, 9);
            Request.getForecast(lat, lon);
        }, () => {
            this._randomCoords();    
        });
    }

    _randomCoords() {
        const lat = Math.random() * (90 - (-90)) + (-90);
        const lon = Math.random() * (180 - (-180)) + (-180);
        MapLocation.buildMap(lat, lon, 4);
    }
    

    //TODO||||||||||||||||| fix add favorite on click - class change
    _currentWeatherActions(e) {
        if(e.target.closest('.header')) {
            console.log('add location!')
            //add current location to LS
           
            Storage.addLocation(store.at(-1));
            //add current location search to favorites on UI
            UI.displayFavorites();
        }
    }

    _favoritesActions (e) {
        //! targets may change after layour redesign------------------------
        if(e.target.classList.contains('remove-fav')) {
            UI.removeFavoriteUI(e.target.closest('.favorites__card'));
            let id = Number(e.target.parentElement.nextSibling.nextSibling.innerText);
            Storage.removeLocation(id);
        }
    
        //if the e.target is the city name we use the cityID again to iterate through the LS to find the lat/lon to re-load the favorite as the current weather    
        if(e.target.classList.contains('call-favorite')) {

            console.log('get this favorite location weather');

            let loc = Storage.getLocation();
            let eid = Number(e.target.nextElementSibling.innerText);
            console.log(eid);
            // currentWeather.scrollIntoView({behavior: 'smooth'})

            loc.forEach(function(place) {
                if(place.data.id === eid) {
            //         // console.log(place.data.coord.lon, place.data.coord.lat)
                    Request.getForecast(place.data.lat, place.data.lon)
                }
            })            
        }
    }
   
}


const app = new App();



