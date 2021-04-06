import { createHttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-fetch'
import { network } from '../frontend.config.js'

export default function (context) {
  return {
    httpEndpoint: network.backendHttp,
    wsEndpoint: network.backendWs,
    websocketsOnly: true,
    link: createHttpLink({
      uri: '/graphql',
      credentials: 'include',
      fetch: (uri, options) => {
        options.headers['X-Hasura-Admin-Secret'] =
          process.env.HASURA_GRAPHQL_ADMIN_SECRET
        return fetch(uri, options)
      },
    }),
  }
}
