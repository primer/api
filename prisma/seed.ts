// Run this script to seed the database for demo purposes.

// In the future, the database will be populated by
// various data sources using the GraphQL mutation API.

import { PrismaClient } from "@prisma/client";
// import fetch from "node-fetch";
// import { pascalCase, sentenceCase } from "change-case";
// @ts-ignore
// import octicons from "@primer/octicons";
// import primitives from "@primer/primitives";
// import flatten from "flat";

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();

  /*

  // Fetch React component metadata from the docs
  const reactComponents: Array<{ id: string; status: string }> = await fetch(
    `https://primer.github.io/react/components.json`
  )
    .then((res) => res.json())
    .catch((error) => {
      console.error(error);
    });

  const viewComponents: Array<{ id: string; status: string }> = await fetch(
    `https://primer.github.io/view_components/components.json`
  )
    .then((res) => res.json())
    .catch((error) => {
      console.error(error);
    });

  // Upsert component metadata into the database
  const reactdata = await Promise.all(
    reactComponents.map(async (component) => {
      const componentName = sentenceCase(component.id);
      return prisma.componentImpl.upsert({
        where: {
          componentName_framework: {
            componentName,
            framework: "REACT",
          },
        },
        update: {
          framework: "REACT",
          status: "ALPHA",
          source: "https://github.com/primer/react/tree/main/src", // TODO: Update this
        },
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
          source: "https://github.com/primer/react/tree/main/src", // TODO: Update this
        },
      });
    })
  );

  const railsData = await Promise.all(
    viewComponents.map(async (component) => {
      const componentName = sentenceCase(component.id);
      return prisma.componentImpl.upsert({
        where: {
          componentName_framework: {
            componentName,
            framework: "RAILS",
          },
        },
        update: {
          framework: "RAILS",
          status: "ALPHA",
          source:
            "https://github.com/primer/view_components/tree/main/app/components/primer", // TODO: Update this
        },
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
          framework: "RAILS",
          status: "ALPHA",
          source:
            "https://github.com/primer/view_components/tree/main/app/components/primer", // TODO: Update this
        },
      });
    })
  );
  */

  // Octicons

  // prisma.octicon.deleteMany({});
  /*const iconData = await prisma.octicon.createMany({
    data: Object.values(octicons).map((icon: any) => {
      console.log(icon.name);
      return {
        name: icon.name,
      };
    }),
  });
  */

  // const tokenData = await prisma.designToken.createMany({
  //   data: Object.keys(flatten(primitives.colors.light, { delimiter: "-" })).map(
  //     (key) => ({ name: key })
  //   ),
  // });

  // await prisma.component.update({
  //   where: {
  //     name: "Branch name",
  //   },
  //   data: {
  //     designTokensUsed: {
  //       connect: [{ name: "accent-fg" }],
  //     },
  //   },
  // });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
