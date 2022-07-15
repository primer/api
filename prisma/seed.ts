// Run this script to seed the database for demo purposes.

// In the future, the database will be populated by
// various data sources using the GraphQL mutation API.

import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";
import { pascalCase, sentenceCase } from "change-case";

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();

  // Fetch React component metadata from the docs
  const reactComponents: Array<{ id: string }> = await fetch(
    `https://primer.github.io/react/components.json`
  )
    .then((res) => res.json())
    .catch((error) => {
      console.error(error);
    });

  // Upsert component metadata into the database

  const data = await Promise.all(
    reactComponents.slice(0, 10).map(async (component) => {
      console.log(pascalCase(component.id));
      const componentName = sentenceCase(component.id);
      return prisma.componentImpl.upsert({
        where: {
          componentName_framework: {
            componentName,
            framework: "REACT",
          },
        },
        update: {},
        create: {
          component: {
            connectOrCreate: {
              where: {
                name: componentName,
              },
              create: {
                name: componentName,
              },
            },
          },
          framework: "REACT",
          status: "ALPHA",
        },
      });
    })
  );

  console.log(data);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
