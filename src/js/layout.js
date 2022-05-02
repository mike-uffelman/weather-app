'use strict';




export const addHandlerToggleNav = function(searchLink, savedLink) {
    const nav = document.querySelector('.nav');

    nav.addEventListener('mouseover', (e) => {
        if(e.target.closest('.nav__toggle')) {
            console.log('nav toggled')

            e.target.closest('.nav').classList.toggle('is-open');

        }

        
        // if(document.querySelector('.nav').classList.contains('open')) {
        //     setTimeout(() => {
        //         document.querySelector('.nav').classList.toggle('open')
        //     }, 3000)

        // }

        // if(!document.querySelector('.nav').classList.contains('open')) {
        //     clearTimeout();
        // };

        

    })

    nav.addEventListener('click', (e) => {
        if(e.target.closest('.search__link')) {
            e.preventDefault();
            console.log('clicked the search link!!!!!!!!!!!!')
            searchLink();
            e.target.closest('.nav').classList.toggle('is-open');
        };

        if(e.target.closest('.saved__link')) {
            e.preventDefault();
            savedLink();
            e.target.closest('.nav').classList.toggle('is-open');
        };

        if(e.target.closest('.info__link')) {
            console.log('opening info modal...')
            document.querySelector('#info').classList.toggle('show');
        }
    
    })


}

