# Static Boilerplate

A fast, scalable, modular static boilerplate for rapid front-end development.

## Features

- Local development server.
- Scalable and modular architecture.
- Markup, Sass and JavaScript linting.
- JavaScript bundling, transpiling and minification.
- Sass preprocessing, bundling, auto-prefixing and minification.
- Static asset optimization.
- Build command to generate a deployment ready archive.

## System Requirements

You'll need the following installed on your machine.

1.  [Node.js](https://nodejs.org/en/download/)

## Dependencies

These dependencies are already included for you (via CDN for performance).

1. [Animate On Scroll](https://michalsnik.github.io/aos/)
2. [Object Fit Polyfill](https://www.npmjs.com/package/objectFitPolyfill)
3. [Body Scroll Lock](https://www.npmjs.com/package/body-scroll-lock)

## Setup

**1. Clone the repository and install dependencies with NPM**

To set up the static boilerplate, simply clone the git repository and run NPM install.

```
$ git clone https://github.com/louis-young/static-boilerplate.git
$ npm install
```

**2. Run**

Tasks:

- `$ npm start` - start the local development server and compile files.
- `$ npm run lint` - lint scripts, stylesheets and markup.
- `$ npm run package` - generate a production archive and directory for deployment.

Simply run any command in the project root directory such as:

`$ npm start`

## Architecture

The root contains three directories:

- `configuration`
-
- `node_modules`

- `public`

`configuration` contains the configuration for the linters as well as the main Gulp file.

`node_modules` can be ignored as they never need to be edited. They are automatically populated based on the dependencies when installed.

`public` contains two directories:

- `dist`

- `src`

`dist` contains a compiled version of the source code/assets which is read-only (do not touch).

`src` contains the working source code.

`src` contains three directories:

- `assets` - contains all of the static assets used in the project such as images, videos, etc.

- `scripts` - contains your JavaScript (including frameworks and libraries which aren't included via CDN).

- `stylesheets` - contains the Sass architecture.

## Markup

Markup is linted for code quality automatically for you. You can add as many markup files as you wish within the `src` directory. Subdirectories are supported.

## Scripts

Scripts are linted automatically for you to ensure a high code standard and fewer errors at runtime.

The `scripts` directory should contains a `vendor` subdirectory if using frameworks and libraries that are not included via a CDN.

The `entry.js` file in located in the root of `scripts`.

The JavaScript structure is as follows:

- `public/src/scripts/entry.js` - The entry file for bundling.

- `public/src/scripts/animation.js` - The file which instantiates the Animate On Scroll library.

You can add as many files to the `scripts` directory as you wish and import them in `entry.js` and these will be bundled, transpiled and minified for production. Subdirectories are supported.

## Stylesheets

[https://sass-guidelin.es/#architecture](https://sass-guidelin.es/#architecture)

## Compilation

### Sass

Every Sass file and partial is linted, compiled, minified, prefixed and bundled in to the `main.min.css` file.

### JavaScript

You can place multiple scripts in any of the scripts directories and import them in the `entry.js` file. These will all be bundled and processed for you.

### Assets

Static assets are automatically compressed/optimised and moved to the `dist` directory. This supports most common static asset file types and also supports subdirectories.

If you remove an asset from `src`, it will automatically be removed from `dist`.

## Miscellaneous

### Linting

All of your markup, Sass and JavaScript is automatically linted on change. The output will appear in the console and will prevent poor code, bad conventions and will help to lower the amount of silent/runtime errors.

This can also be run as a separate task by running `$ npm run lint`.

The linters can be individually configured by editing the associated linter configuration file in the `configuration` directory.

### Sourcemaps

When using compilers and combining files, you need to keep track (a map) of where this code originated from. This helps immensely when debugging a project as you can see which file an error originated from, and view the associated source code.

Simply use developer tools as you would usually, it's all handled for you.

### Convention

#### BEM

The boilerplate strictly enforces the Block Element Modifier [BEM](http://getbem.com/) methodology.

#### ES6+

The static boilerplate strictly enforces abiding by ES6+ convention. The source code is transpiled for production so you don't need to worry about browser targets.

### Browsers

The static boilerplate is cutting edge, using a mix of the latest technologies. For this reason, it supports most modern browsers.

Currently, the main browser target list is:

1. Chrome
2. Firefox
3. Opera
4. Safari
5. Edge
