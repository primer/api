# Primer API

> **Warning**: Experimental

A [GraphQL](https://graphql.org/) API for collecting and accessing data about the [Primer Design System](https://primer.style)

## Data flow

![Data flow diagram](https://user-images.githubusercontent.com/4608155/179082139-9fc96339-bcd2-4171-a02c-6b693d7fa4eb.png)

## Technology stack
* [Apollo Server](https://www.apollographql.com/docs/apollo-server/) for running the GraphQL server
* [Prisma](https://www.prisma.io/) for defining the data schema
* [TypeGraphQL Prisma](https://prisma.typegraphql.com/) for generating a GraphQL API from our Prisma schema
* [Supabase](https://supabase.com) for hosting the PostgreSQL database

## Local development

### Set up

1. Clone the repsitory:

   ```shell
   git clone git@github.com:primer/schema.git
   cd schema
   ```

1. Install dependencies:

   ```shell
   npm install
   ```

1. Create a `.env` file in the root directory of the repository with a `DATABASE_URL` variable:

   ```shell
   DATABASE_URL=...
   ```

   The `DATABASE_URL` variable should be set to a connection string for a PostgreSQL database. Ask @colebemis, @langermank, or @mperrotti for the connection string.

### Run local GraphQL server

```shell
npm run start
```

The GraphQL server will be available at http://localhost:4000.

### Publish schema changes

1. Make changes to the database schema in `prisma/schema.prisma`

1. Run a migration:

   ```shell
   npm run migrate
   ```
