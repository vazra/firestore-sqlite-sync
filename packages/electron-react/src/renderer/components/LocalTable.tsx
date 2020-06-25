import React, { useState, useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { Button } from "react-bootstrap";
import { IDoc } from "../service/sync/firesync";
import { getAllFromTable } from "../service/sqlite";

export const ColumnNames: IDoc = {
  name: "Name",
  phone: "Phone No",
  address: "Address",
  area: "Area",
  id: "ID",
  pid: "Product ID",
  category: "Category",
};

interface ILocalTable {
  collection: string;
}

export function LocalTable({ collection }: ILocalTable) {
  const [items, setItems] = useState<IDoc[]>([]);

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
    getAllFromTable(collection).then((newUsers) => {
      setItems(newUsers);
    });
  }, [collection]);

  const reloadTable = () => {
    getAllFromTable(collection).then((newUsers) => {
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
        <BootstrapTable
          keyField="id"
          data={items}
          columns={columns}
          pagination={paginationFactory({ sizePerPage: 5 })}
        />
      )}
    </div>
  );
}

export default LocalTable;
