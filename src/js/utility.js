
export const getTodaysDate = function() {
    const todaysDate = new Date();
    const date = todaysDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
    return date;
}