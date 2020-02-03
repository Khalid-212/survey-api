module.exports = function(question) {
  return ({
    title: question.title,
    options: question.options,
    createdAt: question.createdAt
  })
}
