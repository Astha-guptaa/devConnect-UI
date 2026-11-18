import { io } from 'socket.io-client'
import { BASE_URL } from './constants'

const createSocketConnection = () =>
  io(BASE_URL)

export default createSocketConnection
