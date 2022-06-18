import type { InteractionsMap } from "lib/interactions";
import type { HistoryMap } from "lib/history";
import type { Profile } from "lib/profile";

import { useEffect, useState } from "react";
import { MailIcon } from "@heroicons/react/solid";
import { getProfile } from "lib/profile";

type Connection = {
  name: string;
  email: string;
  score: number;
} & HistoryMap["email"] &
  InteractionsMap["email"];

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
                <p className="mt-2 flex items-center text-sm text-gray-500">
                  <MailIcon
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="truncate">{profile.email}</span>
                </p>
                {companies && companies.length > 0 && (
                  <span className="mt-2 inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Worked Together
                  </span>
                )}
              </>
            ) : (
              <>
                <p className="animate-pulse bg-slate-200 h-4 w-full rounded" />
                <p className="animate-pulse bg-slate-200 h-4 w-full mt-2 rounded" />
              </>
            )}
          </div>
          <div className="text-right text-sm">
            <p className="text-gray-900">
              Exchanged {totalInteractionsCount} emails
            </p>
            <p className="mt-2 text-gray-500">
              {withinYearInteractionsCount} in last year
            </p>
            {(companies || []).map((company) => {
              const start = company.start.toISOString().split("T")[0];
              const end = company.end
                ? company.end.toISOString().split("T")[0]
                : "Present";
              return (
                <p key={company.name} className="mt-2 text-gray-500">
                  At <span className="text-gray-900">{company.name}</span>{" "}
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
