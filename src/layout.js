



export const addHandlerNav = function(handle) {
    const navToggle = document.querySelector('.footer__toggle');

    navToggle.addEventListener('click', (e) => {
        if(e.target.closest('.footer__toggle')) {
            console.log('nav toggled')

            e.target.closest('.footer').classList.toggle('open');

        }


    })
}


