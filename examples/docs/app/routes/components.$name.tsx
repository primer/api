import { BookIcon, MarkGithubIcon } from "@primer/octicons-react";
import { Box, Label, Link, TabNav, Text } from "@primer/react";
import { LabelColorOptions } from "@primer/react/lib/Label";
import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Link as RemixLink, useLoaderData, useLocation } from "@remix-run/react";
import { sentenceCase } from "change-case";
import { gql } from "graphql-request";
import { primerApi } from "~/primer-api-client";

export const meta: MetaFunction = ({ params }) => ({
  title: `${sentenceCase(params.name || "")} | Primer`,
});

type ImplementationData = {
  framework: "REACT" | "RAILS" | "FIGMA";
  status: "ALPHA" | "BETA" | "STABLE" | "DEPRECATED";
  source: string;
  componentBookUrl?: string;
  componentFigmaUrl?: string;
}

type DesignTokenData = {
  name: string;
  rawValue: string;
  type: 
    | "COLOR"
    | "DIMENSION"
    | "DURATION"
    | "TYPOGRAPHY"
}

type OcticonData = {
  name: string;
  description?: string;
  svgPathString?: string;
}

// TODO: Generate this type from the GraphQL schema
type LoaderData = {
  component: {
    name: string;
    description: string; 
    implementations: ImplementationData[];
    designTokensUsed: DesignTokenData[];
    octiconsUsed: OcticonData[];
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
        component(where: { name: $name }) {
          name
          description
          implementations {
            framework
            status
            source
          }
          designTokensUsed {
            name
            type
            rawValue
          }
          octiconsUsed {
            name
            svgPathString
          }
        }
      }
    `,
    {
      name: sentenceCase(name),
    }
  );

  return json(data);
};

const statusLabelVariants: Record<LoaderData['component']['implementations'][0]['status'], LabelColorOptions> = {
  ALPHA: "severe",
  BETA: "attention",
  STABLE: "success",
  DEPRECATED: "danger"
}

// TODO: Use this to render spacing and typography tokens
//
// const TokenTableRow = ({ name = 'fg.default', rawValue = "#24292f" }) => {
//   const cssVarName = `var(--${name.split('.').join('-')})`
//   const linkProps = {
//     as: RemixLink,
//     to: `/primitives/${name}`,
//     prefetch: "intent" as "intent" | "render" | "none",
//   }
  
//   return (
//     <tr>
//       <td>
//         <Box
//           as="a"
//           href="#design-token-path"
//           display="block"
//           width="24px"
//           height="24px"
//           backgroundColor={name}
//           borderWidth={1}
//           borderColor="border.subtle"
//           borderStyle="solid"
//           borderRadius={2}
//         />
//       </td>
//       <td>
//         <Link {...linkProps}>
//           <Text color="fg.subtle" as="span">JS</Text><Text color="fg.default" fontFamily="mono" fontSize={2}>{name}</Text>
//         </Link>
//         <Link {...linkProps}>
//           <Text color="fg.subtle" as="span">CSS</Text><Text color="fg.default" fontFamily="mono" fontSize={2}>{cssVarName}</Text>
//         </Link>
//       </td>
//       <td>
//         <Text {...linkProps} fontFamily="mono" fontSize={2}>{rawValue}</Text>
//       </td>
//     </tr>
//   )
// }

const ColorTokenSwatch = ({ name, rawValue }) => {
  const cssVarName = `var(--${name.split('.').join('-')})`
  
  return (
    <Box
      as={RemixLink}
      to={`/primitives/${name}`}
      prefetch="intent"
      color="fg.default"
      sx={{
        textDecoration: "none",
        '&:hover': {
          textDecoration: "underline"
        }
      }}
    >
      <Box
          as="span"
          display="block"
          backgroundColor={name}
          borderWidth={1}
          borderColor="border.subtle"
          borderStyle="solid"
          borderRadius={2}
          height="100px"
      />
      <Text as="span" display="block" fontFamily="mono">{name}</Text>
      <Text as="span" display="block" fontFamily="mono" fontSize={2} color="fg.subtle">{cssVarName}</Text>
      <Text as="span" display="block" fontFamily="mono" fontSize={2} color="fg.subtle">{rawValue}</Text>
    </Box>
  )
}

const OcticonGridCell = ({name, svgPathString}: OcticonData) => {
  return (
    <Box
      as={RemixLink}
      to={`/octicons/${name}`}
      prefetch="intent"
      display="flex"
      alignItems="center"
      gridGap={2}
      color="fg.default"
      sx={{
        textDecoration: "none",
        '&:hover .octiconLabel': {
          textDecoration: "underline"
        }
      }}
    >
      <Box borderWidth={1} borderStyle="solid" borderColor="border.default" borderRadius={2} p={3} height="48px" width="48px" lineHeight={0} display="flex" alignItems="center" justifyContent="center">
        {svgPathString || "◼️"}
      </Box>
      <span className="octiconLabel">{name}</span>
    </Box>
  )
}

const ImplementationTabContent = ({framework, source, componentBookUrl}: LoaderData['component']['implementations'][0]) => {
  return (
    <Box p={4} sx={{'> * + *': {marginTop: 4}}}>
      <div>
        <Box display="flex">
          <Box as={Link} href={source} display="flex" alignItems="center" gridGap={1}>
            <MarkGithubIcon size={24} />
            <span>View source</span>
          </Box>
          {componentBookUrl && (
            <Box as={Link} href={source} display="flex" alignItems="center" gridGap={1}>
              <BookIcon size={24} />
              <span>View {framework === "REACT" ? "Storybook" : "Lookbook"}</span>
            </Box>
          )}
        </Box>
      </div>

      <div>
        <Text as="h3" m={0} fontSize={3} fontWeight="bold">Examples</Text>
        <Text as="p" m={0}>Rendered examples w/ code go here</Text>
      </div>

      <div>
        <Text as="h3" m={0} fontSize={3} fontWeight="bold">{framework === "REACT" ? "Props" : "Arguments"}</Text>
        <Text as="p" m={0}>Prop tables go here</Text>
      </div>

      {framework === "RAILS" && (
        <div>
          <Text as="h3" m={0} fontSize={3} fontWeight="bold">Slots</Text>
          <Text as="p" m={0}>Slots data goes here</Text>
        </div>
      )}

      <div>
        <Text as="h3" m={0} fontSize={3} fontWeight="bold">Status</Text>
        <Text as="p" m={0}>Status checklist goes here</Text>
      </div>
    </Box>
  );
}

export default function ComponentPage() {
  const data = useLoaderData<LoaderData>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeImplementationTab = searchParams.get('implementationTab') || 'REACT';
  const implementationData = data.component.implementations.find(
    (implementation) => implementation.framework === activeImplementationTab
  );
  const colorTokens = data.component.designTokensUsed.filter((token) => token.type === 'COLOR')
  const dimensionTokens = data.component.designTokensUsed.filter((token) => token.type === 'DIMENSION')
  
  return (
    <>
      <Text as="h1" fontSize={5} fontWeight="bold" m={0}>{data.component.name}</Text>
      {data.component.description && (<Text as="p" fontSize={3} m={0}>{data.component.description}</Text>)}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

      <Text as="h2" fontSize={4} fontWeight="bold">Implementations</Text>
      <TabNav>
        {data.component.implementations.map(({ framework, status }) => (
          <TabNav.Link as={RemixLink} key={framework} to={`?implementationTab=${framework}`} selected={activeImplementationTab === framework} sx={{textTransform: 'capitalize'}}>
            <Box as="span" display="flex" alignItems="baseline" gridGap={1}>
              <span>{framework.toLowerCase()}</span>
              <Label variant={statusLabelVariants[status]}>{status}</Label>
            </Box>
          </TabNav.Link>
        ))}
      </TabNav>

      <Box borderWidth={0} borderBottomWidth={2} borderStyle="solid" borderColor="border.default">
        {implementationData && <ImplementationTabContent {...implementationData} />}
      </Box>

      {colorTokens.length || dimensionTokens.length ? (
        <>
          <Text as="h2" fontSize={4} fontWeight="bold">Primitives used</Text>
          {colorTokens?.length ? (
            <>
              <Text as="h4" fontSize={2} fontWeight="bold">Color tokens</Text>
              <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gridGap={3}>
                {colorTokens?.map((token) => (<ColorTokenSwatch {...token} key={token.name} />))}
              </Box>
            </>
          ) : null}

          {data.component.octiconsUsed?.length ? (
            <>
              <Text as="h2" fontSize={4} fontWeight="bold">Octicons used</Text>
              <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gridGap={3}>
                {data.component.octiconsUsed?.map(octicon => (<OcticonGridCell {...octicon} key="name" />))}
              </Box>
            </>
          ) : null}
        </>
      ) : null}
    </>
  );
}
