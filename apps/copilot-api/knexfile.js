const dotenv = require("dotenv");
const {join} = require("path");

dotenv.config({path: join(__dirname, `.env.${process.env.NODE_ENV}`)})

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './migrations',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './migrations',
    },
  },
};
