import { Statement, Database, Transaction } from 'better-sqlite3'
import { IField, IDoc } from '..'

// creates list of documents that can be inserted to db using the prepared statements
export const prepareDocs = (fields: IField[], data: IDoc[]) => {
  const preparedList = []
  for (const aDoc of data) {
    const newDoc: IDoc = {}

    if (!!aDoc['id']) newDoc['id'] = aDoc['id']
    else continue // if id is not availabe skip the doc

    for (const aField of fields) {
      newDoc[aField[0]] = aDoc[aField[0]] || '' // TODO (test) : should this be null or ''
    }
    preparedList.push(newDoc)
  }
  return preparedList
}
