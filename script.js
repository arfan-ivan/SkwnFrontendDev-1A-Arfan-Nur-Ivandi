document.querySelectorAll('.dropdown').forEach(function(dd) {
    dd.addEventListener('mouseenter', function() {
        this.querySelector('.dropdown-menu').style.display = 'block';
    });
    dd.addEventListener('mouseleave', function() {
        this.querySelector('.dropdown-menu').style.display = 'none';
    });
});

var overlay   = document.getElementById('mobileOverlay');
var menu      = document.getElementById('mobileMenu');
var openBtn   = document.getElementById('burgerBtn');
var closeBtn  = document.getElementById('closeBtn');
var furToggle = document.getElementById('mmFurnitureToggle');
var furSub    = document.getElementById('mmFurnitureSub');

function openMenu() {
    menu.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}
function closeMenu() {
    menu.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
}

openBtn.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

furToggle.addEventListener('click', function() {
    var parent = this.parentElement;
    if (parent.classList.contains('mm-sub-open')) {
        parent.classList.remove('mm-sub-open');
    } else {
        parent.classList.add('mm-sub-open');
    }
});

window.addEventListener('resize', function() {
    if (window.innerWidth > 768) closeMenu();
});

(function() {
    var items = [
        { img: 'img/slider/1.jpg', name: 'Und Chair',  price: '$329' },
        { img: 'img/slider/2.jpg', name: 'Pösht Sofa', price: '$549' },
        { img: 'img/slider/3.jpg', name: 'Nörd Table', price: '$219' },
        { img: 'img/slider/4.jpg', name: 'Wäll Shelf', price: '$189' },
        { img: 'img/slider/5.jpg', name: 'Grön Couch', price: '$499' },
        { img: 'img/slider/6.jpg', name: 'Lüft Chair', price: '$399' },
        { img: 'img/slider/7.jpg', name: 'Bäck Rack',  price: '$149' },
    ];

    var SMALL = 160, ACTIVE = 280, GAP = 12, EXTRA = 5, DURATION = 400;
    var current = 0, total = items.length, isAnimating = false;

    function getIdx(offset) {
        return ((current + offset) % total + total) % total;
    }

    function createSlide(idx, isActive) {
        var item = items[idx];
        var div = document.createElement('div');
        div.className = 'slide-item' + (isActive ? ' active' : '');
        div.innerHTML =
            '<img src="' + item.img + '" alt="' + item.name + '" style="width:100%;height:100%;object-fit:cover">' +
            '<div class="slide-info">' +
                '<span class="slide-price">' + item.price + '</span>' +
                '<span class="slide-name">' + item.name + '</span>' +
            '</div>';
        return div;
    }

    function calcInitialX() {
        var w = window.innerWidth;
        var leftOfCenter = EXTRA * (SMALL + GAP) + ACTIVE;
        return Math.round(w / 5 - leftOfCenter) + (SMALL + GAP);
    }

    function getCurrentX(track) {
        var mat = window.getComputedStyle(track).transform;
        if (!mat || mat === 'none') return calcInitialX();
        var parts = mat.match(/matrix.*\((.+)\)/);
        return parts ? (parseFloat(parts[1].split(', ')[4]) || calcInitialX()) : calcInitialX();
    }

    function buildTrack() {
        var track = document.getElementById('sliderTrack');
        var sy = window.scrollY;
        track.style.transition = 'none';
        track.style.transform = 'translateX(' + calcInitialX() + 'px)';
        track.innerHTML = '';
        for (var i = -EXTRA; i <= EXTRA; i++) {
            track.appendChild(createSlide(getIdx(i), i === 0));
        }
        window.scrollTo(0, sy);
    }

    function slide(dir) {
        if (isAnimating) return;
        isAnimating = true;
        var track = document.getElementById('sliderTrack');
        var step = SMALL + GAP;
        var cx = getCurrentX(track);

        if (dir === 'next') {
            track.appendChild(createSlide(getIdx(EXTRA + 1), false));
            track.getBoundingClientRect();
            track.style.transition = 'transform ' + DURATION + 'ms cubic-bezier(0.4,0,0.2,1)';
            track.style.transform = 'translateX(' + (cx - step) + 'px)';
            setTimeout(function() {
                track.querySelectorAll('.slide-item').forEach(function(s) { s.classList.remove('active'); });
                track.querySelectorAll('.slide-item')[EXTRA + 1].classList.add('active');
            }, 30);
        } else {
            track.insertBefore(createSlide(getIdx(-(EXTRA + 1)), false), track.firstChild);
            track.style.transition = 'none';
            track.style.transform = 'translateX(' + (cx - step) + 'px)';
            track.getBoundingClientRect();
            track.style.transition = 'transform ' + DURATION + 'ms cubic-bezier(0.4,0,0.2,1)';
            track.style.transform = 'translateX(' + cx + 'px)';
            setTimeout(function() {
                track.querySelectorAll('.slide-item').forEach(function(s) { s.classList.remove('active'); });
                track.querySelectorAll('.slide-item')[EXTRA].classList.add('active');
            }, 30);
        }

        setTimeout(function() {
            current = dir === 'next' ? getIdx(1) : getIdx(-1);
            isAnimating = false;
            buildTrack();
        }, DURATION + 30);
    }

    document.getElementById('nextBtn').addEventListener('click', function() { slide('next'); });
    document.getElementById('prevBtn').addEventListener('click', function() { slide('prev'); });

    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildTrack, 150);
    });

    buildTrack();
})();