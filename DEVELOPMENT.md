# Development

## Developing Modules

### Module

- Use the latest version of `core` in your module: `npm i @rhidium/core@latest`
- Start the build in watch mode: `npm run build:watch` (needs compiled code)

### Client

- Use the latest version of `core` in your client/bot that's using the module: `npm i @rhidium/core@latest`
- Install the local package: `npm install ../my-new-module`
- Start in development mode, only transpiles: `npm run dev`

## Multiple links

This describes a development workflow for working on both `/core` and a `/module`.

There seem to be common issues when linking multiple packages: [ref](https://stackoverflow.com/questions/44515865/package-that-is-linked-with-npm-link-doesnt-update)

An alternative to using unique versions each time is to `npm remove` all libraries that will be linked locally

### Clearing existing development cache

- `npm rm -g @rhidium/core @rhidium/manage-modules` anywhere

### Core

- Set a unique version number in `package.json` - somethings that's never been used or published before
  - I usually append 99 to the curr version
- `npm run build`, followed by `npm link`

### Module

- `npm link @rhidium/core@unique-version`
- Set a unique version number in `package.json` - somethings that's never been used or published before
  - I usually append 99 to the curr version
- `npm run build`, followed by `npm link`

### Client

- `npm link @rhidium/core@unique-version @rhidium/manage-modules@unique-version` in template/client
- Creates new builds, compile `manage-modules` in watch mode: `tsc -w`
- `npm run dev` in template/client
