
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