'use client';
import { ReactNode } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  ApolloLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

type Properties = {
  children: ReactNode;
};

export const TipHistoryProviders = ({ children }: Properties) => {
  const httpLink = createHttpLink({
    uri: 'https://public.zapper.xyz/graphql',
  });

  const encodedKey = btoa(process.env.ZAPPER_API_KEY ?? '');

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Basic ${encodedKey}`,
      },
    };
  });

  const client = new ApolloClient({
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
