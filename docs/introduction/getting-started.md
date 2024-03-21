---
layout: default
title: Getting Started
parent: Introduction
nav_order: 2
---

# Getting Started

Snowboard.JS can be used completely standalone or as a module into your application - the choice is very much yours and dependent on the needs of your application.

Snowboard is published in two versions - a **browser-based** version that is standalone and can be used simply by importing a JavaScript file into your HTML, or a **Node-based** version which can be imported into your application through the `import` declaration and built using your favourite compilation tool, such as Webpack or Vite.

## Browser-based version

The browser-based version is the much simpler option for people who just want to get straight into it. The browser-based version is a simple, self-contained JavaScript file that can be downloaded from the [Snowboard.js](https://github.com/wintercms/snowboard.js) repository.

[Download latest minified Snowboard.js](https://github.com/wintercms/snowboard.js/releases/latest/download/snowboard.min.js) {: .btn .btn-purple }
[Download latest unminified Snowboard.js](https://github.com/wintercms/snowboard.js/releases/latest/download/snowboard.js) {: .btn }

Once downloaded, you may make it web-accessible and include it in your HTML. It is best to include the script at the bottom of the HTML, just before the closing `</body>` tag.

```html
    <!-- ... -->

    <script src="https://mywebsite.com/assets/js/snowboard.js"></script>
</body>
</html>
```

The browser-based version automatically populates the Snowboard framework into the global variable `window.Snowboard` (or just `Snowboard`).

## Node-based version

The Node-based version gives you more flexibility when building your app, and allows you to create a bundle of Snowboard and your own functionality. You can install Snowboard via NPM to take advantage of this:

```bash
npm install --save @wintercms/snowboard
```

When using this method, you must initialize the Snowboard framework yourself in an "app" or "base" script, and then use a compiling tool such as [Webpack](https://webpack.js.org/) or [Vite](https://vitejs.dev/) to build the bundle. An example base script would look like this:

```js
import { Snowboard } from '@wintercms/snowboard';

((window) => {
    const app = new Snowboard();

    // Add any plugins, traits and abstracts here...

    window.Snowboard = app;
})(window);
```

Then you can simply include the entire bundle in your app.

```html
    <!-- ... -->

    <script src="https://mywebsite.com/assets/js/app.js"></script>
</body>
</html>
```
