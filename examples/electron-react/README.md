# electron-react-pro

> WARNING! Through this stack is promising, its not yet production ready, as Parcel do not support many native functionalities. So for the time being please use https://github.com/vazra/electron-webpack-typescript-react . when Parcel is ready for production, this repo will be updated with the new stack.

> <img src="https://electronjs.org/images/favicon.ico" width="16"> + <img src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-32.png" width=16> + <img src="https://parceljs.org/assets/parcel@2x.png" width=16> + = ❤️

[![Stars][badge_github_stars]][github_stars]
[![Follow][github_followers]][github_follow]
[![Fork][badge_github_fork]][github_fork]

[![Website][badge_website]][website]
[![Fork][badge_github_issues]][github_issues]

## Scripts :

`yarn dev` => open dev env, in watch mode.

> process.env.NODE_ENV variable to development
> generates source maps and doesn't do any minification

`yarn start` => build and open electron with prod env.

> process.env.NODE_ENV variable to production

`yarn pack` => package the app.

`yarn ship` => deploy the app.

`yarn test` => run all tests.

## Features

- Production Ready.
- Based on latest stable Electron (Ver. 9)
- Based on latest stable React JS (Ver. 16.13)
- First hand typescript support (completely written in TS)
- Auto update without any config (thanks to electron builder )
- Supports Electron native modules.(thanks to electron builder )
  - Realm, SQLite, LevelDB etc.
- React Fast Refresh supported.
  Quick development without reloading , state will be preserved
- Better Tree-shaking support (tanks to parcel)

- (?) CLI included.

## Why I built the boilerplate.

- tried may other boilerplates.
- my experiments
- leaned the best practices.

### Why Parcel? why not webpack?

- speed
- user-friendliness
- less configurations.
- differential serving and compiling inline scripts and styles without any configuration
- Using a HTML file as the entrypoint makes Parcel easier to use as it will be able to detect dependencies directly from the HTML file and bundle all these detected dependencies into their respective bundles automatically without any configuration

### Why

## TODO :

- use standard JS

## FAQ

- How to use Fast refresh?
- How to use Native?

## Folder Structure

## Libraries Used
