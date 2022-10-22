import { ApolloClient, createHttpLink, from } from '@apollo/client';
import { API_SERVICE_ENDPOINT } from '../../constants';
import { onError } from '@apollo/client/link/error';
import { customHistory } from '..';
import { cache } from './apollo-client-cache';

const httpLink = createHttpLink({
  uri: `${API_SERVICE_ENDPOINT}/graphql`,
  credentials: 'include',
});

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err && err.extensions && err.extensions.code) {
        if (err.extensions.code === 'UNAUTHENTICATED') {
          customHistory.push(customHistory.location.pathname, {
            loggedOut: true,
          });
        }
      }
    }
  }
});

export const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache,
});