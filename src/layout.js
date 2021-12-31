



export const addHandlerToggleNav = function(searchLink, savedLink) {
    const footer = document.querySelector('.footer');

    footer.addEventListener('mouseover', (e) => {
        if(e.target.closest('.footer__toggle')) {
            console.log('nav toggled')

            e.target.closest('.footer').classList.toggle('open');

        }

        
        // if(document.querySelector('.footer').classList.contains('open')) {
        //     setTimeout(() => {
        //         document.querySelector('.footer').classList.toggle('open')
        //     }, 3000)

        // }

        // if(!document.querySelector('.footer').classList.contains('open')) {
        //     clearTimeout();
        // };

        

    })

    footer.addEventListener('click', (e) => {
        if(e.target.classList.contains('search__link')) {
            e.preventDefault();
            searchLink();
        };

        if(e.target.classList.contains('saved__link')) {
            e.preventDefault();
            savedLink();
        };
    })
}


// export const helpModal = function() {

// }