import React, { useState, useEffect } from "react";
import { Button, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import faker from "faker";
import { useSync } from "../providers/SyncProvider";
import { IDoc, insertWithSync } from "@firestore-sqlite-sync/core";
interface IAddUserToFire {
  tableName: string;
}

const crateDummy = (tableName: string) => {
  if (tableName === "customers") {
    // console.log("Creating a new dummy customer");
    const name = faker.name.findName();
    const phone = faker.phone.phoneNumber();
    const address = faker.address.streetAddress();
    const area = faker.address.countryCode();
    return { name, phone, address, area };
  } else if (tableName === "products") {
    // console.log("Creating a new dummy product");
    const name = faker.commerce.productName();
    const category = faker.commerce.productMaterial();
    const description = faker.lorem.slug(5);
    const pid = faker.random.alphaNumeric(8);
    return { name, category, pid, description };
  } else {
    return { name: faker.name.findName() };
  }
};

export function AddUserToFire({ tableName }: IAddUserToFire) {
  const [newItem, setNewItem] = useState<IDoc>(crateDummy(tableName));
  const [loading, setLoading] = useState<boolean>(false);
  const sync = useSync();

  useEffect(() => {
    setNewItem(crateDummy(tableName));
  }, [tableName]);

  return (
    <OverlayTrigger
      overlay={
        <Tooltip id="tooltip">
          <div>
            <h6>New User</h6>
            <p>
              {Object.keys(newItem).map((aKey) => (
                <span key={aKey}>
                  {aKey} : {newItem[aKey]}
                  <br />
                </span>
              ))}
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
              sync && (await insertWithSync(sync, tableName, newItem));
              setNewItem(crateDummy(tableName));
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
