let { OWM_APIKEY } = process.env;


// class Map {

    export let map;
    export let searchMapObj;
    // export let mapEvent;
    export let mapClick;
    // export let _data;
    export let eCoords = {
        latitude: null,
        longitude: null
    };
    // let mapEnabled = false;

    

    export const addHandlerMapClick = function(enableAndBuild, gotoLocation) {
        const form = document.querySelector('form');
        const button = document.querySelector('#search-btn');
        const mapBox = document.querySelector('#searchMap');
        // eCoords.addEventListener('change', () => {
        //     console.log('eCoords has changed')
        // })
        // if(eCoords.length > 0) {
        //     console.log(eCoords);
        //     button.disabled = false;
        // }

        mapBox.addEventListener('click', (e) => {
            console.log(e.target);
            const mapOverlay = document.querySelector('.search__form-map--overlay');
            if(e.target.closest('.search__form-map--overlay')) {
                console.log('this is the search map')
                // mapBox.classList.remove('map--overlay');
                mapOverlay.style.opacity = '0';
    
                mapOverlay.style.transition = 'all ease 1000ms';
                setTimeout(() => {
                    mapOverlay.style.display = 'none';

                }, 3000)

                if(searchMapObj) return;
                enableAndBuild(); // build the search map if not already, i.e. for permission allowed search map, this is already done for permission blocked search map

                // mapEnabled = true;
            }
        }, {once: true}) // only allow this event once

        // form.addEventListener('submit', (e) => {
        //     e.preventDefault();

        //     const mapRadio = form.elements.mapRadio.checked;
        //     if(mapRadio && eCoords.latitude !== null && eCoords.longitude !== null) return;
        //     gotoLocation();
        //     console.log('eCoords before submit: ', eCoords);
        //     eCoords = {}; //clear coordinates each form submit
        //     // searchMapObj = '';
        //     console.log('eCoords after submit: ', eCoords)

        //     clearMarkers();
        // });
        
        
        
        
        
  
    }

    export const searchMap = async function(coords, zoom, ...marker) {
        console.log(coords);
        const { latitude: lat, longitude: lon } = coords;
        let osmURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        let osmAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        let osmLayer = new L.tileLayer(osmURL, {attribution: osmAttribution}
        );
        let mapOptions = {
            zoomControl: true,
            worldCopyJump: true,
            keyboard: true
        };

        searchMapObj = L.map('searchMap', mapOptions)
            .setView(new L.LatLng(lat, lon), zoom)
            .addLayer(osmLayer)
        
        searchMapObj.on({
            click: (e) => {
                eCoords = {
                    latitude: e.latlng.wrap().lat, 
                    longitude: e.latlng.wrap().lng
                };
                setMarker(eCoords);
            },
            // enable keyboard map navigation
            keydown: (e) => {
                if(e.originalEvent.code === "Space") {
                    const center = searchMapObj.getBounds().getCenter().wrap();
                    eCoords = {
                        latitude: center.lat,
                        longitude: center.lng
                    }
                    setMarker(eCoords);
                }
            }
        })
            
        
    }

    const setMarker = function(coords) {
        clearMarkers();
        const searchMarker = L.marker([coords.latitude, coords.longitude])
        searchMarker.addTo(searchMapObj)
    }

    const clearMarkers = function () {
        document.querySelectorAll('.leaflet-marker-pane img').forEach(mark => mark.remove());
        document.querySelectorAll('.leaflet-shadow-pane img').forEach(shadow => shadow.remove());
    }

    export const returnCoords = async function() {
        return eCoords;
    }

    export const weatherMap = async function (coords, zoom = 9) {     
        // console.log(this.map);
    const mapid = document.querySelector('#mapid');

        mapid.innerHTML = "<div id='map' class='search__modal--map--map'></div>";

        const { latitude: lat, longitude: lon } =  coords;
        

        // mapid.style.transition = 'opacity ease 1000ms'
        // mapid.style.opacity = 0;

        //for the tiler
        let osmURL = await 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
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
        const weatherUrl = await `https://tile.openweathermap.org/map/${layerName}/{z}/{x}/{y}.png?appid=${OWM_APIKEY}`

        let weatherLayer = new L.tileLayer(weatherUrl)
        map = new L.Map('map', {
            zoomControl: true
            // layers: [osmLayer, weatherLayer] //add back for weather layer 

        })
            .addLayer(osmLayer)
        // .addLayer(weatherLayer)
        //* ^ add back for production

        // const bounds = L.bounds([lat, lon]).getCenter()
        // console.log('bounds: ', bounds)
        //     .bindPopup(L.popup({
        //         maxWidth: 250,
        //         minWidth: 100,
        //         autoClose: false,
        //         closeOnClick: true, 
        //         className: ''  //define a class to style the popup
        // }))
        // .setPopupContent(`this is a popup`)
        // .openPopup();    
        
            .setView(new L.LatLng(lat, lon), 6)
            .flyTo(new L.LatLng(lat, lon), 9) 
        // setTimeout(()=> {
        //     map.panBy([0, 125], {duration: 1})
            
        // }, 1000)

        L.marker([lat, lon], {icon: myDivIcon})
            .addTo(map)
        

        // setTimeout(() => {
        //     // console.log('map loaded')
        //     mapid.style.opacity = 1;
        //     mapid.style.transition = 'opacity ease 2000ms'

        // },2000)    
        // map.dragging.disable();

        // console.log(map);
    
        
        
    }        
    

  
    


    
