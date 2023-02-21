'use strict';


let _messageElement;

const _clear = function() {
    document.querySelectorAll('.message').forEach(m => m.remove());
}

export const _autoClear = function() {
    document.querySelectorAll('.message').forEach(m => {
        m.classList.toggle('show');
        // document.querySelector('.message').style.transform = 'translateY(-8rem)';
        // document.querySelector('.message').style.transformOrigin = 'top';
        setTimeout(() => m.remove(), 1000);
    })
}

export const renderMessage = function(message, quality = 'error') {
    // _clear();
    try {
        const markup = `
        <div class='message message__${quality}'>
            <div class='message__header'>
                <h3 class='message__header--type'>${message === 'err' ? 'err.message' : message}</h3>
                <p class='message__message'></p>
            </div>    
            <button class='btn--close message--btn-close'>
                <svg class='' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                </svg>
            </button>

            </div>
        `

        document.querySelector('.main').insertAdjacentHTML('afterbegin', markup);
        _messageElement = document.querySelector('.message');
        
    
        setTimeout(() => { _messageElement.classList.toggle('show') }, 500);

        if(quality === 'success' || quality === 'info') {
            setTimeout(() => {
                _messageElement.classList.toggle('show');
            }, 3000)
        };

        document.querySelector('.message').addEventListener('click', (e) => {
            if(e.target.closest('.btn--close')) {
                _autoClear();
            }
        })
    } catch(err) {
        console.log('Unable to render message', err);
        throw err;
    }
    
}

const _toggleMessageAnimation = function() {
    setTimeout(() => { messageEl.classList.toggle('show') }, 0);

}