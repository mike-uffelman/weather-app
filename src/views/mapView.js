'use strict';


let { OWM_APIKEY } = process.env;

// class Map {

    // module variables
    export let map;
    export let searchMapObj;
    export let mapClick;
    export let eCoords = {};

    
    // event handler for the map overlay
    export const addHandlerMapClick = function(enableAndBuild, gotoLocation) {
        const mapBox = document.querySelector('#searchMap');

        // click event to remove map overlay and build the search map
        mapBox.addEventListener('click', (e) => {
            const mapOverlay = document.querySelector('.search__form-map--overlay');

            if(e.target.closest('.search__form-map--overlay')) {

                // remove opacity then display none on timeout
                mapOverlay.style.opacity = '0';
    
                mapOverlay.style.transition = 'all ease 1000ms';
                setTimeout(() => {
                    mapOverlay.style.display = 'none';
                }, 3000)

                // if the searchMap has already been rendered, then return
                // if(searchMapObj) return;

                enableAndBuild(); // build the search map if not already, i.e. for permission allowed search map, this is already done for permission blocked search map
            }
        }, {once: true}) // only allow this event once
    }

    // search view map build function
    // takes the coordinates and a zoom level
    export const searchMap = async function(coords, zoom, ...marker) {
        // re-set coordinates variables as lat, lon
        console.log(coords);
        const { latitude: lat, longitude: lon } = coords;

        // tile layer using openstreetmap
        let osmURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        let osmAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

        // create new variable for the tile layer
        let osmLayer = new L.tileLayer(osmURL, {attribution: osmAttribution}
        );
        
        // map options
        let mapOptions = {
            zoomControl: true, // allow +/- zoom controls on map
            worldCopyJump: true, // infinite map, i.e. normalizes coordinates instead of incrementing beyond +/- 90 and  +/- 180
            keyboard: true, // allow keyboard events on map
            keyboardPanDelta: 25
        };

        // map initializer
        searchMapObj = L.map('searchMap', mapOptions)
            .setView(new L.LatLng(lat, lon), zoom)
            .addLayer(osmLayer)
        
        // map event handler for drag, click, and keyboard
        searchMapObj.on({
            // if map cross hair visible, hide it
            drag: (e) => {
                if(document.querySelector('.crosshair')) document.querySelector('.crosshair').classList.remove('show');
            },

            // set marker on map mouse click and set eCoords
            click: (e) => {
                // if map cross hair visible, hide it
                if(document.querySelector('.crosshair')) document.querySelector('.crosshair').classList.remove('show');
                
                eCoords = {
                    latitude: e.latlng.wrap().lat,
                    longitude: e.latlng.wrap().lng // keeps longitude between -180 and +180
                };
                setMarker(eCoords);
            },
            // enable keyboard map navigation, add crosshair for map center
            keydown: (e) => {
                // if map cross hair not visible, show it
                if(!document.querySelector('.crosshair show')) {
                    document.querySelector('.crosshair').classList.add('show');
                }
                
                // add a map marker on spacebar press
                if(e.originalEvent.code === "Space" || e.originalEvent.code === "Enter") {
                    const center = searchMapObj.getBounds().getCenter().wrap();

                    // sets the eCoords object to the center of the current map placement
                    eCoords = {
                        latitude: center.lat,
                        longitude: center.lng
                    }
                    setMarker(eCoords);
                }
            }
            
        })
            
        
    }

    // function sets the map marker
    const setMarker = function(coords) {
        clearMarkers();
        const searchMarker = L.marker([coords.latitude, coords.longitude])
        searchMarker.addTo(searchMapObj)
    }

    // remove map marker and shadow on click
    export const clearMarkers = function () {
        document.querySelectorAll('.leaflet-marker-pane img').forEach(mark => mark.remove());
        document.querySelectorAll('.leaflet-shadow-pane img').forEach(shadow => shadow.remove());
    }

    // function to build weather amp at current weather location
    export const weatherMap = async function (coords, zoom = 9) {     
        console.log('map parameters: ', coords);
        console.log('show me coords.location: ', coords.location);
        
        if(coords.geoLocation.locPermission === 'blocked') return;

        const mapid = document.querySelector('#mapid');

        mapid.innerHTML = "<div id='map' class='search__modal--map--map'></div>";

        const { lat, lon } =  coords.location;


        // for the tiler
        let osmURL = await 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        let osmAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        let osmLayer = new L.tileLayer(osmURL, {attribution: osmAttribution,}
        );
        let myDivIcon = L.divIcon({
            className: 'map-marker',
            html: `
                <div class='map-marker'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                        <path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z"/>
                    </svg>
                </div>`
        })

        
        // weather layer setup==================
        const layerName = 'precipitation_new'
        const weatherUrl = await `https://tile.openweathermap.org/map/${layerName}/{z}/{x}/{y}.png?appid=${OWM_APIKEY}`

        let weatherLayer = new L.tileLayer(weatherUrl)
        // ======================================


        // build map ===========================
        map = new L.Map('map', {
            zoomControl: true
            // layers: [osmLayer, weatherLayer] //add back for weather layer 

        })
        .addLayer(osmLayer)
        // .addLayer(weatherLayer) //? keep this, displays rain on map => add back for production
        .setView(new L.LatLng(lat, lon), 6)


        // adds pin to weather 
        L.marker([lat, lon], {icon: myDivIcon})
            .addTo(map)
    }        
    

  
    


    
