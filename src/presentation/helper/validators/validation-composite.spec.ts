import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  class ValidationStub implements Validation {
    validate (): Error|null {
      return null
    }
  }
  const validationStubs = [
    new ValidationStub(),
    new ValidationStub()
  ]
  const sut = new ValidationComposite(validationStubs)
  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error())
  })

  test('should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error('First error'))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new Error('Second error'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error('First error'))
  })
})
