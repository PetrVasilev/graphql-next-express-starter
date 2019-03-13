import user from "./user"

export default {
  Query: {
    ...user.Query
  },
  Mutation: {
    ...user.Mutation
  }
  // Subscription: {
  //   ...user.Subscription
  // }
}
