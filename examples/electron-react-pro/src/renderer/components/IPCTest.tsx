import React, { useState, useEffect } from 'react'
import { useBackbone } from '../providers/BackboneProvider'
import sqlite3, { Database } from 'better-sqlite3'

export function IPCTest() {
  const [result, setResult] = useState<string>('N/A')
  const [dbURL, setDBURL] = useState<string>('')
  const [db, setDB] = useState<Database | ''>('')
  const [num, setNum] = useState<number>(5)
  const { send } = useBackbone()

  useEffect(() => {
    const db = window.sqlitedb // dbURL && new sqlite3(dbURL)
    // setDB(db)
    const row = db && db.prepare('SELECT * FROM persons').get()
    console.log('getPersons', row)
    console.log(JSON.stringify(row))
  }, [dbURL])

  return (
    <div>
      {num}
      <button
        onClick={async () => {
          setNum(num + 1)
          console.log('ppp factorial:', num)
          let resp = await send('make-factorial', { num: num })
          console.log('ppp res:', resp)
          setResult(`Fact(${num} => ${resp})`)
        }}>
        Compute factorial
      </button>
      <button
        onClick={async () => {
          let resp = await send('get-persons', {})
          console.log('ppp res: (get-persons)', resp)
          setResult(`Persons : (${resp})`)
        }}>
        Get From DB
      </button>
      <button
        onClick={async () => {
          setNum(num + 1)
          let resp = await send('add-person', { num: num })
          console.log('ppp res: (add-person)', resp)
          setResult(`Added - (${resp})`)
        }}>
        Add to DB
      </button>
      <button
        onClick={async () => {
          console.log('ppp phone call')
          let resp = await send('ring-ring', { message: 'this is james' })
          console.log('ppp res:', resp)
          setResult(resp as string)
        }}>
        Make phone call
      </button>
      <button
        onClick={async () => {
          console.log('click - get db ')
          let resp = await send('get-db', {})
          console.log('ppp res(get-db):', resp)
          setDBURL(resp as string)
        }}>
        GetDB
      </button>
      <div>{result}</div>
      <div> DB : {JSON.stringify(db)} </div>
    </div>
  )
}

export default IPCTest
