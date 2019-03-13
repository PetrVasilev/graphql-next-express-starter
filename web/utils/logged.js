import gql from 'graphql-tag'

export const getMySelfQuery = gql`
  query getMySelf {
    getMySelf {
      _id
      email
    }
  }
`

export default apolloClient =>
  apolloClient
    .query({
      query: getMySelfQuery
    })
    .then(({ data }) => {
      const user = data.getMySelf
      return { user }
    })
    .catch((err) => {
      return { user: null }
    })
