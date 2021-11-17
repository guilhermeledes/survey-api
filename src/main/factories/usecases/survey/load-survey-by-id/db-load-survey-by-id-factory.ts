import { DbLoadSurveyById } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id'
import { LoadSurveyById } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id-protocols'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyMongoRepository)
}