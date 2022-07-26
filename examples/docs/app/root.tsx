import { MarkGithubIcon } from "@primer/octicons-react";
import {
  BaseStyles,
  Box,
  Label,
  NavList,
  PageLayout,
  SSRProvider,
  Text,
  ThemeProvider,
} from "@primer/react";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { paramCase } from "change-case";
import { gql } from "graphql-request";
import { useMatch, useResolvedPath } from "react-router-dom";
import { primerApi } from "~/primer-api-client";

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
        <SSRProvider>
          <ThemeProvider>
            <BaseStyles>
              <PageLayout containerWidth="full">
                <PageLayout.Header>
                  <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                    <Box
                      as={Link}
                      to="/"
                      sx={{
                        color: "fg.default",
                        display: "flex",
                        gap: 2,
                        textDecoration: "none",
                        alignItems: "center",
                      }}
                    >
                      <MarkGithubIcon size="medium" />
                      <Text sx={{ fontSize: 3, fontWeight: "bold" }}>
                        Primer
                      </Text>
                    </Box>
                    <Label variant="attention">DEMO</Label>
                  </Box>
                </PageLayout.Header>
                <PageLayout.Pane position="start">
                  <NavList>
                    <NavItem to="/primitives">Primitives</NavItem>
                    <NavItem to="/octicons">Octicons</NavItem>
                    <NavList.Group title="Components">
                      {data.components
                        .sort((a, b) => (a.name > b.name ? 1 : -1))
                        .map(({ name }) => (
                          <NavItem
                            key={name}
                            to={`/components/${paramCase(name)}`}
                          >
                            {name}
                          </NavItem>
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
        </SSRProvider>
      </body>
    </html>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  const resolved = useResolvedPath(to);
  const isCurrent = useMatch({ path: resolved.pathname, end: true });
  return (
    <NavList.Item
      as={Link}
      to={to}
      aria-current={isCurrent ? "page" : undefined}
    >
      {children}
    </NavList.Item>
  );
}
