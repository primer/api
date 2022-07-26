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
import { ThemeProvider, BaseStyles, NavList, PageLayout } from "@primer/react";

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
        {typeof document === "undefined" ? "__STYLES__" : null}
      </head>
      <body>
        <ThemeProvider>
          <BaseStyles>
            <PageLayout containerWidth="full">
              <PageLayout.Pane position="start">
                <NavList>
                  <NavList.Group title="Components">
                    {data.components
                      .sort((a, b) => (a.name > b.name ? 1 : -1))
                      .map(({ name }) => (
                        <NavList.Item key={name} href={`/${paramCase(name)}`}>
                          {name}
                        </NavList.Item>
                      ))}
                  </NavList.Group>
                </NavList>
              </PageLayout.Pane>
              <PageLayout.Content>
                <Outlet />
              </PageLayout.Content>
            </PageLayout>
          </BaseStyles>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </ThemeProvider>
      </body>
    </html>
  );
}
