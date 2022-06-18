import type { NextPage } from "next";
import type { Profile } from "lib/profile";
import type { InteractionsMap } from "lib/interactions";
import type { HistoryMap } from "lib/history";
import { useState } from "react";
import { getProfile } from "lib/profile";
import { getInteractions } from "lib/interactions";
import { getHistory } from "lib/history";
import { capitalizeFirstLetter } from "lib/utils";
import { ConnectionItem } from "components/ConnectionItem";

type Connection = {
  name: string;
  email: string;
  score: number;
} & HistoryMap["email"] &
  InteractionsMap["email"];

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Connection[] | null>([]);
  const [searchedProfile, setSearchedProfile] = useState<Profile | null>(null);
  const [resultsIndex, setResultsIndex] = useState(3);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const name = data.get("name") as string;

    setResultsIndex(3);
    setResults([]);
    setLoading(true);

    // It's difficult to search using Firebase, need to find a way better
    // string match
    const profile = await getProfile(capitalizeFirstLetter(name));

    if (profile) {
      setSearchedProfile(profile);

      const [interactionsMap, historyMap] = await Promise.all([
        getInteractions(profile.email),
        getHistory(profile.email),
      ]);

      const merged = [
        ...Object.keys(interactionsMap),
        ...Object.keys(historyMap),
      ].reduce((acc, email) => {
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
      }, {} as Record<string, Connection>);

      const sorted = Object.entries(merged)
        .map(([email, connection]) => ({ ...connection, email }))
        .sort((a, b) => b.score - a.score);

      setResults(sorted);
    } else {
      setResults(null);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen py-12 sm:px-6 lg:px-8 bg-slate-400">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white shadow-lg sm:rounded-lg pb-8">
          <form className="pt-8 px-4 sm:px-10" onSubmit={onSearch}>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Search Connections
            </label>
            <div className="mt-1 relative flex items-center">
              <input
                type="text"
                name="name"
                id="name"
                className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                autoFocus
              />
              <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                <kbd className="inline-flex items-center border border-gray-200 rounded px-2 text-sm font-sans font-medium text-gray-400">
                  ⌘K
                </kbd>
              </div>
            </div>
          </form>
          {loading && <div className="mt-5 text-center">Loading...</div>}
          {results ? (
            <>
              {searchedProfile && !loading && (
                <div className="sticky top-0 flex justify-between mt-5 py-2 px-4 text-sm text-slate-600 bg-slate-100 sm:px-6">
                  <span>Found {searchedProfile?.name}</span>
                  <span>{searchedProfile?.email}</span>
                </div>
              )}
              <ul role="list" className="mt-3 divide-y divide-gray-200">
                {results.map((result, index) =>
                  index < resultsIndex ? (
                    <ConnectionItem key={result.email} {...result} />
                  ) : null
                )}
              </ul>
              {results.length > resultsIndex + 3 && (
                <div className="mt-5 text-center">
                  <button
                    className="text-sm px-4 py-2 border rounded"
                    type="button"
                    onClick={() => setResultsIndex(resultsIndex + 3)}
                  >
                    Show more
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="mt-5 text-center">No results</div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
