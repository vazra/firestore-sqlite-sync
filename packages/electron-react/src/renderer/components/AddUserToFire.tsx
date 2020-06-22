import React, { useState } from "react";
import {
  Container,
  Card,
  Button,
  Spinner,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { UserDocType } from "../types";
import { createAUser } from "../utils";
import { addAUser } from "../service/firestore/users";

// interface IAddUserToFire {
//   children: React.ReactNode;
// }

export function AddUserToFire() {
  const [newUSer, setNewUser] = useState<UserDocType>(createAUser());
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <OverlayTrigger
      overlay={
        <Tooltip id="tooltip">
          <div>
            <h6>New User</h6>
            <p>
              Name : {newUSer.name} <br />
              Phone : {newUSer.phone} <br />
              Address : {newUSer.address} {newUSer.name} <br />
              Area : {newUSer.area} <br />
            </p>
          </div>
        </Tooltip>
      }
    >
      <span className="d-inline-block">
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Button
            onClick={async () => {
              setLoading(true);
              await addAUser(createAUser());
              setNewUser(createAUser());
              setLoading(false);
            }}
          >
            Add
          </Button>
        )}
      </span>
    </OverlayTrigger>
  );
}

export default AddUserToFire;
