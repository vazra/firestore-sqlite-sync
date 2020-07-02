import firebase from "firebase/app";
import "firebase/firestore";
import { IDoc } from "../types";
import { ISync } from "../firesync";
import { CNAME_SETTINGS, DOC_NAME_LAST_UPDATED } from "../constants";

export const serverTime = firebase.firestore.FieldValue.serverTimestamp;
export const Timestamp = firebase.firestore.Timestamp;

export type IFireDB = firebase.firestore.Firestore;

// retrieve data from snapshot with 'id' as a property
export const dataFromSnapshot = (
  snapshot: firebase.firestore.DocumentData
): IDoc | undefined => {
  if (!snapshot.exists) {
    console.log(`404! : dataFromSnapshot(${snapshot.id}) : NOT FOUND!`);
    return undefined;
  }
  const data = snapshot.data() as any;

  return {
    ...data,
    id: snapshot.id,
  };
};

export const updateWithSync = async (
  sync: ISync,
  collectionId: string,
  docId: string,
  data: IDoc
) => {
  try {
    await sync.firedb
      .collection(collectionId)
      .doc(docId)
      .update({ ...data, [sync.config.updatedTimeKey || "ut"]: serverTime() });

    await sync.firedb
      .collection(CNAME_SETTINGS)
      .doc(DOC_NAME_LAST_UPDATED)
      .update({ [collectionId]: serverTime() });
    Promise.resolve();
  } catch (err) {
    console.log("Err in updateWithSync");
    console.warn(err);
    Promise.reject(err);
  }
};

export const insertWithSync = async (
  sync: ISync,
  collectionId: string,
  data: IDoc
) => {
  try {
    await sync.firedb.collection(collectionId).add({
      [sync.config.updatedTimeKey || "ut"]: serverTime(),
      ...data,
    });

    await sync.firedb
      .collection(CNAME_SETTINGS)
      .doc(DOC_NAME_LAST_UPDATED)
      .update({ [collectionId]: serverTime() });
    Promise.resolve();
  } catch (err) {
    console.warn(err);
    Promise.reject(err);
  }
};

// TODO : make firebase as peer dependency
