#!/bin/bash

# Install dependencies
npm install


# Generate Prisma Client
npm run prisma:generate --workspace api
