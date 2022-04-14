//TODO rename to messageView.js ===========================================
//!=====================================================================

class Message extends Error {

    _messageEl;

    _autoClear() {
        document.querySelector('.message').classList.toggle('show');
        // document.querySelector('.message').style.transform = 'translateY(-8rem)';
        // document.querySelector('.message').style.transformOrigin = 'top';
        setTimeout(() => document.querySelector('.message').remove(), 1000);
    }

    renderMessage(message, quality) {
        // this._clear();
        try {
            const markup = `
            <div class='message message__${quality}'>
                <div class='message__header'>
                    <h3 class='message__header--type'>${message === 'err' ? 'err.message' : message}</h3>
                    <p class='message__message'></p>
                </div>    
                <a href='#' class='message__close'><span class='message__close'></span></a>
                
    
                </div>
            `
    
            document.querySelector('.l-swipeView').insertAdjacentHTML('afterbegin', markup);
            this._messageEl = document.querySelector('.message');
            
        
            setTimeout(() => { this._messageEl.classList.toggle('show') }, 500);

            if(quality === 'success' || quality === 'info') {
                setTimeout(() => {
                    this._messageEl.classList.toggle('show');
                }, 3000)
            };

            document.querySelector('.message').addEventListener('click', (e) => {
                console.log(e.target);
                if(e.target.classList.contains('message__close')) {
                    this._autoClear();
                }
            })
        } catch(err) {
            console.log('Unable to render message', err);
            throw err;
        }
        
    }

    _toggleMessageAnimation() {
        setTimeout(() => { messageEl.classList.toggle('show') }, 0);

    }
}


export default new Message();