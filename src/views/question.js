module.exports = function(question) {
  return ({
    id: question._survey,
    title: question.title,
    options: question.options,
    createdAt: question.createdAt
  })
}
