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

    schedule_tab();
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
        let height = (window.innerWidth > 991) ? Math.round(notice.offsetHeight * 3 / 4) : Math.round(notice.offsetHeight * 7 / 8);
        height = -1 * height;
        notice.style.bottom = height + 'px';

        //margin before youtube embed
        let mainsection = document.getElementById('main');
        mainsection.style.paddingTop = ((height * -1) + 80) + 'px';

        let yt_embed = document.querySelectorAll('#youtube_embed > iframe');
        yt_embed[0].style.height = (yt_embed[0].clientWidth * 2 / 4) + 'px';
    }
}

function schedule_tab() {
    let schedule_links = document.querySelectorAll('#schedule a');
    if (schedule_links.length == 0) return;
    schedule_links.forEach(function (el, key) {
        el.addEventListener('click', function (ev) {
            ev.preventDefault();
            let id_target = el.dataset.target;
            schedule_tab_set_active(el, id_target);
        });
    });
}

function schedule_tab_set_active(el, id) {
    let all_tab = document.querySelectorAll('#tab-schedule .tab-pane'),
        target_tab = document.getElementById(id);
    // doScrolling(`#${id}`, 200);

    if (target_tab.classList.contains('active') == false) {
        all_tab.forEach(function (el, index) {
            el.classList.remove('active', 'show', 'fade');
            el.classList.add('fade');
        });

        // animate
        window.schedule_tab_action = window.schedule_tab_action || [];
        if (window.schedule_tab_action == undefined || window.schedule_tab_set_active.hasOwnProperty(id) == false) {
            window.schedule_tab_action[id] = new gsap.timeline()
                .staggerFrom(target_tab.children, 1, {y: -50, opacity: 0, delay: 0}, 0.5)
                .staggerTo(target_tab.children, 2, {y: 0, opacity: 1}, 0);
        } else {
            window.schedule_tab_action[id].play();
        }
        //scrollto
        target_tab.classList.add('active', 'show');
    }
}

// scroll plugins
function doScrolling(element, duration) {
    element = (typeof (element) == 'string') ? document.querySelectorAll(element)[0] : element;
    let elementY = element.getBoundingClientRect().y;
    let startingY = window.pageYOffset;
    let diff = elementY - startingY;
    let start;

    // Bootstrap our animation - it will get called right before next frame shall be rendered.
    window.requestAnimationFrame(function step(timestamp) {
        if (!start) start = timestamp;
        // Elapsed milliseconds since start of scrolling.
        let time = timestamp - start;
        // Get percent of completion in range [0, 1].
        let percent = Math.min(time / duration, 1);

        window.scrollTo(0, startingY + diff * percent);

        // Proceed with animation as long as we wanted it to.
        if (time < duration) {
            window.requestAnimationFrame(step);
        }
    })
}

window.addEventListener('DOMContentLoaded', (event) => {
    Promise.all(Array.from(document.images).map(img => {
        if (img.complete)
            if (img.naturalHeight !== 0)
                return Promise.resolve();
            else
                return Promise.reject(img);
        return new Promise((resolve, reject) => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', () => reject(img));
        });
    })).then(() => {
        console.log('all images loaded successfully');
        main();
    }, badImg => {
        console.log('some image failed to load, others may still be loading');
        console.log('first broken image:', badImg);
    });
});
