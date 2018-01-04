$('li[id^="issue"] a[href*="/issues/"]').not('.muted-link').each(function(i,link){
  var html = $.get(link.href).then(function(html){
    findImages(html).then(function(images){
      if (images) {
        var container = $(link).parent('div')
        appendImageHtml(container)

        var gallery = $(container).find('.issue-images__gallery')

        $(images).each(function(i,img){
          appendImageData(img,i,gallery)
        })

        var imageCountDisplay = $(container).find('.image-total')
        imageCountDisplay[0].innerHTML = images.length
      }
    })
  })
})

function findImages(html){
  return new Promise(function(resolve){
    var $html = $(html)
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
          <div class="gallery__nav__element gallery__nav__element--link gallery__nav__prev">Prev</div>
          <div class="gallery__nav__element gallery__nav__element--link gallery__nav__next">Next</div>
          <div class="gallery__nav__element gallery__nav__count">
            &nbsp;&nbsp;//&nbsp;&nbsp;
            <span class="image-index">1</span>
            of
            <span class="image-total"></span>
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

  var firstImage = JSON.parse($gallery[0].dataset.images)[0]
  $gallery.find('.gallery__current-image').attr('src',firstImage)
})