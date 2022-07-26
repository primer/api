import { Action, ActionPanel, List, showToast, Toast } from "@raycast/api";
import { paramCase, pascalCase } from "change-case";
import { gql, GraphQLClient } from "graphql-request";
import { AbortError } from "node-fetch";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Command() {
  const { state, search } = useSearch();

  return (
    <List
      isLoading={state.isLoading}
      onSearchTextChange={search}
      searchBarPlaceholder="Search components..."
      throttle
    >
      <List.Section title="Results" subtitle={state.results.length + ""}>
        {state.results.map((searchResult) => (
          <SearchListItem key={searchResult.name} searchResult={searchResult} />
        ))}
      </List.Section>
    </List>
  );
}

function SearchListItem({ searchResult }: { searchResult: SearchResult }) {
  return (
    <List.Item
      title={searchResult.name}
      // subtitle={searchResult.description}
      // accessoryTitle={searchResult.username}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser
            title="Open documentation"
            url={`http://localhost:3000/components/${paramCase(
              searchResult.name
            )}`}
          />

          <Action.CopyToClipboard
            title="Copy name"
            content={pascalCase(searchResult.name)}
            shortcut={{ modifiers: ["cmd"], key: "." }}
          />
        </ActionPanel>
      }
    />
  );
}

function useSearch() {
  const [state, setState] = useState<SearchState>({
    results: [],
    isLoading: true,
  });
  const cancelRef = useRef<AbortController | null>(null);

  const search = useCallback(
    async function search(searchText: string) {
      cancelRef.current?.abort();
      cancelRef.current = new AbortController();
      setState((oldState) => ({
        ...oldState,
        isLoading: true,
      }));
      try {
        const results = await performSearch(
          searchText,
          cancelRef.current.signal
        );
        setState((oldState) => ({
          ...oldState,
          results: results,
          isLoading: false,
        }));
      } catch (error) {
        setState((oldState) => ({
          ...oldState,
          isLoading: false,
        }));

        if (error instanceof AbortError) {
          return;
        }

        console.error("search error", error);
        showToast({
          style: Toast.Style.Failure,
          title: "Could not perform search",
          message: String(error),
        });
      }
    },
    [cancelRef, setState]
  );

  useEffect(() => {
    search("");
    return () => {
      cancelRef.current?.abort();
    };
  }, []);

  return {
    state: state,
    search: search,
  };
}

async function performSearch(
  searchText: string,
  signal: AbortSignal
): Promise<SearchResult[]> {
  const client = new GraphQLClient("http://localhost:4000");
  const query = gql`
    query ($searchText: String!) {
      components(
        where: { name: { contains: $searchText, mode: insensitive } }
      ) {
        name
      }
    }
  `;

  const results = await client.request({
    document: query,
    variables: { searchText },
    // signal,
  });

  return results.components;
}

interface SearchState {
  results: SearchResult[];
  isLoading: boolean;
}

interface SearchResult {
  name: string;
  // description?: string;
  // username?: string;
  // url: string;
}
