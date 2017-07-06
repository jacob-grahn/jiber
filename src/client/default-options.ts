import { simpleSetter } from '../core/index'
import ClientSettings from './interfaces/client-settings'

const defaultOptions: ClientSettings = {
  reducer: simpleSetter,
  middleware: [],
  url: '',
  stunPort: 3478,                                                               // 5349 for TLS
  socketPort: 80,
  credential: ''
}

export default defaultOptions
