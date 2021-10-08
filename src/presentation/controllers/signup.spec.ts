import { SignUpController } from './signup'

describe('SignUp', () => {
  test('shouldreturn 400 if no name is privided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'test@example.com',
        password: 'test',
        password_confirmation: 'test'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})