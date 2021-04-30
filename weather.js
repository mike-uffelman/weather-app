class Location {
    constructor(data) {
        this.city = data.name,
        this.country = data.sys.country,
        this.desc = data.weather[0].description,
        this.icon = data.weather[0].icon,
        this.temp = data.main.temp,
        this.lat = data.coord.lat,
        this.lon = data.coord.lon,
        this.timestamp = Date.now(),
        this.id = data.id
    }
    
    
}

const store = [];
const APIkey = '63c966c95ff05cfed696cec21d7ff716';
/*const callAddress = `https://api.openweathermap.org/data/2.5/weather?q=`;*/

//push key data to array then copy to local storage-------------------------------
class Storage {
    //this was just a test to push instantiated objects to array
    static storeLocation(place) {
        const cityObj = new Location(place);
        // Storage.addLocation(cityObj);
        const clone = new Object(JSON.parse(JSON.stringify(cityObj)));
        store.push(clone);
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
        let loc = Storage.getLocation();

        loc.forEach((location, index) => {
            if(location.id === id) {
                loc.splice(index, 1)
            }
        })
    }
}

//api request function---------------------------------------------------
class Request {
    static async getWeather(city) {
        try {
            const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIkey}`)
            console.log(res.data);
            const data = res.data;
            
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
            
            //display weather in DOM
            UI.displayWeather(data, sunrise, sunset);
            //add to storage call
            Storage.storeLocation(data);
            // Storage.addLocation(data);
            return data;
        }
        
        catch(err) {
            console.log('error!', err);
        }
    }
}

//display in browser------------------------------------------------------------------------
class UI {
    static displayWeather(data, sunrise, sunset) {
        //update current display, does not add elements
        document.querySelector('#icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        
        
        document.querySelector('#city-display').innerText = `${data.name}, ${data.sys.country}`;
        document.querySelector('#temp-display').innerText = `${data.main.temp}° F, feels like ${data.main.feels_like}° F`;
        document.querySelector('#weather-desc').innerText = `${data.weather[0].description}`;
        document.querySelector('#sun-set-rise').innerText = `Sunrise ${sunrise} | Sunset ${sunset}`;
        
        //reset input
        document.querySelector('#city-input').value = '';
        
        //call map function to display map
        MapLocation.buildMap(data.coord.lat, data.coord.lon);
    }

    static displayHistory(data) {
        const history = document.querySelector('#history');
        const div = document.createElement('div');
        div.classList.add('card', 'rounded', 'bg-light');

        div.innerHTML = `
            <div class='row g-0 rounded'>
                <div class='col-2 d-flex flex-column justify-content-center bg-secondary'>
                    <img id='icon' src='https://picsum.photos/100/100' class='img'>
                </div>
                <div class='col-10'>
                    <div class='d-flex flex-row justify-content-between card-body text-muted p-1 '>
                        <h3 id='city-favorite' class='card-title city-display'>${data[0].city}, ${data[0].country}</h3> 
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="M4.5 12.75a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75z"></path></svg>           
                    </div>
                </div>
            </div>
        `

        history.append(div);
    }
        /*const section = document.querySelector('section');
        const div = document.createElement('DIV');
        div.id = 'cities';
        div.classList.add('city-box', 'card');*/
        /*div.innerHTML = `
            <img class='icon img-fluid' src='http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png' height='50px'>
            <div class='city-icon '>
                    <h3 id='city-display' class='city-display'>${data.name}, ${data.sys.country}</h3>
                    
                </div>
                <div class='weather-detail'>
                    <div id='temp-display'><span>${data.main.temp}</span>&#730F <em>(feels like ${data.main.feels_like}F)</em></div>
                    <div id='weather-desc'>${data.weather[0].description}</div>
                    <p>Sunrise ${sunrise} | Sunset ${sunset}</p>
                </div>
            </div>
        `*/
        /*div.innerHTML = `
            
                <div class='row g-0 col-12'>
                    <div class='col-2'>
                        <img src='http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png' class='img-fluid'>
                    
                    </div>
                    <div class='col-10'>
                        <div class='card-body'>
                            <h3 id='city-display' class='card-title city-display'>${data.name}, ${data.sys.country}</h3>
                            <p id='temp-display'class='card-text'><span>${data.main.temp}</span>&#730F <em>(feels like ${data.main.feels_like}F)</em></p>
                            <p id='weather-desc' class='card-text'>${data.weather[0].description}</p>
                            <p class='card-text'>Sunrise ${sunrise} | Sunset ${sunset}</p>
                        </div>
                    </div>
                </div>
            
        `
        section.append(div);*/

        
        
    
}
// map functions ---------------------------------------------------------------------------
class MapLocation {
    //buildMap fixes the map re-render issue
    static buildMap(lat, lon, zoom=9) {     
        document.getElementById('mapid').innerHTML = "<div id='map'></div>";
        
        let osmURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        let osmAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        let osmLayer = new L.tileLayer(osmURL, {attribution: osmAttribution, zoomControl: false});
        let map = new L.Map('map');
        map.setView(new L.LatLng(lat, lon), 6);
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

document.querySelector('section').addEventListener('click', (e) => {
    if(e.target.nodeName === 'svg') {
        // const data = Request.getWeather
        
        Storage.addLocation(store);
        UI.displayHistory(store);
        console.log(store);
        console.log(e.target.previousSibling.previousSibling.innerText)
    }     //     UI.displayHistory(e.target.);
    // }

    
    
})



//random map location on load
window.onload = function () {
    const lat = Math.random() * (90 - (-90)) + (-90)
    const lon = Math.random() * (180 - (-180)) + (-180)
    // const zoom = 11;
    MapLocation.buildMap(lat, lon);
}

/*try {
    something
} catch (e) {
    window.location.href='https://stackoverflow.com/search?q=[js]+' + e.message;
}*/