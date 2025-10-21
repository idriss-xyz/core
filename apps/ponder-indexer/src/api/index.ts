import { db } from 'ponder:api';
import schema from 'ponder:schema';
import { Hono } from 'hono';
import { graphql, client } from 'ponder';

const app = new Hono();

// Health endpoints required by Railway
app.get('/health', async (c) => {
  return c.text('ok');
});

app.get('/ready', async (c) => {
  return c.text('ready');
});

// GraphQL endpoint
app.use('/', graphql({ db, schema }));
app.use('/graphql', graphql({ db, schema }));

// SQL over HTTP
app.use('/sql/*', client({ db, schema }));

export default app;
