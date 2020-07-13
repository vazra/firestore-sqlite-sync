# Example : electron-react

Example based on electron [electron-react-pro](http://github.com/electronreact/electron-react-pro)

## Usage :

1. go to example directory
1. install deps `yarn`
1. run example with `yarn dev`

by default the example is linked with the lib files in the root dir. You have two options

1. Use the latest release from npm (simpler option)<br/>
   change the lib reference to latest version available in npm, by
   ```
   yarn add @firestore-sqlite-sync/core
   yarn add @firestore-sqlite-sync/react
   ```
2. Build and use the lib to get pre-release version
   for this, go to root directory and run `yarn && yarn build`. Then go back to the example directory and run `yarn dev`
