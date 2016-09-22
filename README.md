<p>
  <img src="./images/logo.jpg" height="80" />
</p>

# Cover Editor

Page Cover editor (like FB)

[![Npm Version](https://badge.fury.io/js/cover-editor.svg)](https://www.npmjs.com/package/cover-editor)
[![Month Downloads](https://img.shields.io/npm/dm/cover-editor.svg)](http://npm-stat.com/charts.html?package=cover-editor)
[![Npm Licence](https://img.shields.io/npm/l/cover-editor.svg)](https://www.npmjs.com/package/cover-editor)

[![NPM](https://nodei.co/npm/cover-editor.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/cover-editor/)


## Overview

![Example](./images/example.jpg)


## Usage

```javascript
const params = JSON.parse(localStorage.getItem('cover-editor:params'))

new CoverEditor(findDOMNode(this.refs.cover), {
  src: '/images/cover.jpg',
  initialParams: params,
  navig: {
    scaleUp: DOM_ELEMENT,
    scaleDown: DOM_ELEMENT,
    save: DOM_ELEMENT,
  },
  onSave: (params) => {
    localStorage.setItem('cover-editor:params', JSON.stringify(params.initialParams))
  },
  onCancel: () => {}
})
```
