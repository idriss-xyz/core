import { NextRequest, NextResponse } from 'next/server';
import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { TipHistoryQuery } from './constants';

const ZAPPER_API_URL = 'https://public.zapper.xyz/graphql';
const ZAPPER_API_KEY = process.env.ZAPPER_API_KEY;

// ts-unused-exports:disable-next-line
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { error: 'Invalid or missing address' },
        { status: 400 },
      );
    }

    const httpLink = createHttpLink({
      uri: ZAPPER_API_URL,
    });

    const encodedKey = btoa(ZAPPER_API_KEY);

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

    const { data } = await client.query({
      query: TipHistoryQuery,
      variables: {
        addresses: [address],
        isSigner: false,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch tip history' },
      { status: 500 },
    );
  }
}
