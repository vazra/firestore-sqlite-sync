import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Form,
  ProgressBar,
  Spinner,
  ButtonGroup,
  Card,
} from "react-bootstrap";
import RemoteTable from "../components/RemoteTable";
import { TableChangeType, TableChangeState } from "react-bootstrap-table-next";
import { UserDocType } from "../types";
import {
  addUserstoDB,
  getCount,
  getDocs,
  deleteAllUsers,
} from "../databases/db/service";
import AddUserToFire from "../components/AddUserToFire";
import FireTable from "../components/FireTable";
import LocalTable from "../components/LocalTable";
const tableList = ["table1", "tabl2", "table3"];

export function FireDashboard() {
  const [tableName, setTableName] = useState<string>(tableList[0]);
  return (
    <>
      <Row>
        <Col>
          <div className="pb-3 mb-3 d-flex justify-content-center">
            <ButtonGroup aria-label="Adapters">
              {tableList.map((tname) => (
                <Button
                  key={tname}
                  onClick={async () => {
                    setTableName(tname);
                  }}
                  variant={tableName === tname ? "info" : "outline-info"}
                >
                  {tname}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>FireStore Data</h3>
        </Col>
        <Col>
          <h3>Local SQLite Data</h3>
        </Col>
      </Row>

      <Row>
        <Col>
          <FireTable collection={tableName} />
        </Col>
        <Col>
          <LocalTable collection={tableName} />
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            * This table syncs with Firestore using realtime updates, so the
            latest data available in firestore will be shown here. <br />* Cells
            are editable, click on any cells to edit, the edit will be reflected
            in firestore <br />* deleting a row will create a 'deleted' field
            for the row in the firestore. and will not be fetched
          </p>
        </Col>
        <Col>
          <p>
            * This table shows data from local sqlite database, it may not be
            realtime, so to view the latest data use 'reload' button <br />* to
            start the sync process from firestore to sqlite db use 'sync' button
          </p>
        </Col>
      </Row>
    </>
  );
}

export default FireDashboard;
