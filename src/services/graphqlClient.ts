import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { API_CONFIG, APP_CONFIG } from '../config/api'

// Usar el API Gateway para GraphQL
const getGraphQLEndpoint = () => {
  // Siempre usar el endpoint del API Gateway
  return `${API_CONFIG.API_GATEWAY_URL}${API_CONFIG.ENDPOINTS.NOTIFICATIONS.GRAPHQL}`;
}

const httpLink = createHttpLink({
  uri: getGraphQLEndpoint(),
})

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from localStorage (not cookies)
  const token = localStorage.getItem(APP_CONFIG.TOKEN_KEY)
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
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

