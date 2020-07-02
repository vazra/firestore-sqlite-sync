// get a milli sec timestamp from db

import { IDoc, ICollectionDetails } from "../types";
import Knex from "knex";

// filter doc of a specific table
const _filterDoc = (
  doc: IDoc,
  tableName: string,
  collections: ICollectionDetails
) => {
  const newDoc: IDoc = {};
  const allowedFields = collections.fields[tableName];
  allowedFields.push({
    name: "id",
    type: "string",
  });

  for (const aField of allowedFields) {
    // TODO : verify / typecast the values retrieved from firestore to match with types created in the database.
    // TODO : (test) add test to check, what if the firestore gives wrong types of data
    newDoc[aField.name] = doc[aField.name];
  }
  return newDoc;
};

export const insertDataToTable = async (
  dbPromise: Promise<Knex<any, unknown[]>>,
  tableName: string,
  docs: (IDoc | undefined)[],
  collections: ICollectionDetails
) => {
  try {
    // filter non observing fields from data
    const localDb = await dbPromise;
    docs = docs.map((aDoc) => _filterDoc(aDoc || {}, tableName, collections));
    //TODO:  should use upsert here once when https://github.com/knex/knex/pull/3763 gets merged to prod
    // Note the below logic gets the available ids from table first and then update those, and insert the rest. , it is done temporarily until the upsert functionality is available in Knex

    // get available ids to update
    const idList = docs.map((aDoc) => aDoc?.id);
    const deletedCount = await localDb(tableName).whereIn("id", idList).del();
    const resInsert = await localDb(tableName).insert(docs, ["id"]);
    console.log(
      `kkk insertDataToTable deleted(${deletedCount}/${docs.length}) and inserted ${resInsert.length} `
    );

    return Promise.resolve();
  } catch (error) {
    console.log("kkk insertDataToTable error", error);

    return Promise.reject(error);
  }
};
