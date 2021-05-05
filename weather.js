
//the Location class is a constructor to build the location object for storage
class Location {
    constructor(data) {
        this.data = data
    }
}

//windowLoad so the random map loaction is called once upon window laod
let windowLoad = true;
//firstWeatherCall to only build the current weather div once, any searches after only update the existing div
let firstWeatherCall = true;
//defining a global array called store, to store the current data, basically temp storage a destroyed every window load
const store = [];
//api key for the getweather()
const APIkey = '63c966c95ff05cfed696cec21d7ff716';
/*const callAddress = `https://api.openweathermap.org/data/2.5/weather?q=`;*/

//push key data to array then copy to local storage-------------------------------

class Storage {

    //pushing the current weather location to a temporary array, which will then be pushed to local storage if the user decides is a favorite
    static storeLocation(place) {
        
        const cityObj = new Location(place);
        // Storage.addLocation(cityObj);
        // const clone = new Object(JSON.parse(JSON.stringify(cityObj)));
        // console.log(clone);
        store.push(cityObj);
        console.log(store);
        
        
    }

    //this is for retrieving locally stored locations to edit storage and for display
    //to use local storage we have three functions - getLocation, addLocation, and removeLocation
    //getLocation() basically retrieves the current data from the localstorage, we define a variable and say if the local storage item we desire is null, then we create an empty array, otherwise(i.e. returns data) we return the parsed data to the variable for access/manipulation
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
        let loc = Storage.getLocation();
        loc.push(location);
        localStorage.setItem('loc', JSON.stringify(loc));
    }

    //this is to remove locations from the local storage
    //to remove from the local storage we pass in the city id which serves as a unique identifier
    //so we retrieve the current LS data, then iterate through it to find the matching id, when found we splice(delete) the matching index, then put the data back in LS with setitem and stringify
    static removeLocation(id) {
        //retrieve local storage
        let loc = Storage.getLocation();
        console.log(loc);
        
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
    //we're using axios here which simplifies in that we don't need to specifically pass the response to .json() to make it usable on our end, we set the response to a variable so we can pass it on throughout the app
    //we're also taking the sunrise/sunset times and converting them to milliseconds and then to the locale time to display in a readable format and passing those along with the data variable to be displayed in the UI and copied to an array for storage
    //should we receive a failed response our catch(err) will notify and console log the error message
    static async getWeather(city) {
        try {
            const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&lang=en&appid=${APIkey}`)
            console.log(res.data);
            const data = res.data;
            
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
            
            //display weather in DOM          
            UI.displayCurrent(data, sunrise, sunset);        

            //add to storage call
            //this call passes data into the temporary array storage
            Storage.storeLocation(data);

            // const cityObj = new Location(data);
            // Storage.addLocation(data);
            return data;
        }
        
        catch(err) {
            console.log('error!', err);
        }
    }
    //possibility to combine this and the above
    //this runs the weather fetch again with the lat/lon of a favorite city
    static async refreshWeather(lon, lat) {
        try {
            const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lon=${lon}&lat=${lat}&units=imperial&lang=en&appid=${APIkey}`)
            console.log(res.data);
            const data = res.data;
            
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
            
            //display weather in DOM          
            UI.displayCurrent(data, sunrise, sunset);        
        }
        
        catch(err) {
            console.log('error!', err);
        }
    }
    
}

//display in browser------------------------------------------------------------------------
class UI {
    //upon receipt of the api data we pass to the displayCurrent() which displays the desired weather data in the browser by creating a new element appending within the DOM
    //in order to prevent duplicate elements from consecutive searches we set a flag variable to firstWeatherCall true so it will add once, else it will simply update the existing html displayed
    
    static displayCurrent(data, sunrise, sunset) {
        if(firstWeatherCall === true) {
            const section = document.querySelector('#current-weather-box');
            const div = document.createElement('div');
            div.classList.add('card', 'rounded', 'bg-light');
            div.innerHTML = `
                <div class='row g-0 rounded'>
                    <div class='col-2 d-flex flex-column justify-content-center bg-secondary'>
                        <img id='icon' src='http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png' class='img'>
                        
                    </div>
                    <div class='col-10'>
                        <div class='d-flex flex-column card-body text-muted p-1 '>
                            <div class='d-flex flex-row justify-content-between'>
                                <h3 id='city-display' class='card-title city-display m-0'>${data.name}, ${data.sys.country}</h3>
                                <a href='#' class='justify-self-end add-favorite text-decoration-none'>
                                    <svg class='align-self-end' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="M11.75 4.5a.75.75 0 01.75.75V11h5.75a.75.75 0 010 1.5H12.5v5.75a.75.75 0 01-1.5 0V12.5H5.25a.75.75 0 010-1.5H11V5.25a.75.75 0 01.75-.75z"></path></svg>
                                </a>
                            </div>
                            <p id='temp-display'class='card-text my-0'>${data.main.temp}° F, feels like ${data.main.feels_like}° F</p>
                            <p id='weather-desc' class='card-text my-0'>${data.weather[0].description}</p>
                            <p id='sun-set-rise' class='card-text my-0'>Sunrise ${sunrise} | Sunset ${sunset}</p>
                            <p id='city-ID' class='d-none'>${data.id}</p>
                        </div>
                    </div>
                </div>
            `
            section.append(div);
            firstWeatherCall = false;
        } else {
            document.querySelector('#icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;        
            document.querySelector('#city-display').innerText = `${data.name}, ${data.sys.country}`;
            document.querySelector('#temp-display').innerText = `${data.main.temp}° F, feels like ${data.main.feels_like}° F`;
            document.querySelector('#weather-desc').innerText = `${data.weather[0].description}`;
            document.querySelector('#sun-set-rise').innerText = `Sunrise ${sunrise} | Sunset ${sunset}`;
            document.querySelector('#city-ID').innerTest = `${data.id}`;
        }


        //reset input
        //after displaying the data we reset the input field for the next search
        document.querySelector('#city-input').value = '';
        
        //call map function to display map
        //lastly we call on the buildMap() to display the bg img of the city
        MapLocation.buildMap(data.coord.lat, data.coord.lon);
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
   
    //how to display favorites saved to LS
    //this function displays the favorites as stored in the LS
    static displayFavorites() {
        let loc = Storage.getLocation();
        
        if(windowLoad) {
            loc.forEach(place => UI.buildFavoriteDivs(place))
        } else {
            UI.buildFavoriteDivs(store[store.length-1])
        };
        
        
                    
    }  

    //this is the function to build a dynamic element to add our selected favorites to be displayed in the browser
    static buildFavoriteDivs(place) {
        const history = document.querySelector('#history');    
            
            const div = document.createElement('div');
            div.classList.add('card', 'rounded', 'bg-light', 'my-1','mx-3');          
                div.innerHTML = `
                    <div class='row g-0 rounded'>
                        <div class='col-2 d-flex flex-column justify-content-center bg-secondary'>
                            <img id='icon' src='https://picsum.photos/100/100' class='img'>
                        </div>
                        <div class='col-10'>
                            <div class='d-flex flex-row justify-content-between card-body text-muted p-1 bg-transparent'>
                                <h3 id='city-favorite' class='card-title city-display'><a href='#' class='text-decoration-none text-muted'>${place.data.name}, ${place.data.sys.country}</a></h3> 
                                <a href='#' class='remove-favorite text-decoration-none'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="M4.5 12.75a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75z"></path></svg></a>           
                            </div>
                            <p class='d-none'>${place.data.id}</p>
                        </div>
                    </div>
                `
            
            history.append(div);
    }      
    
    //remove UI favorite item, e is defined in the calling event
    static removeFavoriteUI(e) {
        e.remove();
    }
    
}
// map functions ---------------------------------------------------------------------------
class MapLocation {
    //buildMap fixes the map re-render issue
    //to rerender the map we add select the required leaflet div and set the inner html again
    //then we use the leaflet syntax to create a new map and pass in the current lat/lon and zoom parameters, we also have to include attribution for the tiler host which provides the actual map
    //flyto just gives the map a zooming animation
    //the osm items are for the tiler, which require a tiler address and attribution to add to the map, then we add the layer to the map
    //also need to add css for the #map and #mapid ids -> the height, width, position

    static buildMap(lat, lon, zoom = 9) {     
        document.getElementById('mapid').innerHTML = "<div id='map'></div>";
        
        let map = new L.Map('map', {zoomControl: false});
        //these map. add ons can be chained, but shown as is for clarity
        map.setView(new L.LatLng(lat, lon), 3);
        map.flyTo(new L.LatLng(lat, lon), zoom);
        
        //for the tiler
        let osmURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        let osmAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        let osmLayer = new L.tileLayer(osmURL, {attribution: osmAttribution,});
        
        
        
        // map.addControl(new L.control({zoomControl: false}));
        // map.flyToBounds(L.LatLng(lat, lon));
        map.addLayer(osmLayer);
        // let validatorsLayer = new OsmJs.Weather.LeafletLayer({lang: en});
        // map.addLayer(validatorsLayer);
    }
}

//event listeners----------------------------------------------------------------------
//user enters a city name (specifies with state and/or country, if desired/necessary)
//prevent default browser action (not posting anything)
//pass the city name to getWeather();
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const city = document.querySelector('form').elements.city.value;
    Request.getWeather(city);
    document.querySelector('form').classList.remove('top-50', 'translate-middle');
    document.querySelector('form').classList.add('top-0', 'translate-middle-x');
})

//event on click of plus sign to add location to LS
//in the current weather section - when the user clicks the plus sign to add a favorite we call the addLocation() and pass in the last index of the temporary storage array called store
document.querySelector('section').addEventListener('click', (e) => {
    if(e.target.classList.contains('add-favorite') && e.target.nodeName === 'A') {
           
        //using end of string so that it doesn't add elements searched prior to current search in this browser session
        //add current location to LS
        Storage.addLocation(store[store.length-1]);
        //add current location search to favorites on UI
        UI.displayFavorites();
        // console.log(e.target.previousSibling.previousSibling.innerText)
    }   
})


//remove favorite event - should call to local storage and a UI remove
//in the favorites section - when a user clicks the minus(-) svg we trace the click up to the element and pass the e.target into the removeFavoriteUI() function to remove it from the UI, then we find the cityID visibly hidden in the div and pass that city ID into the removeLocation() function that iterates through the LS object to find the matching index item and removes it


document.querySelector('#history').addEventListener('click', (e) => {
    if(e.target.classList.contains('remove-favorite') && e.target.nodeName === 'A') {
        // console.log(e.target.parentElement.nextSibling.nextSibling.innerText);

        //remove favorite from UI, e.target chain up to the top node
        UI.removeFavoriteUI(e.target.parentElement.parentElement.parentElement.parentNode);

        //remove from local storage - using cityID for the unique ID
        let id = Number(e.target.parentElement.nextSibling.nextSibling.innerText);
        Storage.removeLocation(id);
    }

    //if the e.target is the city name we use the cityID again to iterate through the LS to find the lat/lon to re-load the favorite as the current weather    
    if(e.target.nodeName === 'A') {
        let loc = Storage.getLocation();
        // console.log(loc);
        let eid = Number(e.target.parentElement.parentNode.nextSibling.nextSibling.innerText);
        console.log(e.target.parentElement.parentNode.nextSibling.nextSibling.innerText)
        // console.log(id);
        // console.log(loc.data.id);
        loc.forEach(function(place) {
            if(place.data.id === eid) {
                // console.log(place.data.coord.lon, place.data.coord.lat)
                Request.refreshWeather(place.data.coord.lon, place.data.coord.lat)
            }
        })

        window.scrollTo(0,0);
        
    }



})


//random map location on load
window.onload = function () {

    
    const lat = Math.random() * (90 - (-90)) + (-90)
    const lon = Math.random() * (180 - (-180)) + (-180)
    // const zoom = 11;
    MapLocation.buildMap(lat, lon, 3);

    UI.displayFavorites();
    windowLoad = false;
}
