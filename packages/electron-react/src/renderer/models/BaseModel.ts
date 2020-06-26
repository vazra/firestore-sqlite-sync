import { IDoc } from "../service/sync";

export abstract class BaseModel {
  abstract fields: string[];
  public toDoc() {
    const aDoc: IDoc = {};
    for (const aField of this.fields) {
      // TODO : there should have some method to make sure that all items in fields are available as key
      aDoc[aField] = this[aField as keyof this];
    }
    console.log("Doc Value : ", aDoc);
    return aDoc;
  }

  public static fromDoc<T extends BaseModel>(this: new () => T, doc: any): T {
    const newItem = new this();
    if (doc === undefined) return newItem;

    for (const aField of newItem.fields) {
      newItem[aField as keyof T] = doc[aField];
    }
    console.log("New BaseModel : ", newItem);
    return newItem;
  }
}
