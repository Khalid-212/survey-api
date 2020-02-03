module.exports = function UserView(user) {
  return ({
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    deletedAt: user.deletedAt
  })
}
