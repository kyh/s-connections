import type { Connection } from "lib/useConnections";
import type { Profile } from "lib/profile";

import { useEffect, useState } from "react";
import { getProfile } from "lib/profile";

export const ConnectionItem = ({
  name,
  email,
  totalInteractionsCount,
  withinYearInteractionsCount,
  companies,
}: Connection) => {
  const [profile, setProfile] = useState<Profile | null>(
    name ? { name, email } : null
  );

  useEffect(() => {
    const load = async () => {
      const profile = await getProfile(email, "email");
      setProfile(profile);
    };
    load();
  }, []);

  return (
    <li>
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1 md:grid md:grid-cols-2 md:gap-4">
          <div>
            {profile ? (
              <>
                <p className="text-sm font-medium text-emerald-600 truncate">
                  {profile.name}
                </p>
                <p className="mt-1 flex items-center text-sm text-slate-500">
                  <span className="truncate">{profile.email}</span>
                </p>
                {companies && companies.length > 0 && (
                  <span className="mt-3 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Worked Together
                  </span>
                )}
              </>
            ) : (
              <>
                <p className="animate-pulse bg-slate-200 h-4 w-full rounded" />
                <p className="animate-pulse bg-slate-200 h-4 w-full mt-1 rounded" />
              </>
            )}
          </div>
          <div className="text-right text-sm">
            <p className="text-slate-900">
              Exchanged {totalInteractionsCount || 0} emails
            </p>
            <p className="mt-1 text-slate-500">
              {withinYearInteractionsCount || 0} in last year
            </p>
            {(companies || []).map((company) => {
              const start = company.start.toISOString().split("T")[0];
              const end = company.end
                ? company.end.toISOString().split("T")[0]
                : "Present";
              return (
                <p key={company.name} className="mt-1 text-slate-500">
                  At <span className="text-slate-900">{company.name}</span>{" "}
                  between {start} and {end}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </li>
  );
};
