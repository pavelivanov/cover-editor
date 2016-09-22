<p>
  <img src="./images/logo.jpg" height="80" />
</p>

# Cover Editor

Page Cover editor (like FB)

[![Npm Version](https://badge.fury.io/js/cover-editor.svg)](https://www.npmjs.com/package/cover-editor)
[![Month Downloads](https://img.shields.io/npm/dm/cover-editor.svg)](http://npm-stat.com/charts.html?package=cover-editor)
[![Npm Licence](https://img.shields.io/npm/l/cover-editor.svg)](https://www.npmjs.com/package/cover-editor)


## Install

```bash
npm install --save cover-editor
```


## Overview

<p>
  <img src="./images/example.jpg" height="240" />
</p>


## Usage

```javascript
new CoverEditor(DOM_ELEMENT, {
  src: '/images/cover.jpg',
  navig: {
    scaleUp: DOM_ELEMENT,
    scaleDown: DOM_ELEMENT,
    save: DOM_ELEMENT,
    cancel: DOM_ELEMENT,
  },
  onSave: (params) => {},
  onCancel: () => {}
})
```


## Props

`new CoverEditor(DOM_ELEMENT, props)`

name | type | description
---- | ---- | -----------
src | String | Path to cover image
storageKey | String | LocalStorage key for saving and loading `initialParams`
initialParams | Object | Initial params to load image position and scaling. Check structure in **Note #1**
navig | Object | Set of elements to navigate in Cover. `scaleUp` and `scaleDown` for scaling image. `save` triggers `onSave` handler. `cancel` triggers `onCancel` handler.
onSave | Function | Handler which has one argument. Check structure in **Note #1**
onCancel | Function |


#### Note #1

```javascript
{
  originalWidth: Number,
  originalHeight: Number,
  initialParams: {
    originalWidth: Number,
    originalHeight: Number,
    width: Number,
    height: Number,
    scale: Number,
    scaleMin: Number,
    top: Number,
    left: Number
  },
  cropArea: {
    width: Number,
    height: Number,
    top: Number,
    left: Number,
  }
}
```


## Example

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import CoverEditor from 'cover-editor'

import coverImage from './images/cover.jpg'


export default class App extends React.Component {
  componentDidMount() {
    const coverElm       = ReactDOM.findDOMNode(this.refs.cover)
    const scaleUpElm     = ReactDOM.findDOMNode(this.refs.scaleUp)
    const scaleDownElm   = ReactDOM.findDOMNode(this.refs.scaleDown)
    const saveElm        = ReactDOM.findDOMNode(this.refs.save)
    const cancelElm      = ReactDOM.findDOMNode(this.refs.cancel)

    new CoverEditor(coverElm, {
      src: coverImage,
      storageKey: 'cover-editor:params',
      navig: {
        scaleUp:    scaleUpElm,
        scaleDown:  scaleDownElm,
        save:       saveElm,
        cancel:     cancelElm,
      },
      onSave: this.save,
      onCancel: this.cancel,
    })
  }

  save = (params) => {

  }

  cancel = () => {

  }

  render() {
    return (
      <div>
        <div>
          <div ref="scaleUp">{' + '}</div>
          <div ref="scaleDown">{' - '}</div>
        </div>

        <div>
          <Button ref="save">{'Save'}</Button>
          <Button ref="cancel">{'Cancel'}</Button>
        </div>

        <div ref="cover" style={{ width: 600, height: 300 }}></div>
      </div>
    )
  }
}
```
