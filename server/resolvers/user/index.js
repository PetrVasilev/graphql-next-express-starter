export default {
  Query: {
    getMySelf: async (parent, args, { User, userAuth }) => {
      if (!userAuth) {
        throw new Error("Нет доступа")
      }
      const user = await User.findById(userAuth._id)
      return user
    }
  },
  Mutation: {
    login: async (parent, { email, password }, { User }) => {
      const auth = await User.authorize(email, password)
      if (auth.success) {
        return {
          user: auth.user,
          token: auth.token
        }
      } else {
        throw new Error("Неправильный логин или пароль")
      }
    }
  }
}
