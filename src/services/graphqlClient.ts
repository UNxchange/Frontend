import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import Cookies from 'js-cookie'
import { APP_CONFIG } from '../config/api'

// Determine the GraphQL endpoint based on environment
const getGraphQLEndpoint = () => {
  // If running in Docker container (proxied through nginx)
  if (window.location.hostname === 'localhost' && window.location.port === '3000') {
    return 'http://localhost:3000/api/v1/notification/graphql'
  }
  // Direct access to notifications service
  return 'http://localhost:8001/api/v1/notification/graphql'
}

const httpLink = createHttpLink({
  uri: getGraphQLEndpoint(),
})

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from cookies
  const token = Cookies.get(APP_CONFIG.TOKEN_KEY)
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
})

export const graphqlClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
})
