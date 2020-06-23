# Firebase Firestore -> SQLite , selective sync (Electron React App in TypeScript)

> Electron React App in TypeScript

* bootstraped with [`electron-webpack-typescript-react boilerplate`](https://github.com/vazra/electron-webpack-typescript-react) which is based in `electron-webpack`.
* Uses SQLite as local databse 
* Uses Firestore as remote database
* Sync selected data from Firestore to Local SQLite databse, for efficient offline support and permomance improvement 

## Getting Started

Simply fork/clone this repository, install dependencies, and try `yarn dev`.

```bash
# clone thee repo
mkdir electron-react-dbs && cd electron-react-dbs
git clone https://github.com/vazra/sqlite-firestore-sync.git
cd electron-react-dbs

# install dependencies
yarn

# run in dev mode
yarn dev

```

You will be able to tryout all the databases available.

The use of the [yarn](https://yarnpkg.com/) package manager is **strongly** recommended, as opposed to using `npm`.

## FAQ

1. Can I use this as a boilerplate for my electron-react app with native databases

   Ans. Yes, you can. this project itself is bootstrapped with [`electron-react boilerplate`](https://github.com/vazra/electron-webpack-typescript-react) You can either take it as the base project or fork this repo and remove unwanted db codes. 

For any bugs or requests create issues [here](https://github.com/vazra/sqlite-firestore-sync/issues)

Pull requests are also invited. :rocket:
