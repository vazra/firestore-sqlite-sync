import { timeStamp, fdb } from "./app";
import { UserDocType } from "../../types";

export const addAUser = (user: UserDocType) => {
  return fdb.collection("test_users").add({
    created_time: timeStamp(),
    updated_time: timeStamp(),
    name: user.name,
    phone: user.phone,
    address: user.address,
    area: user.area,
  });
};
