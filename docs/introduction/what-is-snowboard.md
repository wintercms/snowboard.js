---
layout: default
title: "Introduction: What is Snowboard.js?"
parent: Introduction
nav_order: 1
---

# What is Snowboard.JS?

An introduction into what Snowboard.js is, and its purpose.
{: .fs-6 .fw-300 }

Snowboard.JS is a unique take on JavaScript development, with the main focus of the framework being to act as a lightweight, centralised application instance and a base to consolidate separate facets of your front-end functionality without imposing any barriers on what libraries and frameworks you wish to use for your user experience.

It borrows a lot from the concepts of modern development in other languages and ports these into JavaScript in order to provide easy code reuse and interoperability, including features such as dependency management, plugins and singletons, traits and more. The plugin system, in particular, has been designed in a way that each plugin can be overridden.

Snowboard.js is built using modern JavaScript syntax, allowing it to be used as a dependency to slot in to your own application, or it can be used directly in the browser by simply including a pre-compiled/transpiled JavaScript file.

## History

Snowboard.JS was originally written for [Winter CMS](https://wintercms.com), a highly-flexible PHP content management framework based off the [Laravel framework](https://laravel.com).

Originally being released in February 2022 with  Winter [v1.1.8](https://github.com/wintercms/winter/releases/tag/v1.1.8), it represented a modern take on the AJAX framework that had been previously used in Winter CMS. The original framework was heavily driven by jQuery and while it served its purpose well, it forced jQuery to be a dependency on every Winter project.

The Winter CMS maintainers decided to develop a pure JavaScript solution with 4 main goals:

- Remain interoperable with the original framework and its features.
- Remove any dependency on jQuery, and keep third-party dependencies to a minimum.
- Easy, comprehensive extensibility and event handling.
- Maintain a small footprint.

Over time, Snowboard.JS increased in capabilities and ease enough that it made a good candidate to be separated from Winter CMS and become standalone, allowing its benefits to be experienced by projects completely outside of Winter.
