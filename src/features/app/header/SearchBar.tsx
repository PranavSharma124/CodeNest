"use client";

import { Search, User, Building2, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { searchApp } from "@/actions/search";
import { getOrCreateDirectConversation } from "@/actions/getOrCreateDirectConversation";

type SearchResults = Awaited<ReturnType<typeof searchApp>>;

export default function SearchBar() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({
    users: [],
    workspaces: [],
    directMessages: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const data = await searchApp(trimmedQuery);

        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [query]);

  const hasResults =
    results.users.length > 0 ||
    results.workspaces.length > 0 ||
    results.directMessages.length > 0;

  const handleWorkspaceClick = (workspaceId: string) => {
    setQuery("");
    setResults({
      users: [],
      workspaces: [],
      directMessages: [],
    });

    router.push(`/workspace/${workspaceId}`);
  };

  const handleUserClick = async (userId: string) => {
    try {
      const conversation = await getOrCreateDirectConversation(userId);

      setQuery("");
      setResults({
        users: [],
        workspaces: [],
        directMessages: [],
      });

      router.push(`/DM/${conversation.id}`);
    } catch (error) {
      console.error("Failed to open conversation:", error);
    }
  };

  const handleDirectMessageClick = (conversationId: string) => {
    setQuery("");
    setResults({
      users: [],
      workspaces: [],
      directMessages: [],
    });

    router.push(`/DM/${conversationId}`);
  };

  return (
    <div className="relative flex-1 px-8" role="search">
      <div className="flex h-10 w-full items-center gap-2 rounded-md border bg-muted px-3">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />

        <input
          className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
          placeholder="Search projects, people..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {query.trim() && (
        <div className="absolute left-8 right-8 top-12 z-50 rounded-md border bg-background p-2 shadow-lg">
          {loading && (
            <p className="p-3 text-sm text-muted-foreground">Searching...</p>
          )}

          {!loading && !hasResults && (
            <p className="p-3 text-sm text-muted-foreground">
              No results found.
            </p>
          )}

          {!loading && results.users.length > 0 && (
            <div>
              <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                PEOPLE
              </p>

              {results.users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-muted"
                  onClick={() => handleUserClick(user.id)}
                >
                  <User className="h-4 w-4" />

                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && results.workspaces.length > 0 && (
            <div className="mt-2">
              <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                WORKSPACES
              </p>

              {results.workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-muted"
                  onClick={() => handleWorkspaceClick(workspace.id)}
                >
                  <Building2 className="h-4 w-4" />

                  <p className="text-sm font-medium">{workspace.name}</p>
                </button>
              ))}
            </div>
          )}

          {!loading && results.directMessages.length > 0 && (
            <div className="mt-2">
              <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                DIRECT MESSAGES
              </p>

              {results.directMessages.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-muted"
                  onClick={() => handleDirectMessageClick(conversation.id)}
                >
                  <MessageCircle className="h-4 w-4" />

                  <p className="text-sm font-medium">
                    {conversation.user.name}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
