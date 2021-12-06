import { AuthenticationModel } from '@/domain/models'
import { AddAccount, Authentication } from '@/domain/usecases'
import faker from 'faker'

export const mockAddAccountParams = (): AddAccount.Params => (
  {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  })

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

export const mockAuthenticationModel = (): AuthenticationModel => ({
  name: faker.name.findName(),
  accessToken: faker.internet.password()
})
