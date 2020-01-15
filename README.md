## Directory Structure

- `root`: Project root holds all the fies of the project
    - `apps`: Holds client(VueJS) and server(NestJS) projects
        - `vue`: A Vue project created using vue-cli
        - `nest`: A Nest project created using nest-cli
    - `libs`: Holds all the common codes you can share between projects
        - `shared`: A shared module for common code sharing across projects in this work space.

## How to

- ### Code Scaffolding
    - #### VueJS
        - `cd apps/vue`
        - `# Run any vue-cli commands in here`
     - #### NestJS
       - `cd apps/nest`
       - `# Run any nest-cli commands in here ex: nest g m <module-name>`
     - #### Shared (Typescript)
       - `cd libs/shared`
       - `# Creae any number of codes that you want to share and make sure you export the files in index.ts`
       
## Scripts

### Get started
* `yarn dev:all:start` - Starts Development server for shared, vue and nest,

### Other
* `yarn dev:all:build` - Builds shared, vue and nest,
* `yarn dev:vue:start` - Starts vue development nest,
* `yarn dev:vue:build` - Builds vue,
* `yarn dev:vue:lint` - Lints vue,
* `yarn test:vue:unit` - Unit testing for vue,
* `yarn test:vue:e2e` - End to End testing for vue,
* `yarn dev:nest:start` - Starts nest development server,
* `yarn dev:nest:build` - Builds nest,
* `yarn dev:nest:lint` - Lints nest,
* `yarn prod:nest:start` - Starts nest in production mode,
* `yarn dev:shared:start` - Starts shared development nest,
* `yarn dev:shared:build` - Builds shared,
* `yarn dev-shared:vue:start` - Starts shared and vue in development mode,
* `yarn dev-shared:nest:start` - Starts shared and nest in development mode,
* `yarn dev-shared:vue:build` - Builds shared and vue,
* `yarn dev-shared:nest:build` - Builds shared and nest,
* `yarn utils:remove-node-modules` - Removes all node_modules folders

# Installation
## Prerequisites

Tools and Services needed to run this app.

#### node
For Mac and Windows download and install from https://nodejs.org/uk/download/

#### yarn
For Windows download and install from https://yarnpkg.com/lang/en/docs/install/#windows-stable

For Mac follow instructions at https://yarnpkg.com/lang/en/docs/install/#mac-stable

#### nestjs
```sh
# Mac and Linux using nvm (node-version-manager)
npm i -g @nestjs/cli
```

#### Required Versions

- **node** - ~ v12.13 or higher
- **npm** - v6.12 or higher
- **yarn** - v1.21 or higher
- **vue** - v4.1.1 or higher
- **nest** - v6.5.9 or higher

## Install packages
```sh
yarn install
```
In case of errors with dependencies - run this command for each module

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Andrii Mozharovskyi - andrii.mozharovskyi@gmail.com