import {
  badRequest,
  notFound,
  serverError,
  unauthorized,
  forbidden
} from './components'
import {
  account,
  error,
  loginParams,
  apiKeyAuth
} from './schemas'
import { loginPath } from './paths/login'

export default {
  openapi: '3.0.0',
  info: {
    title: 'API',
    version: '1.0.0'
  },
  license: {
    name: 'GPL-3.0',
    url: 'https://www.gnu.org/licenses/gpl-3.0.en.html'
  },
  servers: [
    { url: '/api' }
  ],
  tags: [
    { name: 'Login' }
  ],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account,
    loginParams,
    error
  },
  components: {
    securitySchemes: { apiKeyAuth },
    badRequest,
    serverError,
    unauthorized,
    notFound,
    forbidden
  }
}
