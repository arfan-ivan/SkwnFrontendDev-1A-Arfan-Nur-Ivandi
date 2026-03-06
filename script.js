$(function () {

    $('.dropdown').on('mouseenter', function () {
        $(this).find('.dropdown-menu').stop(true, true).fadeIn(150);
    }).on('mouseleave', function () {
        $(this).find('.dropdown-menu').stop(true, true).fadeOut(150);
    });


    var $overlay  = $('#mobileOverlay');
    var $menu     = $('#mobileMenu');
    var $openBtn  = $('#burgerBtn');
    var $closeBtn = $('#closeBtn');

    function openMenu() {
        $menu.addClass('is-open');
        $overlay.addClass('is-open');
        $('body').css('overflow', 'hidden');
    }

    function closeMenu() {
        $menu.removeClass('is-open');
        $overlay.removeClass('is-open');
        $('body').css('overflow', '');
    }

    $openBtn.on('click', openMenu);
    $closeBtn.on('click', closeMenu);
    $overlay.on('click', closeMenu);

    $('#mmFurnitureToggle').on('click', function () {
        $(this).closest('li').toggleClass('mm-sub-open');
    });

    $(window).on('resize', function () {
        if ($(window).width() > 768) closeMenu();
    });


    (function () {

        var SMALL    = 160;
        var ACTIVE   = 280;
        var GAP      = 12;
        var EXTRA    = 5;
        var DURATION = 400;

        var items       = [];
        var current     = 0;
        var total       = 0;
        var isAnimating = false;

        var $track = $('#sliderTrack');
        $track.html(
            '<div class="slider-loading" id="sliderLoading">' +
            '<span>Loading products…</span>' +
            '</div>'
        );


        $.ajax({
            url     : 'db.json',
            method  : 'GET',
            dataType: 'json',
            success : function (data) {
                if (!data.products || !data.products.length) {
                    showError('No products found.');
                    return;
                }
                items   = data.products;
                total   = items.length;
                current = 0;
                $('#sliderLoading').fadeOut(200, function () {
                    $(this).remove();
                    buildTrack();
                });
            },
            error: function (xhr, status, err) {
                console.error('Failed to load db.json:', status, err);
                showError('Failed to load products. Please try again.');
            }
        });

        function showError(msg) {
            $('#sliderLoading').html('<span style="color:#c0392b;">' + msg + '</span>');
        }


        function getIdx(offset) {
            return ((current + offset) % total + total) % total;
        }


        function createSlide(idx, isActive) {
            var item = items[idx];
            var $div = $('<div>', {
                class: 'slide-item' + (isActive ? ' active' : '')
            });

            var $img = $('<img>', {
                src  : item.img,
                alt  : item.name,
                css  : { width: '100%', height: '100%', objectFit: 'cover' }
            });

            var stockBadge = (item.stock <= 10)
                ? '<span class="slide-stock">Only ' + item.stock + ' left</span>'
                : '';

            var $info = $('<div>', { class: 'slide-info' }).html(
                '<span class="slide-price">$' + item.price + '</span>' +
                '<span class="slide-name">'  + item.name  + '</span>' +
                stockBadge
            );

            $div.append($img).append($info);
            return $div[0];
        }


        function calcInitialX() {
            var w           = $(window).width();
            var leftOfCenter = EXTRA * (SMALL + GAP) + ACTIVE;
            return Math.round(w / 5 - leftOfCenter) + (SMALL + GAP);
        }


        function getCurrentX() {
            var mat   = window.getComputedStyle($track[0]).transform;
            var def   = calcInitialX();
            if (!mat || mat === 'none') return def;
            var parts = mat.match(/matrix.*\((.+)\)/);
            return parts ? (parseFloat(parts[1].split(', ')[4]) || def) : def;
        }


        function buildTrack() {
            if (!items.length) return;
            var sy = $(window).scrollTop();

            $track.css({ transition: 'none', transform: 'translateX(' + calcInitialX() + 'px)' });
            $track.empty();

            for (var i = -EXTRA; i <= EXTRA; i++) {
                $track.append(createSlide(getIdx(i), i === 0));
            }

            $(window).scrollTop(sy);
        }


        function slide(dir) {
            if (isAnimating || !items.length) return;
            isAnimating = true;

            var step = SMALL + GAP;
            var cx   = getCurrentX();

            if (dir === 'next') {
                $track.append(createSlide(getIdx(EXTRA + 1), false));
                $track[0].getBoundingClientRect();
                $track.css({
                    transition: 'transform ' + DURATION + 'ms cubic-bezier(0.4,0,0.2,1)',
                    transform : 'translateX(' + (cx - step) + 'px)'
                });
                setTimeout(function () {
                    $track.find('.slide-item').removeClass('active')
                          .eq(EXTRA + 1).addClass('active');
                }, 30);

            } else {
                $track.prepend(createSlide(getIdx(-(EXTRA + 1)), false));
                $track.css({ transition: 'none', transform: 'translateX(' + (cx - step) + 'px)' });
                $track[0].getBoundingClientRect();
                $track.css({
                    transition: 'transform ' + DURATION + 'ms cubic-bezier(0.4,0,0.2,1)',
                    transform : 'translateX(' + cx + 'px)'
                });
                setTimeout(function () {
                    $track.find('.slide-item').removeClass('active')
                          .eq(EXTRA).addClass('active');
                }, 30);
            }

            setTimeout(function () {
                current     = (dir === 'next') ? getIdx(1) : getIdx(-1);
                isAnimating = false;
                buildTrack();
            }, DURATION + 30);
        }

        $('#nextBtn').on('click', function () { slide('next'); });
        $('#prevBtn').on('click', function () { slide('prev'); });


        var resizeTimer;
        $(window).on('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(buildTrack, 150);
        });

    })();

    $('.category-item').on('click', function () {
        var $self = $(this);
        var name  = $self.find('h4').text().trim();

        $('.category-item').removeClass('active').find('p').remove();

        var desc = {
            'Bedroom'     : 'Transform your bedroom into a sanctuary of comfort and style.',
            'Living Room' : 'Enjoy a great living room aesthetics with your family. Designs created for increased comfortability.',
            'Home Office' : 'Boost productivity with ergonomic and elegant home office solutions.',
            'Gaming Room' : 'Level up your setup with dedicated gaming furniture built for performance.'
        };

        $self.addClass('active');
        if (desc[name]) {
            $self.append('<p>' + desc[name] + '</p>');
        }
    });

    $('.deals-section button').on('click', function () {
        var val = $('.deals-section input[type="email"]').val().trim();
        if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            alert('Please enter a valid email address.');
            return;
        }
        $(this).closest('.email-wrapper')
               .html('<p style="color:#2ecc71;font-weight:600;">🎉 You\'re in! Check your inbox for your 10% off code.</p>');
    });

});