$('li[id^="issue"] a[href*="/issues/"]').not('.muted-link').each(function(i,link){
  var html = $.get(link.href).then(function(html){
    findImages(html).then(function(images){
      if (images) {
        var container = $(link).parent('div')
        appendImageHtml(container)

        var gallery = $(container).find('.issue-images__gallery')
        $(images).each(function(i,img){
          console.log(img)
          appendImageData(img,i,gallery)
        })
      }
    })
  })
})

var images;
var index = 0;

function findImages(html){
  return new Promise(function(resolve){
    var $html = $(html)
    images = $html.find('.comment-body img')
    if ( images.length){
      resolve(images)
    }
  })
}


function appendImageHtml(container){
  $(container).append(`
    <div class="issue-images">
      <button class="issue-images__toggle"></button>
      <div class="issue-images__gallery">
        <div class="gallery__nav gallery__nav--prev">Prev</div>
        <div class="gallery__nav gallery__nav--next">Next</div>
        <img class="gallery__current-image">
      </div>
    </div>
  `)
}

function appendImageData(img,i,gallery){
  $(gallery).data('img-' + i, img.src)
}





$('body').on('click','.issue-images__toggle',function(){
  $(this).parent('.issue-images').toggleClass('issue-images--open')

  var $gallery = $(this).next('.issue-images__gallery')
  $gallery.find('.gallery__current-image').attr('src',$gallery.data('img-0'))
})

$('body').keydown(function(e){
  // Close carousel on escape keypress
  if ( e.keyCode === 27 ){
    $('.overlay').remove()
  }
})

function createCarousel(images){
  createOverlay();

  var carousel = document.createElement('div')
  carousel.classList = 'carousel'

  $(carousel).css({
    maxHeight: '800px',
    maxWidth: '800px',
    background: 'white',
    padding: '40px'
  })

  $('.overlay').append(carousel)

  $(carousel).append(images[0])
}

function createOverlay(){
  var overlay = document.createElement('div')
  overlay.classList = 'overlay'

  $(overlay).css({
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 32,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  })

  document.body.appendChild(overlay)

  var overlayBackground = document.createElement('div')
  overlayBackground.classList = 'overlay__background'

  $(overlayBackground).css({
    position: 'absolute',
    top: 0,
    left: 0,
    background: 'black',
    opacity: 0.5,
    height: '100%',
    width: '100%',
    zIndex: '-1'
  })

  $('.overlay').append(overlayBackground)

}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};