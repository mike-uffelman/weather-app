

const APIkey = '63c966c95ff05cfed696cec21d7ff716';

    
    

//buildMap fixes the map re-render issue
//to rerender the map we add select the required leaflet div and set the inner html again
//then we use the leaflet syntax to create a new map and pass in the current lat/lon and zoom parameters, we also have to include attribution for the tiler host which provides the actual map
//flyto just gives the map a zooming animation
//the osm items are for the tiler, which require a tiler address and attribution to add to the map, then we add the layer to the map
//also need to add css for the #map and #mapid ids -> the height, width, position


export const buildMap = function(coords, zoom = 9) {     
    const mapid = document.querySelector('#mapid');
    mapid.innerHTML = "<div id='map'></div>";

    // console.log(coords[0]);
    // const lon = coords[1];
    // console.log(coords);
    const [ lat, lon ] =  coords;
    // console.log(lat, lon);
    
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
    const weatherUrl = `https://tile.openweathermap.org/map/${layerName}/{z}/{x}/{y}.png?appid=${APIkey}`

    let weatherLayer = new L.tileLayer(weatherUrl)
    let map = new L.Map('map', {
        zoomControl: true,
        // layers: [osmLayer, weatherLayer] //add back for weather layer 
        layers: [osmLayer]

    });

    map.addLayer(osmLayer)
    // .addLayer(weatherLayer);
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
    
    map.setView(new L.LatLng(lat, lon), 6)
    map.flyTo(new L.LatLng(lat, lon), 9) 
    setTimeout(()=> {
        map.panBy([0, 125], {duration: 1})
        
    }, 1000)

    L.marker([lat, lon], {icon: myDivIcon})
        .addTo(map)
    

    setTimeout(() => {
        // console.log('map loaded')
        mapid.style.opacity = 1;
        mapid.style.transition = 'opacity ease 2000ms'

    },2000)    


    
    

}


