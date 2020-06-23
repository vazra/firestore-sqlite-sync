import { Customer } from "../../models";

import { db } from "./database";
import { Model } from "trilogy";

const personSchema = {
  name: String,
  phone: String,
  address: String,
  area: String,
  id: "increments",
};

const TABLE_NAME_CUSTMERS = "customers";

export class customerCollection {
  static async insert(customer: Customer) {
    const { name, phone, address, area } = customer;
    await db
      .knex<Customer>(TABLE_NAME_CUSTMERS)
      .insert({ name, phone, address, area });
  }

  static async bulkInsert(customers: Customer[]) {
    const custDocs = customers.map((cust) => {
      const { name, phone, address, area } = cust;
      return { name, phone, address, area };
    });
    await db.knex<Customer>(TABLE_NAME_CUSTMERS).insert(custDocs);
  }

  // gets all customers, with pagination
  static async getAll(skip: number = 0, count: number = 1000) {
    // await (await db.knex<Customer>(TABLE_NAME_CUSTMERS)).;
  }

  // search the name, phone, or address of the customer
  static search(query: string, limit: number = 5) {}
}
