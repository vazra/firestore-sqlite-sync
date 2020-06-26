import { TABLE_SYNC_STATUS } from "./database";
import Knex from "knex";

export const getLastUpdatedTimeFromDB = async (
  dbPromise: Promise<Knex<any, unknown[]>>,
  tableName: string
) => {
  try {
    let lastUpdatedTimestamp = 0;
    const localDb = await dbPromise;
    const queryRes = await localDb(TABLE_SYNC_STATUS)
      .where({ id: tableName })
      .select("ut");

    if (queryRes.length > 0) {
      lastUpdatedTimestamp = +queryRes[0].ut;
    }
    return Promise.resolve(lastUpdatedTimestamp);
  } catch (err) {
    return Promise.reject(err);
  }
};

// get a milli sec timestamp to the db
export const saveLastUpdatedTimeToDB = async (
  dbPromise: Promise<Knex<any, unknown[]>>,
  tableName: string,
  time: number
) => {
  try {
    const localDb = await dbPromise;
    /*const queryRes = */ await localDb(TABLE_SYNC_STATUS)
      .where({ id: tableName })
      .update("ut", time);
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};
