import { SaveSurveyResultController } from '@/presentation/controllers'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helper'
import { LoadAnswersBySurveySpy, SaveSurveyResultSpy } from '@/tests/presentation/mocks'
import faker from 'faker'
import MockDate from 'mockdate'

type SutTypes = {
  sut: SaveSurveyResultController
  loadAnswersBySurveySpy: LoadAnswersBySurveySpy
  saveSurveyResultSpy: SaveSurveyResultSpy

}

const makeSut = (): SutTypes => {
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const loadAnswersBySurveySpy = new LoadAnswersBySurveySpy()
  const sut = new SaveSurveyResultController(loadAnswersBySurveySpy, saveSurveyResultSpy)
  return {
    sut,
    loadAnswersBySurveySpy,
    saveSurveyResultSpy
  }
}

const mockRequest = (answer?: string): SaveSurveyResultController.Request => ({
  surveyId: faker.datatype.uuid(),
  answer,
  accountId: faker.datatype.uuid()
})

describe('SaveSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadAnswersBySurvey with correct values', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(loadAnswersBySurveySpy.surveyId).toBe(request.surveyId)
  })

  test('Should return 403 if LoadAnswersBySurvey returns empty array', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut()
    loadAnswersBySurveySpy.result = []
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if LoadAnswersBySurvey throws', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut()
    jest.spyOn(loadAnswersBySurveySpy, 'loadAnswers').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 403 if invalid answer is provided', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    request.answer = 'invalid_answer'
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveySpy } = makeSut()
    const httpeRequest = mockRequest(loadAnswersBySurveySpy.result[0])
    await sut.handle(httpeRequest)
    expect(saveSurveyResultSpy.params).toEqual({
      surveyId: httpeRequest.surveyId,
      accountId: httpeRequest.accountId,
      answer: httpeRequest.answer,
      date: new Date()
    })
  })

  test('Should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveySpy } = makeSut()
    jest.spyOn(saveSurveyResultSpy, 'save').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle(mockRequest(loadAnswersBySurveySpy.result[0]))
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 with correct data if succeeds', async () => {
    const { sut, saveSurveyResultSpy, loadAnswersBySurveySpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest(loadAnswersBySurveySpy.result[0]))
    expect(httpResponse).toEqual(ok(saveSurveyResultSpy.result))
  })
})
