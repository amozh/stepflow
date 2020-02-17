# About
See [information about the product](PRODUCT.md)

See [used technologies](TECHNOLOGIES.md)

# Installation
### MySql
Required versions
- **mysql** - v8.0 or higher
#### Install server
Download and install MySql server from https://dev.mysql.com/downloads/mysql/
#### Install MySql Workbench
Download and install MySql server from https://dev.mysql.com/downloads/workbench/ 
#### Create database schema
After both MySql server and Workbench are installed, open MySql Workbench and you will see a `localhost` connection available - connect to it.

Execute next script to create database
```
create schema stepflow CHARACTER SET utf8mb4;
``` 
#### Update `ormconfig.json`
Set your `username` and `password` configured while database installation. 

### Application
Required Versions:
- **node** - ~ v12.13 or higher
- **npm** - v6.12 or higher
- **yarn** - v1.21 or higher
- **vue** - v4.1.1 or higher
- **nest** - v6.5.9 or higher
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
#### Install packages
In the project root execute
```sh
yarn install
```
In case of errors with dependencies - run this command for each module

# Run the application
After all required packages are installed you should be able to run the application.
### Run both UI, API and Shared in watch mode
``
yarn dev:all:start
``
This will also create tables in database schema and will populate initial data. See `WorkflowService.onModuleInit`
### Run API in watch mode
``
yarn dev:api:start
``
This will also create tables in database schema and will populate initial data. See `WorkflowService.onModuleInit`
### Run Shared in watch mode
``
yarn dev:shared:start
``

# Project structure
### Directory Structure
- `root`: Project root holds all the fies of the project
    - `api`: A Nest project created using nest-cli
    - `ui`: A Vue project created using vue-cli
    - `shared`: A shared module for common code sharing across projects in this work space.

# How to
### Code Scaffolding
- #### VueJS
    - `cd ui`
    - `# Run any vue-cli commands in here`
- #### NestJS
    - `cd api`
    - `# Run any nest-cli commands in here ex: nest g m <module-name>`
- #### Shared (Typescript)
    - `cd shared`
    - `# Creae any number of codes that you want to share and make sure you export the files in index.ts`
       
### Scripts
### Get started
* `yarn dev:all:start` - Starts Development server for shared, vue and nest,
* `yarn dev:all:build` - Builds shared, vue and nest,
* `yarn dev:ui:start` - Starts vue development nest,
* `yarn dev:ui:build` - Builds vue,
* `yarn dev:ui:lint` - Lints vue,
* `yarn test:ui:unit` - Unit testing for vue,
* `yarn test:ui:e2e` - End to End testing for vue,
* `yarn dev:api:start` - Starts nest development server,
* `yarn dev:api:build` - Builds nest,
* `yarn dev:api:lint` - Lints nest,
* `yarn prod:api:start` - Starts nest in production mode,
* `yarn dev:shared:start` - Starts shared development nest,
* `yarn dev:shared:build` - Builds shared,
* `yarn dev-shared:vue:start` - Starts shared and vue in development mode,
* `yarn dev-shared:api:start` - Starts shared and nest in development mode,
* `yarn dev-shared:vue:build` - Builds shared and vue,
* `yarn dev-shared:api:build` - Builds shared and nest,
* `yarn utils:remove-node-modules` - Removes all node_modules folders

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Andrii Mozharovskyi - andrii.mozharovskyi@gmail.com