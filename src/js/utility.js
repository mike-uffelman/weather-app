
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

