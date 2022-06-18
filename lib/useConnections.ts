import type { Profile } from "lib/profile";
import type { InteractionsMap } from "lib/interactions";
import type { HistoryMap } from "lib/history";
import { useState } from "react";
import { getProfile } from "lib/profile";
import { getInteractions } from "lib/interactions";
import { getHistory } from "lib/history";
import { capitalizeFirstLetter } from "lib/utils";

type ConnectionsMap = Record<string, Connection>;

export type Connection = {
  name: string;
  email: string;
  score: number;
} & HistoryMap["email"] &
  InteractionsMap["email"];

const createConnectionsMap = (
  interactionsMap: InteractionsMap,
  historyMap: HistoryMap
) => {
  return [...Object.keys(interactionsMap), ...Object.keys(historyMap)].reduce(
    (acc, email) => {
      const history = historyMap[email];
      const interactions = interactionsMap[email];
      acc[email] = {
        ...interactions,
        ...history,
        score:
          (history ? history.score : 0) +
          (interactions ? interactions.score : 0),
      };

      return acc;
    },
    {} as ConnectionsMap
  );
};

const sortConnectionsMap = (connectionsMap: ConnectionsMap) => {
  return Object.entries(connectionsMap)
    .map(([email, connection]) => ({ ...connection, email }))
    .sort((a, b) => b.score - a.score);
};

export const useConnections = () => {
  const [loading, setLoading] = useState(false);
  const [allResults, setAllResults] = useState<Connection[]>([]);
  const [shownResults, setShownResults] = useState<Connection[] | null>([]);
  const [searchedProfile, setSearchedProfile] = useState<Profile | null>(null);
  const [showMore, setShowMore] = useState(false);

  const searchStart = () => {
    setAllResults([]);
    setShownResults([]);
    setLoading(true);
    setShowMore(false);
  };

  const searchComplete = (connections: Connection[] | null) => {
    setLoading(false);
    if (connections) {
      const shown = connections.slice(0, 3);
      setAllResults(connections);
      setShownResults(shown);
      setShowMore(connections.length > shown.length);
    } else {
      setAllResults([]);
      setShownResults(null);
      setShowMore(false);
    }
  };

  const handleSearch = async (name: string) => {
    searchStart();

    // It's difficult to search using Firebase, need to find a way better
    // string match
    const profile = await getProfile(capitalizeFirstLetter(name));

    if (!profile) return searchComplete(null);

    setSearchedProfile(profile);

    const [interactionsMap, historyMap] = await Promise.all([
      getInteractions(profile.email),
      getHistory(profile.email),
    ]);

    const connectionsMap = createConnectionsMap(interactionsMap, historyMap);
    const sortedResults = sortConnectionsMap(connectionsMap);

    searchComplete(sortedResults);
  };

  const handleShowMore = () => {
    if (shownResults) {
      setShownResults(allResults.slice(0, shownResults.length + 3));
      setShowMore(allResults.length > shownResults.length);
    } else {
      setShowMore(false);
    }
  };

  return {
    profile: searchedProfile,
    handleSearch,
    handleShowMore,
    loading,
    showMore,
    results: shownResults,
  };
};
