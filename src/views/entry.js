const UserView = require('./user')
const QuestionView = require('./question')
const SurveyView = require('./survey')

module.exports = function EntryView(entry, arr = []) {
  let populate = {}
  arr.forEach(i => populate[i] = true)

  return ({
    id: entry._id,
    answer: {
      question: populate.question ? QuestionView(entry.question) : entry.question,
      answer: entry.answer
    },
    survey: populate.survey ? SurveyView(entry.survey) : entry.survey,
    user: populate.user ? UserView(entry.user) : entry.user,
    createdAt: entry.createdAt
  })
}
