import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { primerApi } from "~/primer-api-client";
import { sentenceCase } from "change-case";
import { gql } from "graphql-request";
import { Link as RemixLink, useLoaderData } from "@remix-run/react";
import { Link } from "@primer/react";

export const meta: MetaFunction = ({ params }) => ({
  title: `Primitives | Primer`,
});

// TODO: Generate this type from the GraphQL schema
type LoaderData = {
  designTokens: Array<{
    name: string;
  }>;
};

export const loader: LoaderFunction = async () => {
  const data = await primerApi.request(
    gql`
      query {
        designTokens {
          name
        }
      }
    `
  );

  return json(data);
};

export default function ComponentPage() {
  const data = useLoaderData<LoaderData>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Primitives</h1>
      <ul>
        {data.designTokens.map(({ name }) => (
          <li key={name}>
            <Link as={RemixLink} to={`/primitives/${name}`} prefetch="intent">
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
