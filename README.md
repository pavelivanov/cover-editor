<p>
  <img src="./images/logo.jpg" height="80" />
</p>

# Cover Editor

Tiny (2 kb gzipped) page cover editor (like FB does).

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

[pavelivanov.info/projects/cover-editor](http://pavelivanov.info/projects/cover-editor)
