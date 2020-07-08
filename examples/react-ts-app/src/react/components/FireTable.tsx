import React, { useState, useEffect, useMemo } from "react";
import BootstrapTable, { TableChangeType, TableChangeState } from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { fdb } from "../service/firestore/app";
import { Spinner } from "react-bootstrap";
import AddUserToFire from "./AddUserToFire";
import cellEditFactory from "react-bootstrap-table2-editor";
import { dataFromSnapshot } from "../service/firestore/helpers";
import { IDoc, updateWithSync } from "@firestore-sqlite-sync/core";
import { ColumnNames } from "./LocalTable";

import { useSync } from "../providers/SyncProvider";

interface IFireTable {
  collection: string;
}

export function FireTable({ collection }: IFireTable) {
  const [items, setItems] = useState<IDoc[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const sync = useSync();

  const deleteFormatter = (cell: string | undefined, row: any) => (
    <span
      onClick={async () => {
        setLoading(true);
        sync && cell && updateWithSync(sync, collection, cell, { del: true });
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
      const keys = Object.keys(items[0]).filter((aKey) => !removeList.includes(aKey));

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
      const newItemList: IDoc[] = [];
      querySnapshot.forEach(function (doc) {
        const itemDoc = dataFromSnapshot(doc); //{ id: doc.id, ...doc.data() };
        if (itemDoc?.ut) itemDoc.ut = itemDoc.ut.toDate().toString();
        if (itemDoc?.ct) itemDoc.ct = itemDoc.ct.toDate().toString();
        if (itemDoc?.updatedTime) itemDoc.updatedTime = itemDoc.updatedTime.toDate().toString();
        itemDoc && newItemList.push(itemDoc);
      });
      setItems(newItemList);
      // console.log(`Updated ${querySnapshot.docs.length} users `);
    });
  }, [collection]);

  const handleTableChange = async (type: TableChangeType, { data, cellEdit: { rowId, dataField, newValue } }: TableChangeState<any>) => {
    setLoading(true);
    console.log("Editing id ", rowId);
    const updateDoc: { [key: string]: any } = {};
    updateDoc[dataField] = newValue;
    sync && (await updateWithSync(sync, collection, rowId, updateDoc));
    setLoading(false);
  };

  return (
    <div>
      <div className="py-3">
        <AddUserToFire tableName={collection} />
        {isLoading && <Spinner className="p-3" animation="grow" variant="warning" />}
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

export default FireTable;
