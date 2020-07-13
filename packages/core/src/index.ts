const dirpath = __dirname.split('node_modules/')[1]
console.log('Loading core module from ', dirpath + '/' + __filename.slice(__dirname.length + 1))

// export { default } from "./firesync";
export * from './firesync'
export * from './types'
export * from './localdb'
export * from './firedb'
