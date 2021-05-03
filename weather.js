class Location {
    constructor(data) {
        this.data = data
    }
}

let windowLoad = true;
let firstWeatherCall = true;
const store = [];
const APIkey = '63c966c95ff05cfed696cec21d7ff716';
/*const callAddress = `https://api.openweathermap.org/data/2.5/weather?q=`;*/

//push key data to array then copy to local storage-------------------------------
class Storage {
    //this was just a test to push instantiated objects to array
    static storeLocation(place) {
        
        const cityObj = new Location(place);
        // Storage.addLocation(cityObj);
        // const clone = new Object(JSON.parse(JSON.stringify(cityObj)));
        // console.log(clone);
        store.push(cityObj);
        console.log(store);
        
    }

    //this is for retrieving locally stored locations to edit storage and for display
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
    static addLocation(location) {
        let loc = Storage.getLocation();
        loc.push(location);
        localStorage.setItem('loc', JSON.stringify(loc));
    }

    //this is to remove locations from the local storage
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
        document.querySelector('#city-input').value = '';
        
        //call map function to display map
        MapLocation.buildMap(data.coord.lat, data.coord.lon);
    }


    static displayHelp() {
        const banner = document.createElement('div');
        banner.style.height = '2rem';
        banner.innerText = 'test text';
        banner.style.backgroundColor = 'blue';
        banner.style.color = 'white';

        const main = document.querySelector('main');
        main.append(banner);
    }
   
    //how to display favorites saved to LS
    static displayFavorites() {
        let loc = Storage.getLocation();
        
        if(windowLoad) {
            loc.forEach(place => UI.buildFavoriteDivs(place))
        } else {
            UI.buildFavoriteDivs(store[store.length-1])
        };
        
        
                    
    }  
    static buildFavoriteDivs(place) {
        const history = document.querySelector('#history');    
            
            const div = document.createElement('div');
            div.classList.add('card', 'rounded', 'bg-light','my-1','mx-3');          
                div.innerHTML = `
                    <div class='row g-0 rounded'>
                        <div class='col-2 d-flex flex-column justify-content-center bg-secondary'>
                            <img id='icon' src='https://picsum.photos/100/100' class='img'>
                        </div>
                        <div class='col-10'>
                            <div class='d-flex flex-row justify-content-between card-body text-muted p-1 '>
                                <h3 id='city-favorite' class='card-title city-display'><a href='#' class='text-decoration-none'>${place.data.name}, ${place.data.sys.country}</a></h3> 
                                <a href='#' class='remove-favorite text-decoration-none'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="M4.5 12.75a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75z"></path></svg></a>           
                            </div>
                            <p class='d-none'>${place.data.id}</p>
                        </div>
                    </div>
                `
            
            history.append(div);
    }      
    
    //remove UI favorite
    static removeFavoriteUI(e) {
        e.remove();
    }
    
}
// map functions ---------------------------------------------------------------------------
class MapLocation {
    //buildMap fixes the map re-render issue
    static buildMap(lat, lon, zoom = 9) {     
        document.getElementById('mapid').innerHTML = "<div id='map'></div>";
        
        let osmURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        let osmAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        let osmLayer = new L.tileLayer(osmURL, {attribution: osmAttribution,});
        let map = new L.Map('map', {zoomControl: false});
        map.setView(new L.LatLng(lat, lon), 3);
        map.flyTo(new L.LatLng(lat, lon), zoom);
        // map.addControl(new L.control({zoomControl: false}));
        // map.flyToBounds(L.LatLng(lat, lon));
        map.addLayer(osmLayer);
        // let validatorsLayer = new OsmJs.Weather.LeafletLayer({lang: en});
        // map.addLayer(validatorsLayer);
    }
}

//event listeners----------------------------------------------------------------------

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const city = document.querySelector('form').elements.city.value;
    Request.getWeather(city);
})

//event on click of plus sign to add location to LS
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
document.querySelector('#history').addEventListener('click', (e) => {
    if(e.target.classList.contains('remove-favorite') && e.target.nodeName === 'A') {
        // console.log(e.target.parentElement.nextSibling.nextSibling.innerText);

        //remove favorite from UI, e.target chain up to the top node
        UI.removeFavoriteUI(e.target.parentElement.parentElement.parentElement.parentNode);

        //remove from local storage - using cityID for the unique ID
        let id = Number(e.target.parentElement.nextSibling.nextSibling.innerText);
        Storage.removeLocation(id);
    }

    
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
