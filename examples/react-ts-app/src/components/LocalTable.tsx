import React, { useState, useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button } from "react-bootstrap";
import { useSync } from "../providers/SyncProvider";
import { IDoc, ISync, readDocs } from "../../../../packages/core/src";

export const ColumnNames: IDoc = {
  name: "Name",
  phone: "Phone No",
  address: "Address",
  area: "Area",
  id: "ID",
  pid: "Product ID",
  category: "Category",
  desc: "Description",
};

const getAllFromTable = async (sync: ISync, tableName: string) => {
  return await readDocs("users", 1000, 0);
  // const db = await sync.db
  // console.log('kkk getAllFromTable db', db)
  // return await db(tableName).select()
};

interface ILocalTable {
  collection: string;
}

export function LocalTable({ collection }: ILocalTable) {
  const [items, setItems] = useState<IDoc[]>([]);

  const syncObj = useSync();

  const columns = useMemo(() => {
    // get colemns from the first item keys
    if (items.length > 0) {
      const keys = Object.keys(items[0]);
      return keys.map((akey) => ({
        dataField: akey,
        text: ColumnNames[akey],
      }));
    }
    return [];
  }, [items]);

  useEffect(() => {
    syncObj &&
      getAllFromTable(syncObj, collection).then((newUsers) => {
        setItems(newUsers);
      });
  }, [syncObj, collection]);

  const reloadTable = () => {
    syncObj &&
      getAllFromTable(syncObj, collection).then((newUsers) => {
        setItems(newUsers);
      });
  };

  return (
    <div>
      <div className="py-3">
        <Button
          variant="outline-secondary"
          onClick={() => {
            reloadTable();
          }}
        >
          Reload
        </Button>
      </div>
      {columns && columns.length > 0 && (
        <BootstrapTable keyField="id" data={items} columns={columns} pagination={paginationFactory({ sizePerPage: 5 })} />
      )}
    </div>
  );
}

export default LocalTable;
