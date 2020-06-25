import React, { useState, useEffect, useMemo } from "react";
import BootstrapTable, {
  TableChangeType,
  TableChangeState,
} from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { fdb } from "../service/firestore/app";
import { Spinner } from "react-bootstrap";
import AddUserToFire from "./AddUserToFire";
import cellEditFactory from "react-bootstrap-table2-editor";
import { dataFromSnapshot } from "../service/firestore/helpers";
import { IDoc } from "../service/sync/firesync";
import { ColumnNames } from "./LocalTable";
import { deleteAnItem, updateAnItem } from "../service/firestore/users";

interface IFireTable {
  collection: string;
}

export function FireTable({ collection }: IFireTable) {
  const [items, setItems] = useState<IDoc[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const deleteFormatter = (cell: string | undefined, row: any) => (
    <span
      onClick={async () => {
        setLoading(true);
        cell && deleteAnItem(collection, cell);
        setLoading(false);
      }}
    >
      ❌
    </span>
  );
  type IColumn = {
    dataField: string;
    text: string;
    formatter?: (cell: string | undefined, row: any) => JSX.Element;
  };

  const columns = useMemo(() => {
    // assuming all items have same keys , get colemns from the first item keys
    if (items.length > 0) {
      // do not show "id","ut","ct" columns
      const removeList = ["id", "ut", "ct"];
      const keys = Object.keys(items[0]).filter(
        (aKey) => !removeList.includes(aKey)
      );

      const theColList: IColumn[] = keys.map((akey) => ({
        dataField: akey,
        text: ColumnNames[akey] || akey,
      }));
      theColList.push({
        dataField: "id",
        text: "Delete",
        formatter: deleteFormatter,
      });
      return theColList;
    }
    return [];
  }, [items]);

  useEffect(() => {
    return fdb.collection(collection).onSnapshot(function (querySnapshot) {
      var newItemList: IDoc[] = [];
      querySnapshot.forEach(function (doc) {
        const itemDoc = dataFromSnapshot(doc); //{ id: doc.id, ...doc.data() };
        if (itemDoc?.ut) itemDoc.ut = itemDoc.ut.toDate().toString();
        if (itemDoc?.ct) itemDoc.ct = itemDoc.ct.toDate().toString();
        itemDoc && newItemList.push(itemDoc);
      });
      setItems(newItemList);
      console.log(`Updated ${querySnapshot.docs.length} users `);
    });
  }, [collection]);

  const handleTableChange = async (
    type: TableChangeType,
    { data, cellEdit: { rowId, dataField, newValue } }: TableChangeState<any>
  ) => {
    setLoading(true);
    console.log("Editing id ", rowId);
    const updateDoc: { [key: string]: any } = {};
    updateDoc[dataField] = newValue;
    await updateAnItem(collection, rowId, updateDoc);
    setLoading(false);
  };

  return (
    <div>
      <div className="py-3">
        <AddUserToFire tableName={collection} />
        {isLoading && (
          <Spinner className="p-3" animation="grow" variant="warning" />
        )}
      </div>
      {columns && columns.length > 0 && (
        <BootstrapTable
          remote={{ cellEdit: true }}
          keyField="id"
          data={items}
          columns={columns}
          cellEdit={cellEditFactory({
            mode: "click",
          })}
          pagination={paginationFactory({ sizePerPage: 5 })}
          onTableChange={handleTableChange}
        />
      )}
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
