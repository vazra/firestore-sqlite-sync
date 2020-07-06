declare module "constants" {
    export const CNAME_SETTINGS = "settings";
    export const DOC_NAME_LAST_UPDATED = "lastUpdated";
}
declare module "firestore/utils" {
    import firebase from 'firebase/app';
    import 'firebase/firestore';
    import { ISync } from "firesync";
    import { IDoc } from "index";
    export const serverTime: typeof firebase.firestore.FieldValue.serverTimestamp;
    export const Timestamp: typeof firebase.firestore.Timestamp;
    export type IFireDB = firebase.firestore.Firestore;
    export const dataFromSnapshot: (snapshot: firebase.firestore.DocumentData) => IDoc | undefined;
    export const updateWithSync: (sync: ISync, collectionId: string, docId: string, data: IDoc) => Promise<void>;
    export const insertWithSync: (sync: ISync, collectionId: string, data: IDoc) => Promise<void>;
}
declare module "firestore/index" {
    export * from "firestore/utils";
}
declare module "localdb/db" {
    export const db: any;
}
declare module "localdb/controller" {
    import { IDoc } from "index";
    export const createTables: () => void;
    export const resetDB: () => void;
    export const upsertDocs: (table: string, docs: IDoc[]) => void;
    export const readDocs: (tablename: string, count: number, skip: number) => any;
    export const search: (tablename: string, query: string, order: string[], count: number) => void;
    export const getLastUpdatedTimeFromDB: (collection: string) => number;
    export const setLastUpdatedTimeToDB: (collection: string, time: number) => void;
}
declare module "localdb/index" {
    export * from "localdb/controller";
}
declare module "firesync" {
    import { IFireDB } from "firestore/index";
    import { IDoc } from "index";
    class Sync {
        lastUpdated: IDoc;
        listner: () => void;
        firedb: IFireDB;
        constructor(firedb: IFireDB);
        private _createSyncListner;
        _syncTable(tableName: string): Promise<void>;
    }
    export const initSync: (firedb: IFireDB) => Sync;
    export type ISync = InstanceType<typeof Sync>;
}
declare module "types" {
    export type IField = [string, 'string' | 'number'];
    export type ICollectionDetails = {
        list: string[];
        fields: {
            [key: string]: IField[];
        };
    };
    export type IDoc = {
        [key: string]: any;
    };
    export type ISyncConfig = {
        enabled?: boolean;
        cooldownTime?: number;
        updatedTimeKey?: string;
        settingsCollectionName?: string;
        dbpath: string;
        collections: {
            [key: string]: IField[];
        };
    };
}
declare module "index" {
    export * from "firesync";
    export * from "firestore/index";
    export * from "types";
}
declare module "config" {
    import { ISyncConfig, ICollectionDetails } from "index";
    export const SYNC_CONFIG: ISyncConfig;
    export const WatchingCollections: ICollectionDetails;
}
