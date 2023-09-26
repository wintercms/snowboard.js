# Snowboard.js Base

Standalone version of the [Winter CMS](https://wintercms.com) JavaScript framework that provides a simple yet powerful system for organising and controlling your frontend functionality. The main aims of the framework are to provide a familiar development experience for people using the Winter or Laravel PHP frameworks to develop functionality for their frontend interfaces.

## Features

- Structured development experience using ES6 classes, with support for abstract classes, traits and extensions.
- Flexible plugin architecture with support for reusable plugins and singletons.
- Simple state and events management, operating across the entire app.
- Lightweight, only ~51kb minified, with minimal dependencies.
- Can be used directly with a `<script>` tag or through a build process (Webpack, Rollup, Laravel Mix, etc.).

## Installation

### Via a script tag

This framework can be included directly in your app through a `<script>` tag. Download the [latest release](https://github.com/wintercms/snowboard.js/releases) in the **Assets** tab and place it somewhere web-accessible, then include it in your page (generally just above the closing `</body>` tag).

```html
<script src="https://my.app.com/snowboard.min.js"></script>
```

This will autoload the Snowboard framework and make it available globally via the `Snowboard` variable. This allows you to add any plugins or extended functionality by simply loading in some JavaScript after the Snowboard script tag.

```html
<script>
Snowboard.addPlugin('myPlugin', MyPlugin);
Snowboard.on('ready', () => {
    console.log('Snowboard is ready to go!');
});
</script>
```

### Via ES6 import

If you are using a build process such as Webpack, Rollup, Laravel Mix, etc, you can also set up your app to import Snowboard and create an app ready for use.

Your project must be enabled with NPM, (ie. it should have a `package.json` file), then you can simply include Snowboard as a dependency:

```bash
npm i -S @wintercms/snowboard
```

Then, in your entrypoint script, create the application:

```js
import { Snowboard } from '@wintercms/snowboard';
import MyPlugin from './plugins/MyPlugin';

const app = new Snowboard();
app.addPlugin('myPlugin', MyPlugin);
app.on('ready', () => {
    console.log('Snowboard is ready to go!');
});

export default app;
```

## Documentation

Please see the [Snowboard documentation](https://wintercms.com/docs/v1.2/docs/snowboard/introduction) on Winter CMS.

## What's included

By default, the Base Snowboard package comes included with the following:

### Abstracts

- **PluginBase** - The base class used for all Snowboard plugins.
- **Singleton** - The base class used for all Snowboard singletons.

### Traits

- **Configurable** - Allows a plugin to derive configuration from data attributes and get and set configuration on the fly.
- **FiresEvents** - Provides the plugin with the ability to fire local and global JavaScript events, and allows outside functionality to listen to events on the plugin instance.

### Utilities

- **AssetLoader** - Allows the loading of CSS, JavaScript and image assets on the fly.
- **Cookie** - Provides a thin wrapper around the [JS Cookie](https://github.com/js-cookie/js-cookie) library to allow management of cookies.
- **JsonParser** - Provides a looser implementation of JSON, based off the [JSON5](https://json5.org/) library that accounts for many human errors with writing compliant JSON.
- **Sanitizer** - Provides sanitization of HTML documents and elements for common XSS vulnerabilities.
- **Url** - Provides URL handling.

## More information

For more information on development and usage of this framework and available packages, please see the main repository: https://github.com/wintercms/snowboard.js

## Security vulnerabilities

Please review [our security policy](https://github.com/wintercms/snowboard.js/security/policy) on how to report security vulnerabilities.

## License

This framework is licensed under the MIT license.
