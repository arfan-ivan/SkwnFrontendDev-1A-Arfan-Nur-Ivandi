$(document).ready(function(){

  $(".dropdown").on("mouseenter", function(){
    $(this).find(".dropdown-menu").stop(true, true).slideDown(200);
  }).on("mouseleave", function(){
    $(this).find(".dropdown-menu").stop(true, true).slideUp(200);
  });
  $(".dropdown > a").on("click", function(e){
    var $menu = $(this).siblings(".dropdown-menu");
    if ($menu.is(":hidden")) {
      e.preventDefault();
      $(".dropdown-menu").not($menu).slideUp(200);
      $menu.stop(true, true).slideDown(200);
    }
  });
  $(document).on("click", function(e){
    if (!$(e.target).closest(".dropdown").length) {
      $(".dropdown-menu").slideUp(200);
    }
  });

  var items = [
    { img: 'img/slider/1.jpg', name: 'Und Chair',  price: '$329' },
    { img: 'img/slider/2.jpg', name: 'Pösht Sofa', price: '$549' },
    { img: 'img/slider/3.jpg', name: 'Nörd Table', price: '$219' },
    { img: 'img/slider/4.jpg', name: 'Wäll Shelf', price: '$189' },
    { img: 'img/slider/5.jpg', name: 'Grön Couch', price: '$499' },
  ];

  var SMALL       = 160;
  var ACTIVE      = 280;
  var GAP         = 12;
  var EXTRA       = 5;
  var DURATION    = 400;
  var current     = 0;
  var total       = items.length;
  var isAnimating = false;

  function getIdx(offset) {
    return ((current + offset) % total + total) % total;
  }

  function createSlide(idx, isActive) {
    var item = items[idx];
    return $(
      '<div class="slide-item' + (isActive ? ' active' : '') + '">' +
        '<img src="' + item.img + '" alt="' + item.name + '">' +
        '<div class="slide-info">' +
          '<span class="slide-price">' + item.price + '</span>' +
          '<span class="slide-name">'  + item.name  + '</span>' +
        '</div>' +
      '</div>'
    );
  }

function calcInitialX() {
    var wrapperWidth = window.innerWidth;
    var leftOfCenter = EXTRA * (SMALL + GAP) + ACTIVE / 1;
    var center = Math.round(wrapperWidth / 5 - leftOfCenter);
    return center + (SMALL + GAP);
}

  function getCurrentX($track) {
    var mat = window.getComputedStyle($track[0]).transform;
    if (!mat || mat === 'none') return calcInitialX();
    var parts = mat.match(/matrix.*\((.+)\)/);
    if (!parts) return calcInitialX();
    return parseFloat(parts[1].split(', ')[4]) || calcInitialX();
  }

  function buildTrack() {
    var $track     = $('#sliderTrack');
    var savedScroll = window.scrollY;
    $track.css({ transition: 'none', transform: 'translateX(' + calcInitialX() + 'px)' });
    $track.empty();
    for (var i = -EXTRA; i <= EXTRA; i++) {
      $track.append(createSlide(getIdx(i), i === 0));
    }
    window.scrollTo(0, savedScroll);
  }

  function slide(direction) {
    if (isAnimating) return;
    isAnimating = true;

    var $track   = $('#sliderTrack');
    var step     = SMALL + GAP;
    var currentX = getCurrentX($track);

    if (direction === 'next') {
      $track.append(createSlide(getIdx(EXTRA + 1), false));
      $track[0].getBoundingClientRect();
      $track.css({
        transition: 'transform ' + DURATION + 'ms cubic-bezier(0.4, 0, 0.2, 1)',
        transform:  'translateX(' + (currentX - step) + 'px)'
      });
      setTimeout(function() {
        $track.find('.slide-item').removeClass('active');
        $track.find('.slide-item').eq(EXTRA + 1).addClass('active');
      }, 30);

    } else {
      $track.prepend(createSlide(getIdx(-(EXTRA + 1)), false));
      $track.css({ transition: 'none', transform: 'translateX(' + (currentX - step) + 'px)' });
      $track[0].getBoundingClientRect();
      $track.css({
        transition: 'transform ' + DURATION + 'ms cubic-bezier(0.4, 0, 0.2, 1)',
        transform:  'translateX(' + currentX + 'px)'
      });
      setTimeout(function() {
        $track.find('.slide-item').removeClass('active');
        $track.find('.slide-item').eq(EXTRA).addClass('active');
      }, 30);
    }

    setTimeout(function() {
      current     = direction === 'next' ? getIdx(1) : getIdx(-1);
      isAnimating = false;
      buildTrack();
    }, DURATION + 30);
  }

  $('#nextBtn').on('click', function() { slide('next'); });
  $('#prevBtn').on('click', function() { slide('prev'); });

  var resizeTimer;
  $(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildTrack, 150);
  });

  buildTrack();
});