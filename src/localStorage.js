


export const getLocation = function() {
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
export const addLocation = function(location) {
    console.log(location);
    
    
    const saveLoc = location.at(-1).data;
    console.log('add location to Storage: ', location);

    


    //create new essentials only object for local storage
    const newLocObj = {
        data: {
            name: saveLoc.name,
            state: saveLoc.state,
            country: saveLoc.country,
            lat: saveLoc.lat,
            lon: saveLoc.lon,
            id: saveLoc.id,
            bookmarked: true,
            clicks: 1,
            created: new Date()
        }
        
    }

    console.log(newLocObj);

    let loc = this.getLocation();
    loc.push(newLocObj);
    localStorage.setItem('loc', JSON.stringify(loc));
    console.log(loc)
}

//this is to remove locations from the local storage
//to remove from the local storage we pass in the city id which serves as a unique identifier
//so we retrieve the current LS data, then iterate through it to find the matching id, when found we splice(delete) the matching index, then put the data back in LS with setitem and stringify
export const removeLocation = function(id) {
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

export const incrementClicks = function(id) {
    let loc = this.getLocation();
    console.log(loc);
    loc.forEach(place => {
        console.log(place.data.id);
        console.log(id);
        if(Number(place.data.id) === Number(id)) {
            ++place.data.clicks;
        }
    })
    localStorage.setItem('loc',JSON.stringify(loc))
}