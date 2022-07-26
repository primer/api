import { Link } from "@primer/react";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link as RemixLink, useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";
import { primerApi } from "~/primer-api-client";
import { paramCase } from "change-case";

export const meta: MetaFunction = ({ params }) => ({
  title: `${params.name} | Primer`,
});

// TODO: Generate this type from the GraphQL schema
type LoaderData = {
  designToken: {
    name: string;
    description: string;
    usedByComponents: Array<{
      name: string;
    }>;
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const name = params.name;

  if (!name) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const data = await primerApi.request(
    gql`
      query ($name: String!) {
        designToken(where: { name: $name }) {
          name
          description
          usedByComponents {
            name
          }
        }
      }
    `,
    { name }
  );

  return json(data);
};

export default function ComponentPage() {
  const data = useLoaderData<LoaderData>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>{data.designToken.name}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <h2>Used by</h2>
      <ul>
        {data.designToken.usedByComponents.map(({ name }) => (
          <li key={name}>
            <Link
              as={RemixLink}
              to={`/components/${paramCase(name)}`}
              prefetch="intent"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
