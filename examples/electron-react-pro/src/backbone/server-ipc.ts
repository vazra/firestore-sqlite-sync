import ipc from 'node-ipc'
import { THandlers } from '~/main/types'

export const init = (socketName: string, handlers: THandlers) => {
  ipc.config.id = socketName
  ipc.config.silent = true

  ipc.serve(() => {
    ipc.server.on('message', (data, socket) => {
      let msg = JSON.parse(data)
      let { id, name, args } = msg
      console.log(`IPC-Server : got message --(${name})  - ${id}`)

      if (handlers[name]) {
        handlers[name](args).then(
          (result) => {
            console.log(`IPC-Server : prepared result --(${name})  - ${id}`)
            console.log(`IPC-Server : sendinf to socket -- ${socket.server._pipeName}`)
            ipc.server.emit(socket, 'message', JSON.stringify({ type: 'reply', id, result }))
          },
          (error) => {
            // Up to you how to handle errors, if you want to forward
            // them, etc
            console.log(`IPC-Server : failed to prerpare --(${name})  - ${id}`)

            ipc.server.emit(socket, 'message', JSON.stringify({ type: 'error', id }))
            throw error
          }
        )
      } else {
        console.warn('Unknown method: ' + name)
        ipc.server.emit(socket, 'message', JSON.stringify({ type: 'reply', id, result: null }))
      }
    })
  })

  ipc.server.start()
}

export const send = (name: string, args: any) => {
  // @ts-ignore - Note: based on the docs broadcast is availabe, but based on @types its missing
  ipc.server.broadcast('message', JSON.stringify({ type: 'push', name, args }))
}
