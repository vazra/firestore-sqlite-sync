import React, { useState, useEffect, useMemo } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import { Button } from 'react-bootstrap'
import { IDoc, FireSync } from '@firestore-sqlite-sync/core'
import { useSync } from '@firestore-sqlite-sync/react'

// TODO (test) : what will happen if the sqlite got hangged or got deleted for some external reason while in use.

export const ColumnNames: IDoc = {
  name: 'Name',
  phone: 'Phone No',
  address: 'Address',
  area: 'Area',
  id: 'ID',
  pid: 'Product ID',
  category: 'Category',
  desc: 'Description',
}

const getAllFromTable = async (sync: FireSync, tableName: string) => {
  return sync.localDB.readDocs(tableName, 100, 0)
}

interface ILocalTable {
  collection: string
}

export function LocalTable({ collection }: ILocalTable) {
  const [items, setItems] = useState<IDoc[]>([])

  const syncObj = useSync()

  const columns = useMemo(() => {
    // get colemns from the first item keys
    if (items.length > 0) {
      let keys = Object.keys(items[0])
      keys = keys.filter((k) => k !== 'id')

      return keys.map((akey) => ({
        dataField: akey,
        text: ColumnNames[akey],
      }))
    }
    return []
  }, [items])

  useEffect(() => {
    syncObj &&
      getAllFromTable(syncObj, collection).then((newUsers) => {
        setItems(newUsers)
      })
  }, [syncObj, collection])

  const reloadTable = () => {
    syncObj &&
      getAllFromTable(syncObj, collection).then((newUsers) => {
        setItems(newUsers)
      })
  }

  return (
    <div>
      <div className='py-3'>
        <Button
          variant='outline-secondary'
          onClick={() => {
            reloadTable()
          }}>
          Reload
        </Button>
      </div>
      {columns && columns.length > 0 && (
        <BootstrapTable keyField='id' data={items} columns={columns} pagination={paginationFactory({ sizePerPage: 5 })} />
      )}
    </div>
  )
}

export default LocalTable
