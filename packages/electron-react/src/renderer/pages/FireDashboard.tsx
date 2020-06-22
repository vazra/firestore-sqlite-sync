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

export function FireDashboard() {
  const [users, setUsers] = useState<UserDocType[]>();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [addCount, setAddCount] = useState<number>(100);
  const [progress, setProgress] = useState<number>(0);
  const [sizePerPage, setSizePerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setLoading] = useState<[boolean, string]>([false, ""]);
  const [latestReadTime, setLatestReadTime] = useState<[number, number]>([
    334.54,
    20,
  ]);
  const [latestWriteTime, setLatestWriteTime] = useState<[number, number]>([
    334.54,
    20,
  ]);

  useEffect(() => {
    // create the databse
    async function anyNameFunction() {
      setLoading([true, "initializing database"]);
      await addUserstoDB(100, setProgress, setLatestWriteTime);
      setLoading([false, ""]);
    }
    anyNameFunction();
  }, []);

  const reloadUI = async () => {
    setUsers([]);
    setProgress(0);
    setTotalCount(0);
    setPage(1);
    setSizePerPage(10);
    getDocsAndCount(sizePerPage, page);
  };

  async function getDocsAndCount(perPageCount: number, pageNo: number) {
    const count = await getCount();
    setTotalCount(count);
    const newUsers = await getDocs(perPageCount, pageNo, setLatestReadTime);
    setUsers(newUsers);
  }

  useEffect(() => {
    console.log("pagechanged - ", "getDocsAndCount", page, sizePerPage);
    getDocsAndCount(sizePerPage, page);
  }, [page, sizePerPage]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setAddCount(+e.target.value);
    setProgress(0);
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProgress(0);
    await addUserstoDB(addCount, setProgress, setLatestWriteTime);
    setAddCount(100);
    getDocsAndCount(sizePerPage, page);
  };

  const handleTableChange = (
    type: TableChangeType,
    { page, sizePerPage }: TableChangeState<any>
  ) => {
    setPage(page);
    setSizePerPage(sizePerPage);
  };

  const progressInstance = (
    <ProgressBar now={progress} label={`${progress}%`} />
  );
  return (
    <>
      <Row>
        <Col>
          <h3>FireStore Data</h3>
        </Col>
        <Col>
          <h3>Local Data</h3>
        </Col>
      </Row>

      <Row>
        <Col>
          <FireTable />
        </Col>
        <Col>
          <LocalTable />
        </Col>
      </Row>
    </>
  );
}

export default FireDashboard;
