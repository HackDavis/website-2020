import './scroll-entrance.min.js'
// set typed
var typed = new Typed('#typed', {
  strings: ['// code for social good'],
  typeSpeed: 30,
  backSpeed: 8,
  backDelay: 3500,
  startDelay: 1000,
  fadeOut: false,
  loop: true,
  shuffle: false,
  cursorChar: '_'
});

// faq toggle
const items = document.querySelectorAll('.accordion a.question');

function toggleAccordion(){
  this.classList.toggle('active');
  for(let item of items) {
    if(item !== this) {
      item.classList.remove('active');
      item.nextElementSibling.classList.remove('active');
    }
  }
  this.nextElementSibling.classList.toggle('active');
}

items.forEach(item => item.addEventListener('click', toggleAccordion));

// set progress bar
$(document).ready(function(){
  // init progress indicator
  $('#progressBar').addClass('flat');

  $(document).on('scroll', function(){
      var maxAttr = $('#progressBar').attr('max');
      var valueAttr = $('#progressBar').attr('value');
      var percentage = (valueAttr/maxAttr) * 100;  
  });

  var getMax = function(){
    return $(document).height() - $(window).height();
  }
  
  var getValue = function(){
    return $(window).scrollTop();
  }
  
  if('max' in document.createElement('progress')){
    // Browser supports progress element
    var progressBar = $('progress');
    
    // Set the Max attr for the first time
    progressBar.attr({ max: getMax() });

    $(document).on('scroll', function(){
      // On scroll only Value attr needs to be calculated
      progressBar.attr({ value: getValue() });
    });

    $(window).resize(function(){
      // On resize, both Max/Value attr needs to be calculated
      progressBar.attr({ max: getMax(), value: getValue() });
    });   
  } else {
    var progressBar = $('.progress-bar'), 
      max = getMax(), 
      value, width;
    
    var getWidth = function(){
      // Calculate width in percentage
      value = getValue();            
      width = (value/max) * 100;
      width = width + '%';
      return width;
    }
    
    var setWidth = function(){
      progressBar.css({ width: getWidth() });
    }
    
    $(document).on('scroll', setWidth);
    $(window).on('resize', function(){
      // Need to reset the Max attr
      max = getMax();
      setWidth();
    });
  }
});

// init anchor scrolling
let navItems = $(".page-header nav li")
let anchors = navItems.map(function(i, elem) {
  let id = $(elem).data('id');
  let $els = {
    navItem: navItems.eq(i),
    page: $(`#${id}`),
  }
  return {id, $els};
});
let triggerAnchorDist = $(window).height() / 5;

// navbar fade in
let $navBackdrop = $(".page-header.backdrop");

// scroll to top 
$(window).scroll(function() {
  let scrollTop = $(this).scrollTop();
  if (scrollTop >= 600) {
    $('#scroll-to-top').fadeIn("fast");
  } else {
    $('#scroll-to-top').fadeOut("fast");
  }

  let opacity;
  if (scrollTop >= 2*triggerAnchorDist) {
    opacity = 1;
  } else if (scrollTop >= triggerAnchorDist) {
    opacity = (scrollTop-triggerAnchorDist)/triggerAnchorDist;
  } else {
    opacity = 0;
  }
  $navBackdrop.css("opacity", opacity);

  // Detect scrolled to anchor
  for (let i=anchors.length-1; i>=0; i--) {
    let anchor = anchors[i];
    let $els = anchor.$els;
    let anchorTop = $els.page.offset().top;

    if ( scrollTop + triggerAnchorDist > anchorTop) {
      $(".page-header nav li.selected").removeClass("selected");
      $els.navItem.addClass("selected");
      break;
    }
  }
});

$('#scroll-to-top').click(function() {
  $('body,html').animate({
    scrollTop : 0
  }, 500);
});
