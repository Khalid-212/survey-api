const UserView = require('./user')
const QuestionView = require('./question')

module.exports = function EntryView(survey, arr = []) {
  let populate = {}
  arr.forEach(i => populate[i] = true)

  return ({
    title: survey.title,
    description: survey.description,
    questions: populate.questions ? survey.questions.map(i => QuestionView(i)) : survey.questions,
    status: survey.status,
    createdBy: populate.createdBy ? UserView(survey.createdBy) : survey.createdBy,
    createdAt: survey.createdAt,
    deletedAt: survey.deletedAt
  })
}