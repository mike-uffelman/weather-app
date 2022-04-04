
export const handleErrors = function(handle) {


        window.addEventListener('error', function(e) {
            console.log(e)
            console.log(e.error.stack);
            const message = e.error;
            console.log(message);

            e.preventDefault();
            
            handle(message, 'error');
            
        // console.log('window error: ', ErrorEvent.error)
        // weatherView.renderMessage(e.message)
        })

}


class Message extends Error {


    

    renderMessage(err, type) {
        // this._clear();

        const markup = `
        <div class='message message__${type}'>
            <div class='message__header'>
                <h3 class='message__header--type'>${err.message}</h3>
                <p class='message__message'></p>
            </div>    
            <a href='#' class='message__close'><span class='message__close'></span></a>
            

            </div>
        `

        document.querySelector('.swipeView').insertAdjacentHTML('afterbegin', markup);
        
        const messageEl = document.querySelector('.message');
        setTimeout(() => { messageEl.classList.toggle('show') }, 0);

        document.querySelector('.message').addEventListener('click', (e) => {
            console.log(e.target);
            if(e.target.classList.contains('message__close')) {
                document.querySelector('.message').classList.toggle('show');
                // document.querySelector('.message').style.transform = 'translateY(-8rem)';
                // document.querySelector('.message').style.transformOrigin = 'top';
                setTimeout(() => document.querySelector('.message').remove(), 1000);



            }
        })
    }

    

//     generateMarkup() {
//         return `
//             <div class='error'>
//                 <h3 class='error__type'>Error Header</h3>
//                 <p class='error__message'>this is the error message!!!!</p>
//             </div>
//         `
//     }
// }




// export const errorHandler = 
//     window.addEventListener('error', function(e) {
//         console.log(e)
//         handle(e);
//         e.preventDefault();

//         // console.log('window error: ', ErrorEvent.error)
//         // weatherView.renderError(e.message)
//     })
}


export default new Message();