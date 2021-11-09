import { LoadSurveysController } from '@/presentation/controllers/survey/load-survey/load-survey-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveys } from '@/main/factories/usecases/survey/load-surveys/db-load-surveys-factory'

export const makeLoadSurveysController = (): Controller => {
  const surveyController = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(surveyController)
}
