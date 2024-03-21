---
layout: default
title: The Snowboard instance
parent: Concepts
nav_order: 1
---

# The Snowboard instance {: .no_toc }

The central instance in any Snowboard-built application.
{: .fs-6 .fw-300 }

<details open markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

The Snowboard instance is the main instance used in any application built using the Snowboard framework. It can be thought of as a [container](https://en.wikipedia.org/wiki/Containerization_(computing)) - an isolated environment in which plugins and functionality are loaded and executed in a given scope.

The Snowboard instance is (loosely) bound to the current page for the purpose of determining readiness, but is otherwise independent and not reliant on anything from the DOM. By itself, Snowboard only provides a basic amount of functionality, it is the [plugins](plugins) that provide the actual usable functionality.

The purposes of the Snowboard instance are to:

- Instantiate, manage and route events to [plugins](plugins) and [singletons](plugins#singletons)
- Define available [abstracts](abstracts) and [traits](traits)
- Create and remove ad-hoc [event listeners](events)
- Log messages to Console.

## Defining an instance

Defining a Snowboard instance is dependent on the method you used to install Snowboard. See the [Getting Started](../introduction/getting-started) page for the available methods of installation.

If you chose to install Snowboard using the **browser-based method**, an instance of Snowboard is available globally via the `window.Snowboard` variable in JavaScript. As long as your plugins, abstracts, traits and listeners are executed *after* the `snowboard.js` script tag, you need only use the `Snowboard` global variable to execute the Snowboard instance's functionality.

If you instead chose to use the **Node-based method**, you will need to create an instance of Snowboard yourself and build a JavaScript bundle using your compilation tool of choice (such as [Webpack](https://webpack.js.org/) or [Vite](https://vitejs.dev/)).

For example, to make a build of Snowboard in Node and make it available globally as `Snowboard` like the browser version above, you could use:

```js
import { Snowboard } from '@wintercms/snowboard';

((window) => {
    const app = new Snowboard();

    // Add any plugins, traits and abstracts here...

    window.Snowboard = app;
})(window);
```

The method above uses a "self-executing" function, linked to the `window` global variable, and creates the Snowboard instance then populates it in `window.Snowboard`, thereby making it available globally in your JavaScript after this.
