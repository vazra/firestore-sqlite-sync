import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { UserDocType } from "../types";
import paginationFactory from "react-bootstrap-table2-paginator";
import { fdb } from "../service/firestore/app";
import { Button, Card, Spinner } from "react-bootstrap";
import AddUserToFire from "./AddUserToFire";
import cellEditFactory from "react-bootstrap-table2-editor";
const collectionName = "test_users";

const deleteFormatter = (cell, row) => (
  <span
    onClick={() => {
      fdb.collection(collectionName).doc(cell).delete();
    }}
  >
    ❌
  </span>
);

const columns = [
  {
    dataField: "name",
    text: "Name",
  },
  {
    dataField: "phone",
    text: "Phone No",
  },
  {
    dataField: "address",
    text: "Address",
  },
  {
    dataField: "area",
    text: "Area",
  },
  {
    dataField: "id",
    text: "Delete",
    formatter: deleteFormatter,
  },
];

export function FireTable() {
  const [users, setUsers] = useState<UserDocType[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    return fdb.collection(collectionName).onSnapshot(function (querySnapshot) {
      var newUsers = [];
      querySnapshot.forEach(function (doc) {
        const userDoc = { id: doc.id, ...doc.data() };
        newUsers.push(userDoc);
        console.log("userDoc :", userDoc);
      });
      setUsers(newUsers);
      console.log(`Updated ${querySnapshot.length} users `);
    });
  }, []);

  const handleTableChange = async (
    type,
    { data, cellEdit: { rowId, dataField, newValue } }
  ) => {
    setLoading(true);
    console.log("Editing id ", rowId);
    const updateDoc = {};
    updateDoc[dataField] = newValue;
    await fdb.collection(collectionName).doc(rowId).update(updateDoc);
    setLoading(false);
  };

  return (
    <div>
      <div className="py-3">
        <AddUserToFire />
        {isLoading && (
          <Spinner className="p-3" animation="grow" variant="warning" />
        )}
      </div>
      <BootstrapTable
        remote={{ cellEdit: true }}
        keyField="id"
        data={users}
        columns={columns}
        cellEdit={cellEditFactory({
          mode: "click",
        })}
        pagination={paginationFactory({ sizePerPage: 5 })}
        onTableChange={handleTableChange}
      />
    </div>
  );
}
// export function FireTable() {
//   const [users, setUsers] = useState<UserDocType[]>([]);

//   useEffect(() => {
//     return fdb.collection(collectionName).onSnapshot(function (querySnapshot) {
//       var newUsers = [];
//       querySnapshot.forEach(function (doc) {
//         newUsers.push(doc.data());
//       });
//       setUsers(newUsers);
//       console.log(`Updated ${querySnapshot.length} users `);
//     });
//   }, []);

//   return (
//     <div>
//       <div className="py-3">
//         <AddUserToFire />
//       </div>
//       <BootstrapTable
//         keyField="id"
//         data={users}
//         columns={columns}
//         pagination={paginationFactory({ sizePerPage: 5 })}
//       />
//     </div>
//   );
// }

export default FireTable;
