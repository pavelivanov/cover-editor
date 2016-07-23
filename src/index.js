function size(value) {
  return value + 'px'
}

function getInitialSize(value, zoom) {
  return zoom.init ? value + value * zoom.init : value
}

function getInitialOffset(value, percent) {
  return percent ? -1 * value * percent : 0
}

function setElm(obj, elm, key) {
  if (typeof elm === 'string') {
    obj[key || 'elm'] = document.getElementById(elm)
  } else {
    obj[key || 'elm'] = elm
  }
}

function noop () {}


const CoverEditor = function (containerElm, src, params) {
  const self = this

  const container = {}
  const img = {}
  const zoom = {}
  const drag = {}

  self.state = { img, zoom }
  self.events = {
    onSave: params.onSave || noop,
    onCancel: params.onCancel || noop
  }


  // Container

  setElm(container, containerElm)

  container.elm.style.width     = size(params.width)
  container.elm.style.height    = size(params.height)
  container.elm.style.overflow  = 'hidden'
  container.elm.style.cursor    = '-webkit-grab'
  container.width = params.width
  container.height = params.height
  container.ratio = params.width / params.height

  container.elm.onmousedown = (event) => {
    drag.initMousePos = {
      top: event.pageY,
      left: event.pageX
    }

    drag.initImgPos = {
      top: img.offsetTop,
      left: img.offsetLeft
    }

    container.elm.style.cursor = '-webkit-grabbing'
    container.draggable = true
  }


  // Zoom

  if (params.zoom) {
    let delta
    let newWidth
    let newHeight
    let newOffsetTop
    let newOffsetLeft

    setElm(zoom, params.zoom.inElm, 'inElm')
    setElm(zoom, params.zoom.outElm, 'outElm')

    zoom.step = params.zoom.step || 0.01
    zoom.value = params.zoom.init || 0

    zoom.inElm.onclick  = () => {
      delta = 1
      resizeImage()
    }
    zoom.outElm.onclick = () => {
      delta = -1
      resizeImage()
    }

    function checkWidth(next) {
      if (newWidth < container.width) {
        newWidth      = container.width
        newHeight     = img.height * newWidth / img.width
        newOffsetLeft = 0
      } else {
        if (newWidth - Math.abs(img.offsetLeft) < container.width) {
          newOffsetLeft = container.width - newWidth
        } else {
          newOffsetLeft = img.offsetLeft * newWidth / img.width
        }

        next && next()
      }
    }

    function checkHeight(next) {
      if (newHeight < container.height) {
        newHeight     = container.height
        newWidth      = img.width * newHeight / img.height
        newOffsetTop  = 0
      } else {
        if (newHeight - Math.abs(img.offsetTop) < container.height) {
          newOffsetTop = container.height - newHeight
        } else {
          newOffsetTop = img.offsetTop * newHeight / img.height
        }

        next && next()
      }
    }

    function resizeImage(initial) {
      if (!initial) {
        zoom.value += zoom.step * delta
      }

      if (zoom.value < 0) {
        return zoom.value = 0
      }

      newWidth   = img.initWidth + img.initWidth * zoom.value
      newHeight  = img.initHeight + img.initHeight * zoom.value

      // min height priory
      if (img.ratio > container.ratio) {
        checkHeight(checkWidth)
      }
      // min width priory
      else {
        checkWidth(checkHeight)
      }

      img.width       = newWidth
      img.height      = newHeight
      img.offsetTop   = newOffsetTop
      img.offsetLeft  = newOffsetLeft

      img.elm.style.width       = size(newWidth)
      img.elm.style.height      = size(newHeight)
      img.elm.style.marginTop   = size(newOffsetTop)
      img.elm.style.marginLeft  = size(newOffsetLeft)
    }
  }


  // Image

  img.elm = new Image()

  img.elm.onmousedown = (event) => {
    event.preventDefault()
    return false
  }

  img.elm.onload = function() {
    img.width       = img.elm.width
    img.height      = img.elm.height
    img.ratio       = img.elm.width / img.elm.height

    let newWidth
    let newHeight

    if (img.ratio > container.ratio) {
      newHeight = container.height
      newWidth  = img.width * newHeight / img.height
    } else {
      newWidth  = container.width
      newHeight = img.height * newWidth / img.width
    }

    newWidth  = getInitialSize(newWidth, params.zoom)
    newHeight = getInitialSize(newHeight, params.zoom)

    const offsetTop  = getInitialOffset(newHeight, params.top)
    const offsetLeft = getInitialOffset(newWidth, params.left)

    img.initWidth   = newWidth
    img.initHeight  = newHeight
    img.width       = newWidth
    img.height      = newHeight
    img.offsetTop   = offsetTop
    img.offsetLeft  = offsetLeft

    img.elm.style.width       = size(newWidth)
    img.elm.style.height      = size(newHeight)
    img.elm.style.marginTop   = size(offsetTop)
    img.elm.style.marginLeft  = size(offsetLeft)

    container.elm.appendChild(img.elm)
  }

  img.elm.onerror = () => {
    console.error('CoverEditor: Image loading error')
  }

  img.elm.src = src


  // Events

  document.onmousemove = (event) => {
    if (container.draggable) {
      let newOffsetTop  = event.pageY - drag.initMousePos.top + drag.initImgPos.top
      let newOffsetLeft = event.pageX - drag.initMousePos.left + drag.initImgPos.left

      if (container.height == img.height) {
        newOffsetTop = 0
      } else {
        if (newOffsetTop > 0) {
          newOffsetTop = 0
        }
        else if (Math.abs(newOffsetTop) + container.height > img.height) {
          newOffsetTop = -1 * Math.abs(img.height - container.height)
        }
      }

      if (container.width == img.width) {
        newOffsetLeft = 0
      } else {
        if (newOffsetLeft > 0) {
          newOffsetLeft = 0
        }
        else if (Math.abs(newOffsetLeft) + container.width > img.width) {
          newOffsetLeft = -1 * Math.abs(img.width - container.width)
        }
      }

      img.offsetTop   = newOffsetTop
      img.offsetLeft  = newOffsetLeft

      img.elm.style.marginTop   = size(newOffsetTop)
      img.elm.style.marginLeft  = size(newOffsetLeft)
    }
  }

  document.onmouseup = () => {
    container.elm.style.cursor = '-webkit-grab'
    container.draggable = false
  }
}

CoverEditor.prototype.save = function () {
  this.events.onSave({
    zoom:   Number(this.state.zoom.value.toFixed(3)),
    top:    Number(Math.abs(this.state.img.offsetTop / this.state.img.height).toFixed(3)),
    left:   Number(Math.abs(this.state.img.offsetLeft / this.state.img.width).toFixed(3))
  })
}

CoverEditor.prototype.cancel = function () {

}


export default CoverEditor
