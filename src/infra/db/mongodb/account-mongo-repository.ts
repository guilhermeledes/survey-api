import {
  AddAccountRepository,
  CheckAccountByEmailRepository,
  LoadAccountByEmailRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository
} from '@/data/protocols'
import { MongoHelper } from '@/infra/db'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository, CheckAccountByEmailRepository {
  async add (data: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(data)
    return result.ops[0] !== null
  }

  async checkByEmail (email: string): Promise<CheckAccountByEmailRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      email
    },{
      projection: {
        _id: 1
      }
    })
    return account !== null
  }

  async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      email
    },{
      projection: {
        _id: 1,
        name: 1,
        password: 1
      }
    })
    return account && MongoHelper.map(account)
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.updateOne(
      { _id: id },
      { $set: { accessToken: token } }
    )
  }

  async loadByToken (accessToken: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    },{
      projection: {
        _id: 1
      }
    })
    return account && MongoHelper.map(account)
  }
}
