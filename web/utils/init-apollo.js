import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { createHttpLink } from "apollo-link-http"
import { setContext } from "apollo-link-context"
import { WebSocketLink } from "apollo-link-ws"
import { getMainDefinition } from "apollo-utilities"
import { split } from "apollo-link"
// import { onError } from "apollo-link-error"
import fetch from "isomorphic-unfetch"

import { GraphqlHTTP, GraphqlWS } from "../config"

let apolloClient = null

if (!process.browser) {
  global.fetch = fetch
}

function create(initialState, { getToken }) {
  const httpLink = createHttpLink({
    uri: GraphqlHTTP,
    credentials: "same-origin"
  })

  const authLink = setContext((_, { headers }) => {
    const token = getToken()
    return {
      headers: {
        ...headers,
        authorization: token ? token : ""
      }
    }
  })

  const wsLink = process.browser
    ? new WebSocketLink({
        uri: GraphqlWS,
        options: {
          reconnect: true
        }
      })
    : () => {
        console.log("SSR")
      }

  // const errorLink = onError(({ graphQLErrors }) => {
  //   if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message))
  // })

  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === "OperationDefinition" && operation === "subscription"
    },
    wsLink,
    authLink.concat(httpLink)
  )

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser,
    link,
    cache: new InMemoryCache().restore(initialState || {})
  })
}

export default function initApollo(initialState, options) {
  if (!process.browser) {
    return create(initialState, options)
  }

  if (!apolloClient) {
    apolloClient = create(initialState, options)
  }

  return apolloClient
}
