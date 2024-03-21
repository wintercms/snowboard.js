---
layout: default
title: The Snowboard instance
parent: Concepts
nav_order: 1
---

# The Snowboard instance

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

The Snowboard instance is (loosely) bound to the current page for the purpose of determining readiness, but is otherwise independent and not reliant on anything from the DOM. By itself, Snowboard only provides a basic amount of functionality, it is the [plugins](plugins.md) that provide the actual usable functionality.

The purposes of the Snowboard instance are to:

- Instantiate, manage and route events to [plugins](plugins.md) and [singletons](plugins.md#singletons)
- Define available [abstracts](abstracts.md) and [traits](traits.md)
- Create and remove ad-hoc [event listeners](events.md)
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

## Adding plugins

The main ability of Snowboard is to load [plugins](plugins.md) and access instances of these plugins. You may simply use the `addPlugin()` method to load a plugin in Snowboard.

```js
Snowboard.addPlugin('myPlugin', MyPlugin);
```

The `addPlugin()` method expects two parameters:

- The first parameter defines the name of the plugin within Snowboard, as a string. You may call your plugin whatever you wish.
- The second parameter defines the instance constructor. In general, you should provide the "definition" of an instance as a class or object, not an actual instantiated object.

See the [plugins](plugins.md) page for what is expected in a plugin. Plugin names are case-insensitive.

## Getting a plugin instance

After a plugin is loaded, it is made available as a method in the `Snowboard` instance using the name you defined the plugin is. For example, if a plugin were added with the `myPlugin` name like above, then you can call the `myPlugin` method on the `Snowboard` instance itself to get a new instance of that plugin.

```js
const myPlugin = Snowboard.myPlugin();
```

This can be called anywhere where the Snowboard framework is available, even within another plugin.

If the plugin is defined as a [singleton](plugins.md#singletons), then you will always receive the *same* singular instance.

## Removing or replacing a plugin

You can remove a plugin easily through Snowboard - just use the `removePlugin()` method, providing the registered plugin's name as the first parameter.

```js
Snowboard.removePlugin('myPlugin');
```

If any instances of the plugin are in use, these will be [destructed](plugins.md#destructing-a-plugin).

One particular case where this may be useful is in replacing a plugin with your own version of a plugin. Say you have downloaded another person's plugin and wish to use your own with some additional or replaced functionality, you can simply remove the original plugin and replace the plugin with your own using the same name.

```js
Snowboard.removePlugin('flash');
Snowboard.addPlugin('flash', MyFlash);
```

## The `PluginLoader` instance

When you add a plugin to the Snowboard instance, it is represented by a `PluginLoader` instance. The `PluginLoader` instance is a [factory](https://en.wikipedia.org/wiki/Factory_(object-oriented_programming)) - it takes a representation of the plugin instance and creates new instances as required, and acts as a bridge between Snowboard and each instance of the plugin.

The `PluginLoader` instance will:

- Provide new instances of the plugin, or provide a singular instance of a singleton, loading any traits required by the plugin as needed.
- Allow calling a plugin methods statically.
- Provide [mocking](mocking.md) capabilities.
- Determine dependency requirements for a plugin.

You will seldom need to interface directly with a `PluginLoader` instance, but if you do ever need to, you can retrieve the `PluginLoader` instance by using the `getPlugin()` method in the Snowboard instance, providing the name of the registered plugin in the

```js
const myPluginLoader = Snowboard.getPlugin('myPlugin');
```

If you wish to get all plugin loaders as an object, with the registered plugin name as the key and the `PluginLoader` instance for that plugin as the value, you may also use the `getPlugins()` method.

```js
const pluginLoaders = Snowboard.getPlugins();
```
