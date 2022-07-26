import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { gql } from "graphql-request";
import { primerApi } from "~/primer-api-client";
import { paramCase } from "change-case";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Primer",
  viewport: "width=device-width,initial-scale=1",
});

// TODO: Generate this type from the GraphQL schema
type LoaderData = {
  components: Array<{ name: string }>;
};

export const loader = async () => {
  const data = await primerApi.request<LoaderData>(gql`
    {
      components {
        name
      }
    }
  `);

  return json(data);
};

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <nav>
          <ul>
            {data.components.map(({ name }) => (
              <li key={name}>
                <a href={`/${paramCase(name)}`}>{name}</a>
              </li>
            ))}
          </ul>
        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
