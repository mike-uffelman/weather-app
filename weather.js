const APIkey = '63c966c95ff05cfed696cec21d7ff716';
/*const callAddress = `https://api.openweathermap.org/data/2.5/weather?q=`;*/


/*const map = L.map('mapid', {
            center: [lat, lon],
            zoom: 10,
            zoomControl: false
        });*/




async function getWeather(city) {
    try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIkey}`)
        console.log(res.data);
        const data = res.data;
        
        
        const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        
        displayWeather(data, sunrise, sunset);
        /*createArray(data);*/
        const cityObj = new Location(data);
        console.log(cityObj);
    }
    
    catch(err) {
        console.log('error!', err)
    }
  
    
}

class Location {
    constructor(data) {
        this.city = data.name,
        this.country = data.sys.country,
        this.desc = data.weather[0].description,
        this.icon = data.weather[0].icon,
        this.temp = data.main.temp,
        this.lat = data.coord.lat,
        this.lon = data.coord.lon,
        this.timestamp = Date.now()
    }
    
}





function displayWeather(data, sunrise, sunset) {
    
    
    
    //update current display, does not add elements
    document.querySelector('#icon').src = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
    
    document.querySelector('#city-display').innerText = `${data.name}, ${data.sys.country}`;
    document.querySelector('#temp-display').innerText = `${data.main.temp}° F, feels like ${data.main.feels_like}° F`;
    document.querySelector('#weather-desc').innerText = `${data.weather[0].description}`;
    document.querySelector('#sun-set-rise').innerText = `Sunrise ${sunrise} | Sunset ${sunset}`;
    
    
    
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

    //reset input
    document.querySelector('#city-input').value = '';
    
    //call map function to display map
    displayMap(data.coord.lat, data.coord.lon);
    
}

/*function createArray(data) {
    let cityStore = {
        city: data.name,
        temperature: data.main.temp
    }
    
    cityStore.assign('city', 'memphis');
    
    console.log(cityStore);
}
*/



function displayMap(lat, lon) {
    /*if(map) {
        map.off();
        map.remove();
    } else {*/
        
        const map = L.map('mapid', {
            center: [lat, lon],
            zoom: 10,
            zoomControl: false
            
        });
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
            foo: 'bar',
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            
        }).addTo(map);
        
        console.log(map);
    
    
}


document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    
 
    
    const city = document.querySelector('form').elements.city.value;
    
    /*const list = document.querySelector('#cities');
    
    const listItems = list.querySelectorAll('#city-box');
    const listItemsArray = Array.from(listItems);
    console.log(listItemsArray);*/
    
    
    
    getWeather(city)
})

/*try {
    something
} catch (e) {
    window.location.href='https://stackoverflow.com/search?q=[js]+' + e.message;
}*/






/*function mapObject() {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=boston&units=imperial&appid=63c966c95ff05cfed696cec21d7ff716')
        .then(res => res.json()
        .then(data => console.log(data))
        .catch(err => console.log('ERRORRRRR!', err)))
}*/

document.querySelector('section').addEventListener('click', (e) => {
    console.log(e.target);
})
