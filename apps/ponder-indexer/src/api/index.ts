import { db } from 'ponder:api';
import schema from 'ponder:schema';
import { Hono } from 'hono';
import { graphql, client } from 'ponder';

const app = new Hono();

// GraphQL endpoint
app.use('/', graphql({ db, schema }));
app.use('/graphql', graphql({ db, schema }));

// SQL over HTTP
app.use('/sql/*', client({ db, schema }));

export default app;
