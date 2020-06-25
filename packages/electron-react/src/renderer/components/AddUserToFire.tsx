import React, { useState, useEffect } from "react";
import { Button, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { addToFire } from "../service/firestore/users";
import { IDoc } from "../service/sync/firesync";
import faker from "faker";
interface IAddUserToFire {
  tableName: string;
}

const crateDummy = (tableName: string) => {
  if (tableName === "customers") {
    console.log("Creating a new dummy customer");
    var name = faker.name.findName();
    var phone = faker.phone.phoneNumber();
    var address = faker.address.streetAddress();
    var area = faker.address.countryCode();
    return { name, phone, address, area };
  } else if (tableName === "products") {
    console.log("Creating a new dummy product");
    var name = faker.commerce.productName();
    var category = faker.commerce.productMaterial();
    var description = faker.lorem.slug(5);
    var pid = faker.random.alphaNumeric(8);
    return { name, category, pid, description };
  } else {
    return { name: faker.name.findName() };
  }
};

export function AddUserToFire({ tableName }: IAddUserToFire) {
  const [newItem, setNewItem] = useState<IDoc>(crateDummy(tableName));
  const [loading, setLoading] = useState<boolean>(false);

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
              await addToFire(tableName, newItem);
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
