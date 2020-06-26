import { ISync } from "../sync";

export const getAllFromTable = async (sync: ISync, tableName: string) => {
  const db = await sync.db;
  console.log("kkk getAllFromTable db", db);
  return await db(tableName).select();
};
