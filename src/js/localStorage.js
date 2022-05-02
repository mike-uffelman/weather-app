'use strict';



// get locations from local storage
export const getStoredLocations = function() {
    try {
        let loc;
        // if 'loc' in LS is not null, parse and set 'loc' to the LS data, otherwise return loc as an empty array
        if(localStorage.getItem('loc') !== null) {
            loc = JSON.parse(localStorage.getItem('loc'));
        } else {
            loc = [];
        }
        return loc;
    } catch(err) {
        console.log('unable to retrieve locally stored locations', err);
        throw err;
    }
    
}
//this is to add locations to the local storage
//here we pass in last index of the temporary store array
//so we set a variable to retrieve the data from localstorage and push the new data to the end of the LS array
//then we re-add the variable with the new data back to the LS using setitem and stringify
export const addStoredLocation = function(location) {
    
    try {
        const saveLoc = location.at(-1).data;

        const newLocObj = {
            data: {
                name: saveLoc.name,
                state: saveLoc.state,
                country: saveLoc.country,
                lat: saveLoc.lat,
                lon: saveLoc.lon,
                id: saveLoc.id,
                saved: true,
                clicks: 1,
                created: new Date()
            }
            
        }
    
        console.log(newLocObj);
    
        let loc =  getStoredLocations();
        loc.push(newLocObj);
        localStorage.setItem('loc', JSON.stringify(loc));
        // console.log(loc)
    } catch(err) {
        console.log('unable to add location to storage', err)
        throw err;
    }

}

//this is to remove locations from the local storage
//to remove from the local storage we pass in the city id which serves as a unique identifier
//so we retrieve the current LS data, then iterate through it to find the matching id, when found we splice(delete) the matching index, then put the data back in LS with setitem and stringify
export const removeStoredLocation = function(id) {
    try {
        //retrieve local storage
        let loc = getStoredLocations();
        // console.log(loc);

        //iterate through LS elements looking for a match by id, then remove the match
        loc.forEach((place, index) => {
            if(place.data.id === id) {
                loc.splice(index, 1)
            }
        })

        //re-set LS with modified object
        localStorage.setItem('loc',JSON.stringify(loc))

    } catch(err) {
        console.log('unable to remove location from storage', err);
        throw err;
    }
    
}

export const incrementViewCount = function(id) {
    try {
        let loc = this.getStoredLocations();

        loc.forEach(place => {
            if(Number(place.data.id) === Number(id)) {
                ++place.data.clicks;
            }
        })

        localStorage.setItem('loc',JSON.stringify(loc))

    } catch(err) {
        console.log('unable to increment location view count', err);
        throw err;
    }
    
}