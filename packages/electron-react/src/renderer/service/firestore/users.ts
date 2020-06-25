import { serverTime, fdb } from "./app";
import { IDoc, CNAME_SETTINGS, DOC_NAME_LAST_UPDATED } from "../sync/firesync";

export const addToFire = async (collectionName: string, data: IDoc) => {
  try {
    await fdb.collection(collectionName).add({
      ct: serverTime(),
      ut: serverTime(),
      ...data,
    });
    const updateDoc: IDoc = {};
    updateDoc[collectionName] = serverTime();

    await fdb
      .collection(CNAME_SETTINGS)
      .doc(DOC_NAME_LAST_UPDATED)
      .update(updateDoc);
    Promise.resolve();
  } catch (err) {
    console.warn(err);
    Promise.reject(err);
  }
};

export const updateAnItem = async (
  collectionName: string,
  id: string,
  doc: IDoc
) => {
  try {
    await fdb
      .collection(collectionName)
      .doc(id)
      .update({ del: true, ut: serverTime() });
    const updateDoc: IDoc = {};
    updateDoc[collectionName] = serverTime();

    await fdb
      .collection(CNAME_SETTINGS)
      .doc(DOC_NAME_LAST_UPDATED)
      .update(updateDoc);
    Promise.resolve();
  } catch (err) {
    console.warn(err);
    Promise.reject(err);
  }
};

export const deleteAnItem = async (collectionName: string, id: string) => {
  try {
    await fdb
      .collection(collectionName)
      .doc(id)
      .update({ del: true, ut: serverTime() });
    const updateDoc: IDoc = {};
    updateDoc[collectionName] = serverTime();

    await fdb
      .collection(CNAME_SETTINGS)
      .doc(DOC_NAME_LAST_UPDATED)
      .update(updateDoc);
    Promise.resolve();
  } catch (err) {
    console.warn(err);
    Promise.reject(err);
  }
};
