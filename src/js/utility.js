
export const getTodaysDate = function() {
    const todaysDate = new Date();
    const date = todaysDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
    return date;
}

export const getHourTime = function(timeInMS) {
    const time = new Date(timeInMS * 1000);
    const alertDate = time.toLocaleDateString('en-us', {weekday: 'long'});
    const alertTime = time.toLocaleTimeString('en-us', {hour: 'numeric', hour: '2-digit', minute: '2-digit'});

    return `${alertDate} ${alertTime}`;
}



// manually delete local storage index
        // function storageDeleteItem(locIndexStart) {
        //     const loc = JSON.parse(localStorage.getItem('loc'));
        //     console.log('LOCAL STORAGE; ', loc);
        //     loc.splice(locIndexStart, 3);
        //     localStorage.setItem('loc',JSON.stringify(loc))
        // }
        
        // storageDeleteItem(0);

export const buildNewOptions = (opt) => {
    let newOpts = {}

    newOpts.url = opt.apiURL;
    newOpts.methods = 'get';
    
    newOpts.params = Object.entries(opt)
        .filter(item => item[0] !== 'apiURL')
        .reduce((acc, curr) => {
            acc[curr[0]] = curr[1]
            return acc;
        }, {})
    newOpts.params.appid = process.env.OWM_APIKEY
    console.log(newOpts)
    return newOpts;
}