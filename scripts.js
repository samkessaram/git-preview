// Run at first load
setupIssuePreview()

// Run on PJAX load as well
document.addEventListener('pjax:success',function(e){
  setupIssuePreview()
})

// Access background-image
var imgURL = chrome.extension.getURL("camera.png");

function setupIssuePreview(){

  // Each issue link
  $('li[id^="issue"] a[href*="/issues/"]').not('.muted-link').each(function(i,link){

    // Get the html for the linked page
    var html = $.get(link.href).then(function(html){

      // Search for images on that page
      findImages(html).then(function(images){
        if (images) {
          var container = $(link).parent('div')
          appendImageHtml(container)

          $container = $(container)

          // Need to attach this ID to over-ride GitHub !important styling
          $container.attr('id','issue-image-container')

          // Need to change the background image here, because the url is dynamic
          $container.find('.issue-images__toggle').css('background-image','url(' + imgURL + ')')

          // We'll attach data attributes to the parent div of the images, so we need to save it and pass it in a fn for each found image
          var gallery = $container.find('.issue-images__gallery')

          $(images).each(function(i,img){
            appendImageData(img,i,gallery)
          })

          // Display the count so user can keep track of what image they're on.
          var imageCountDisplay = $container.find('.image-total')
          imageCountDisplay[0].innerHTML = images.length
        }
      })
    })
  })
}


function findImages(html){
  return new Promise(function(resolve){
    var $html = $(html)

    // Only get images in comments
    var images = $html.find('.comment-body img')
    if ( images.length){
      resolve(images)
    }
  })
}


function appendImageHtml(container){
  $(container).append(`
    <div class="issue-images">
      <button class="issue-images__toggle"></button>
      <div class="issue-images__gallery" data-images="[]">
        <div class="gallery__nav">
          <div class="gallery__nav__element gallery__nav__element--link gallery__nav__prev">« Prev&nbsp;</div>
          <div class="gallery__nav__element gallery__nav__element--link gallery__nav__next">&nbsp;Next »</div>
          <div class="gallery__nav__element gallery__nav__count">
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span class="image-index">1</span>
            of
            <span class="image-total"></span>
          </div>
        </div>
        <img class="gallery__current-image">
      </div>
    </div>
  `)
}

function appendImageData(img,i,gallery){
  gallery = gallery[0]
  galleryImages = JSON.parse(gallery.dataset.images)
  galleryImages.push(img.src)
  gallery.dataset.images = JSON.stringify(galleryImages)
}


$('body').on('click','.issue-images__toggle',function(){
  $(this).parent('.issue-images').toggleClass('issue-images--open')

  var $gallery = $(this).next('.issue-images__gallery')

  // Default to first image when user opens gallery
  var firstImage = JSON.parse($gallery[0].dataset.images)[0]
  $gallery.find('.gallery__current-image').attr('src',firstImage)
})


$('body').on('click','.gallery__nav__next',function(){
  var $container = $(this).parents('.issue-images')
  var images = JSON.parse( $container.find('.issue-images__gallery')[0].dataset.images )

  // We display the current index + 1 to the user, 
  // so we can use this as the zero-based index of the next image in the array.
  var nextIndex = parseInt( $container.find('.image-index').text() )
  var numberOfImages = parseInt( $container.find('.image-total').text() )
  var image

  if ( nextIndex === numberOfImages ){
    nextIndex = 0
  }
  
  image = images[nextIndex]
  $container.find('.gallery__current-image').attr('src',image)
  $container.find('.image-index').html(nextIndex + 1)
})


$('body').on('click','.gallery__nav__prev',function(){
  var $container = $(this).parents('.issue-images')
  var images = JSON.parse( $container.find('.issue-images__gallery')[0].dataset.images )

  // We display the current index + 1 to the user, 
  // so the previous image is as this value, minus 2
  var nextIndex = parseInt( $container.find('.image-index').text() ) - 2
  var lastIndex = parseInt( $container.find('.image-total').text() ) - 1

  if ( nextIndex < 0 ){
    nextIndex = lastIndex
  }
  
  var image = images[nextIndex]
  $container.find('.gallery__current-image').attr('src',image)
  $container.find('.image-index').html(nextIndex + 1)
})
