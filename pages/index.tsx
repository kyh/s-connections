import type { NextPage } from "next";

import { ConnectionForm } from "components/ConnectionForm";
import { ConnectionItem } from "components/ConnectionItem";
import { useConnections } from "lib/useConnections";

const Home: NextPage = () => {
  const { profile, handleSearch, loading, results, showMore, handleShowMore } =
    useConnections();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const name = data.get("name") as string;

    handleSearch(name);
  };

  return (
    <main className="min-h-screen py-12 sm:px-6 lg:px-8 bg-slate-400">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white shadow-lg sm:rounded-lg pb-8">
          <ConnectionForm onSubmit={onSubmit} />
          {loading && <div className="mt-8 text-center">Loading...</div>}
          {results ? (
            <>
              {profile && !loading && (
                <div className="sticky top-0 flex justify-between mt-8 py-2 px-4 text-sm text-slate-600 bg-slate-100 sm:px-6">
                  <span>Found {profile.name}</span>
                  <span>{profile.email}</span>
                </div>
              )}
              <ul role="list" className="divide-y divide-slate-200">
                {results.map((result) => (
                  <ConnectionItem key={result.email} {...result} />
                ))}
              </ul>
              {showMore && (
                <div className="mt-5 text-center">
                  <button
                    className="text-sm px-4 py-2 border rounded transition hover:bg-slate-100"
                    type="button"
                    onClick={handleShowMore}
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
