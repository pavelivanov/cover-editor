function size(value) {
  return value + 'px'
}


const CoverEditor = function (containerElm, options) {
  const defaultOpts = {
    scaleStep: 0.03,
    initialParams: null,
  }

  const opts = {}

  for (const key in defaultOpts) {
    opts[key] = key in options ? options[key] : defaultOpts[key]
  }


  // LocalStorage params ----------------------------------------- /

  if (opts.storageKey && localStorage) {
    const params = JSON.parse(localStorage.getItem(opts.storageKey))

    if (params) {
      opts.initialParams = params
    }
  }


  // Drag -------------------------------------------------------- /

  const drag = {}


  // Scale ------------------------------------------------------- /

  const scale = {}

  scale.min   = 1
  scale.value = opts.initialParams && opts.initialParams.scale || 1

  scale.up    = () => scaleImage(1)
  scale.down  = () => scaleImage(-1)

  const checkWidth = (sizes, next) => {
    if (sizes.width < container.width) {
      sizes.width   = container.width
      sizes.height  = img.height * sizes.width / img.width
      sizes.left    = 0
    } else {
      if (sizes.width - Math.abs(img.left) < container.width) {
        sizes.left = container.width - sizes.width
      } else {
        sizes.left = img.left * sizes.width / img.width
      }

      next && next(sizes)
    }
  }

  const checkHeight = (sizes, next) => {
    if (sizes.height < container.height) {
      sizes.height  = container.height
      sizes.width   = img.width * sizes.height / img.height
      sizes.top     = 0
    } else {
      if (sizes.height - Math.abs(img.top) < container.height) {
        sizes.top = container.height - sizes.height
      } else {
        sizes.top = img.top * sizes.height / img.height
      }

      next && next(sizes)
    }
  }

  const scaleImage = (delta) => {
    if (delta < 0 && scale.value + opts.scaleStep * delta <= scale.min) {
      return
    }

    scale.value += opts.scaleStep * delta

    const sizes = {
      width: 0,
      height: 0,
      top: 0,
      left: 0
    }

    sizes.width   = Number(img.originalWidth * scale.value)
    sizes.height  = Number(img.originalHeight * scale.value)

    sizes.top     = Number(img.top - img.top * opts.scaleStep * delta)
    sizes.left    = Number(img.left - img.left * opts.scaleStep * delta)

    // min height priory
    if (img.ratio > container.ratio) {
      checkHeight(sizes, checkWidth)
    }
    // min width priory
    else {
      checkWidth(sizes, checkHeight)
    }

    img.width   = sizes.width
    img.height  = sizes.height
    img.top     = sizes.top
    img.left    = sizes.left

    img.elm.style.width       = size(img.width)
    img.elm.style.height      = size(img.height)
    img.elm.style.marginTop   = size(img.top)
    img.elm.style.marginLeft  = size(img.left)
  }


  // Container --------------------------------------------------- /

  const container = {}

  container.elm                 = containerElm
  container.elm.style.overflow  = 'hidden'
  container.elm.style.cursor    = '-webkit-grab'
  container.width               = container.elm.clientWidth
  container.height              = container.elm.clientHeight
  container.ratio               = container.width / container.height


  // Image ------------------------------------------------------- /

  const img = {}

  img.elm = new Image()

  img.elm.onmousedown = (event) => {
    event.preventDefault()
    return false
  }

  img.elm.onload = function() {
    img.originalWidth   = img.elm.width
    img.originalHeight  = img.elm.height
    img.ratio           = img.originalWidth / img.originalHeight

    let width
    let height
    let top
    let left

    if (opts.initialParams) {
      width   = opts.initialParams.width
      height  = opts.initialParams.height
      top     = opts.initialParams.top
      left    = opts.initialParams.left

      if (opts.originalWidth != img.originalWidth) {
        const serverCropRatio = img.originalWidth / opts.initialParams.originalWidth

        scale.value = opts.initialParams.scale / serverCropRatio
        scale.min   = opts.initialParams.scaleMin / serverCropRatio
      }
      else {
        scale.value = opts.initialParams.scale
        scale.min   = opts.initialParams.scaleMin
      }
    }
    else {
      if (img.ratio > container.ratio) {
        height  = container.height
        width   = img.originalWidth * height / img.originalHeight
        top     = 0
        left    = Number(((container.width - width) / 2).toFixed(2))

        scale.value = scale.min = Number((container.height / img.originalHeight).toFixed(2))
      }
      else {
        width   = container.width
        height  = img.originalHeight * width / img.originalWidth
        top     = Number(((container.height - height) / 2).toFixed(2))
        left    = 0

        scale.value = scale.min = Number((container.width / img.originalWidth).toFixed(2))
      }
    }

    img.width   = width
    img.height  = height
    img.top     = top
    img.left    = left

    img.elm.style.width       = size(img.width)
    img.elm.style.height      = size(img.height)
    img.elm.style.marginTop   = size(img.top)
    img.elm.style.marginLeft  = size(img.left)

    container.elm.appendChild(img.elm)
  }

  img.elm.onerror = () => {
    console.error('CoverEditor: Image loading error')
  }

  img.elm.src = options.src


  // Methods ------------------------------------------------------ /

  const save = () => {
    if (typeof options.onSave == 'function') {
      const originalWidth   = Number(img.originalWidth)
      const originalHeight  = Number(img.originalHeight)

      const initialParams = {
        originalWidth,
        originalHeight,
        width:    Number(img.width),
        height:   Number(img.height),
        scale:    Number(scale.value),
        scaleMin: Number(scale.min),
        top:      Number(img.top),
        left:     Number(img.left)
      }

      const cropArea = {}

      cropArea.width    = Math.floor(container.width / scale.value)
      cropArea.height   = Math.floor(container.height / scale.value)
      cropArea.top      = Math.abs(Math.floor(img.top / scale.value))
      cropArea.left     = Math.abs(Math.floor(img.left / scale.value))

      if (cropArea.width > img.originalWidth) {
        cropArea.height  = Math.floor(img.originalWidth * cropArea.height / cropArea.width)
        cropArea.width   = img.originalWidth
      }

      if (cropArea.height > img.originalHeight) {
        cropArea.width   = Math.floor(img.originalHeight * img.originalHeight  / cropArea.height)
        cropArea.height  = img.originalHeight
      }

      if (cropArea.top + cropArea.height > img.originalHeight) {
        cropArea.top = img.originalHeight - cropArea.height
      }

      if (cropArea.left + cropArea.width > img.originalWidth) {
        cropArea.left = img.originalWidth - cropArea.width
      }

      if (opts.storageKey && localStorage) {
        localStorage.setItem(opts.storageKey, JSON.stringify(initialParams))
      }

      options.onSave({
        originalWidth,
        originalHeight,
        initialParams,
        cropArea
      })
    }
  }

  const cancel = () => {
    if (typeof options.onCancel == 'function') {
      options.onCancel()
    }
  }


  // Events ------------------------------------------------------- /

  options.navig.save && options.navig.save.addEventListener('click', save)
  options.navig.cancel && options.navig.cancel.addEventListener('click', cancel)

  options.navig.scaleUp && options.navig.scaleUp.addEventListener('click', scale.up)
  options.navig.scaleDown && options.navig.scaleDown.addEventListener('click', scale.down)

  container.elm.addEventListener('mousedown', (event) => {
    drag.initMousePos = {
      top: event.pageY,
      left: event.pageX
    }

    drag.initImgPos = {
      top: img.top,
      left: img.left
    }

    container.elm.style.cursor = '-webkit-grabbing'
    container.draggable = true
  })

  document.addEventListener('mouseup', () => {
    container.elm.style.cursor = '-webkit-grab'
    container.draggable = false
  })

  document.addEventListener('mousemove', (event) => {
    if (container.draggable) {
      let top  = event.pageY - drag.initMousePos.top + drag.initImgPos.top
      let left = event.pageX - drag.initMousePos.left + drag.initImgPos.left

      if (container.height == img.height) {
        top = 0
      } else {
        if (top > 0) {
          top = 0
        }
        else if (Math.abs(top) + container.height > img.height) {
          top = -1 * Math.abs(img.height - container.height)
        }
      }

      if (container.width == img.width) {
        left = 0
      } else {
        if (left > 0) {
          left = 0
        }
        else if (Math.abs(left) + container.width > img.width) {
          left = -1 * Math.abs(img.width - container.width)
        }
      }

      img.top   = top
      img.left  = left

      img.elm.style.marginTop   = size(top)
      img.elm.style.marginLeft  = size(left)
    }
  })

}

export default CoverEditor
