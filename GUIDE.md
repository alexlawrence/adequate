# Guide

This page provides a step-by-step walk-through of all the features of adequate and their possibilities.

## Installation

adequate can be integrated in a website in at least three different ways

### Installation via npm

Ideally, the package is installed via npm as a local dependency:

```sh
npm i --save --save-exact adequate
```

The installed package exposes an ESM module by default and further contains a standalone file to be directly integrated in a browser. There is also TypeScript support.

```javascript
// ESM
import { element, html, useState } from 'adequate';
// CJS
const { element, html, useState } = require('adequate');
```

### Github Release download

### CDNs

unpkg

There are  possibilities for integrating adequate in a project. For one, it can be included as ES Module, which exports an object with the properties `element()`, `render()` and `useState()`. Alternatively, it can be included as a standalone file that defines the object `adequate` on `window`. In this case, the three previously mentioned functions are defined as properties `e`, `h` and `u`. 

more following soon...

<!-- 
watch out for native event handlers, always quote attributes 

-->

