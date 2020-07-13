import React, { useEffect, useContext } from 'react'
import { NodeIPCClient } from '../types/missing-node-ipc'

type TSend = (
  name: string,
  args: {
    [x: string]: any
  }
) => Promise<unknown>

type TListen = (name: string, cb: Function) => () => void

type TUnlisten = (name: string) => void

type ContextProps = {
  send: TSend
  listen: TListen
  unlisten: TUnlisten
}

type TResolveReject = {
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}

type TReplyHandlers = {
  [key: string]: TResolveReject
}
type TListeners = {
  [key: string]: Function[]
}

const BackboneContext = React.createContext<ContextProps>({ send: undefined, listen: undefined, unlisten: undefined })

function useBackbone() {
  return useContext(BackboneContext)
}

interface IBackboneProvider {
  children: React.ReactNode
}

const BackboneProvider = ({ children }: IBackboneProvider) => {
  const [replyHandlers, setReplyHandlers] = React.useState<TReplyHandlers>({})
  const [listeners, setListeners] = React.useState<TListeners>({})
  const [messageQueue, setMessageQueue] = React.useState<string[]>([])
  const [socketClient, setSocketClient] = React.useState<NodeIPCClient>(null)

  // If we pass a state crated with useState to a listener, listner won't be able to access the latest value. to solve this. use `useRef` or use setter func

  const removeReplyHandler = (id: string) =>
    setReplyHandlers((old) => {
      const newVal = { ...old }
      delete newVal[id]
      return newVal
    })

  useEffect(() => {
    // using IIFE
    ;(async () => {
      const socketName = await window.getServerSocket()
      _connectSocket(socketName, () => {
        console.log(`Socket ${socketName} - Connected!`)
      })
    })()
  }, [])

  const _connectSocket = (name: any, onOpen: { (): void; (): void }) => {
    console.log('KKKKKK window.ipcConnect', window.ipcConnect)
    console.log('replyHandlers', replyHandlers)

    window.ipcConnect(name, function (client: NodeIPCClient) {
      client.on('message', (data: string) => {
        // added as a workaround to get the latest value of replyHandlers in the listner fucntion
        let currentReplyHandlers = replyHandlers
        setReplyHandlers((val) => {
          currentReplyHandlers = val
          return val
        })
        console.log('on-message-currentReplyHandlers', currentReplyHandlers)
        const msg = JSON.parse(data)
        const { type, id, result, name, args } = msg
        console.log(`IPC-Client : got message --(${msg.type})  - ${id} - result : ${result}  - name : ${name}  - args : ${args} `)

        if (type === 'error') {
          // Up to you whether or not to care about the error
          removeReplyHandler(id)
        } else if (type === 'reply') {
          const handler = currentReplyHandlers[id]

          console.log('handling reply...', handler)
          if (handler) {
            removeReplyHandler(id)
            handler.resolve(result)
          } else {
            console.warn(`Response handler not dounf for id - ${id}`)
            console.log('currentReplyHandlers', currentReplyHandlers)
          }
        } else if (type === 'push') {
          const listens = listeners[name]
          if (listens) {
            listens.forEach((listener: (arg0: any) => void) => {
              listener(args)
            })
          }
        } else {
          throw new Error('Unknown message type: ' + JSON.stringify(msg))
        }
      })

      client.on('connect', () => {
        setSocketClient(client)
        // added as a workaround to get the latest value of replyHandlers in the listner fucntion
        let currentMessageQueue = messageQueue
        setMessageQueue((val) => {
          currentMessageQueue = val
          return val
        })

        // Send any messages that were queued while closed
        if (currentMessageQueue.length > 0) {
          currentMessageQueue.forEach((msg) => client.emit('message', msg))
          setMessageQueue([])
        }

        onOpen()
      })

      client.on('disconnect', () => {
        setSocketClient(null)
      })
    })
  }

  const send: TSend = (name, args) => {
    console.log('kkk replyHandlers :', replyHandlers)
    return new Promise((resolve, reject) => {
      let id = window.uuid()
      // save the reply handlet with a unique id.
      setReplyHandlers((old) => ({ ...old, [id]: { resolve, reject } }))

      if (socketClient) {
        console.log('socketClient is available , emit message --', id)
        socketClient.emit('message', JSON.stringify({ id, name, args }))
      } else {
        console.log('socketClient is not available, adding to MessageQueue ')
        setMessageQueue((old) => [...old, JSON.stringify({ id, name, args })])
      }
    })
  }

  const listen: TListen = (name, cb) => {
    setListeners((old) => ({ ...old, [name]: [...(old[name] || [])] }))

    return () => {
      // TODO: (test) what if old[name] is undefined or name key dont exist
      setListeners((old) => ({ ...old, [name]: old[name].filter((cb_: Function) => cb_ !== cb) }))
    }
  }

  const unlisten: TUnlisten = (name) => {
    setListeners((old) => ({ ...old, [name]: [] }))
  }

  return (
    <BackboneContext.Provider
      value={{
        send,
        listen,
        unlisten,
      }}>
      {children}
    </BackboneContext.Provider>
  )
}

export { useBackbone, BackboneProvider }
