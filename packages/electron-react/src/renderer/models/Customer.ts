import faker from "faker";

interface ICustomer {
  name: string;
  phone: string;
  address: string;
  area: string;
}

export class Customer extends BaseModel implements ICustomer {
  name: string;
  phone: string;
  address: string;
  area: string;
  constructor(doc: ICustomer) {
    super();
    this.name = doc.name;
    this.phone = doc.phone;
    this.address = doc.address;
    this.area = doc.area;
  }

  static crateDummy() {
    var name = faker.name.findName();
    var phone = faker.phone.phoneNumber();
    var address = faker.address.streetAddress();
    var area = faker.address.countryCode();
    return new Customer({ name, phone, address, area });
  }
}
