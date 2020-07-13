import { makeFactorial, ringring } from './math'
import { THandlers } from '~/main/types'
import { getPersons, addPerson, getDB } from './sqlite3/helpers'

let handlers: THandlers = {}

// math
handlers['make-factorial'] = makeFactorial
handlers['ring-ring'] = ringring

// db
handlers['get-persons'] = getPersons
handlers['add-person'] = addPerson
handlers['get-db'] = getDB

export default handlers
