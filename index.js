// main function
var menuAction = false;
function main() {

    //auto splide
    let splide_el = document.getElementsByClassName('splide-auto');
    window.splide_data = [];
    for (let i = 0; i < splide_el.length; i++) {
        let data = splide_el[i].dataset;
        window.splide_data[i] = new Splide(splide_el[i]).mount();
    }

    //menu
    let menu_trigger = document.querySelectorAll('#hamburger, #close_menu, #overlay');
    menu_trigger.forEach(function (el, key) {
        el.onclick = function () {toggleMenu()}
    });
    resize_helper();
    window.onresize = resize_helper;
}

function toggleMenu() {
    window.menuIsOpen = window.menuIsOpen || false;
    if (!window.menuIsOpen) {
        if (!menuAction) {
            menuAction = gsap.timeline()
                .from('#menu', {right: '-100%', opacity: 0}, 0)
                .from('#overlay', {right: '-100%', opacity: 0}, 0)
                .from('#menu ul li', {opacity: 0}, 0)
                .to('#overlay', {right: '0', opacity: 0, display: 'block'}, 0)
                .to('#menu', {right: 0, opacity: 1}, 0)
                .staggerFrom(`#menu ul li`, 0.1, {y: -25, opacity: 0, delay: 0}, 0)
                .staggerFrom(`#menu ul li a:after`, 0.1, {width: 0}, 0)
                .staggerTo(`#menu ul li`, 0.4, {y: 0, opacity: 1}, 0.1)
        } else {
            menuAction.timeScale(1).play()
        }
        window.menuIsOpen = true;
    } else {
        menuAction.timeScale(2).reverse()
        window.menuIsOpen = false;
    }
}

function resize_helper() {
    //calculate first section margin top
    let nav = document.getElementsByTagName('nav');
    if (nav.length > 0) {
        let px = nav[0].offsetHeight;
        let section = document.getElementsByTagName('section');
        section[0].style.marginTop = px + 'px';
    }

    //calculate notice
    let slider = document.getElementById('slider');
    if (slider != undefined) {
        let notice = document.getElementById('notice');
        let height = -1 * Math.round(notice.offsetHeight * 3 / 4);
        notice.style.bottom = height + 'px';

        //margin before youtube embed
        let mainsection = document.getElementById('main');
        mainsection.style.paddingTop = ((height * -1) + 80) + 'px';

        let yt_embed = document.querySelectorAll('#youtube_embed > iframe');
        yt_embed[0].style.height = (yt_embed[0].clientWidth * 2 / 4) + 'px';
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    main();
});