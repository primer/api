# Primer API

> **Warning**: Experimental. Not production ready.

A [GraphQL](https://graphql.org/) API for collecting and accessing data about the [Primer Design System](https://primer.style)

## Data flow

![Data flow diagram](https://user-images.githubusercontent.com/4608155/179082139-9fc96339-bcd2-4171-a02c-6b693d7fa4eb.png)

## Technology stack

- [Apollo Server](https://www.apollographql.com/docs/apollo-server/) for running the GraphQL server
- [Prisma](https://www.prisma.io/) for defining the data schema
- [TypeGraphQL Prisma](https://prisma.typegraphql.com/) for generating a GraphQL API from our Prisma schema
- [Supabase](https://supabase.com) for hosting the PostgreSQL database

## Local development

### Set up

1. Clone the repository:

   ```shell
   git clone git@github.com:primer/api.git primer-api
   cd primer-api
   ```

1. Run the `setup` script:

   ```shell
   npm run setup
   ```

   This will install and build any necessary dependencies.

1. Create a `.env` file in the `api` directory of the repository with a `DATABASE_URL` variable:

   ```shell
   DATABASE_URL=...
   ```

   The `DATABASE_URL` variable should be set to a connection string for a PostgreSQL database. Ask @colebemis, @langermank, or @mperrotti for the connection string.

### Run locally

```shell
npm run start
```

The GraphQL server will be available at http://localhost:4000.

### Publish schema changes

1. Make changes to the database schema in `prisma/schema.prisma`

1. Run a migration:

   ```shell
   npm run prisma:migrate
   ```
