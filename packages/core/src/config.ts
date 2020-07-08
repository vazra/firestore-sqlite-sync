// import { ISyncConfig, ICollectionDetails, IField } from '.'
// import { require as reqLib } from 'app-root-path'
console.warn('Intializing Config')
import defaultConfig from './default.config.json'
import { ISyncConfig, ICollectionDetails, IField } from '.'
// import config from 'fssync.config.json'
// var config = reqLib('/fssync.config.json')

// const config = require('/fssync.config.json')

// TODO : validate congig.json

const electron = require('electron')
const dbpath = (electron.app || electron.remote.app).getPath('userData') + '/db.sqlite3'
console.log(dbpath)

export const SYNC_CONFIG: ISyncConfig = ({ ...defaultConfig, dbpath } as unknown) as ISyncConfig // Be, careful when accessing this, ISyncConfig type may not enforce here, as the data is dynamically loadaed

console.log('kkk SYNC_CONFIG: ', SYNC_CONFIG)
const list = Object.keys(SYNC_CONFIG.collections)
console.log('kkk SYNC_CONFIG - list: ', list)
const objEnttrif = Object.keys(SYNC_CONFIG.collections)
console.log('kkk SYNC_CONFIG - objEnttrif: ', objEnttrif)

const fields = Object.assign({}, ...Object.entries(SYNC_CONFIG.collections).map(([k, v]) => [k, Object.entries(v as IField[])]))
console.log('kkk SYNC_CONFIG - fields: ', JSON.stringify(fields))

export const WatchingCollections: ICollectionDetails = { list, fields }
