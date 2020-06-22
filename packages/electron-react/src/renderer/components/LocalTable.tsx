import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { UserDocType } from "../types";
import paginationFactory from "react-bootstrap-table2-paginator";
import { fdb } from "../service/firestore/app";
import { getDocs } from "../databases/db/service";
import { Button, Card } from "react-bootstrap";

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
];
const collectionName = "test_users";

export function LocalTable() {
  const [users, setUsers] = useState<UserDocType[]>([]);

  useEffect(() => {
    getDocs(1000, 1).then((newUsers) => {
      setUsers(newUsers);
    });
  }, []);

  const reloadTable = () => {
    getDocs(1000, 1).then((newUsers) => {
      setUsers(newUsers);
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
      <BootstrapTable
        keyField="id"
        data={users}
        columns={columns}
        pagination={paginationFactory({ sizePerPage: 5 })}
      />
    </div>
  );
}

export default LocalTable;
