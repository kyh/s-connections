import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "lib/db";

export type Profile = {
  name: string;
  email: string;
};

type Cache = {
  [key: string]: Profile;
};

const nameCache: Cache = {};
const emailCache: Cache = {};

export const getProfile = async (
  value: string,
  by: "name" | "email" = "name"
): Promise<Profile | null> => {
  if (by == "name" && nameCache[value]) return nameCache[value];
  if (by == "email" && emailCache[value]) return emailCache[value];

  const q = query(
    collection(db, "profiles"),
    orderBy(by),
    limit(1),
    where(by, ">=", value)
  );

  console.log("Searching profile for ", value);
  const snapshot = await getDocs(q);
  const [profileDoc] = snapshot.docs;

  if (!profileDoc) {
    console.log("No profile found");
    return null;
  }

  const profile = profileDoc.data() as Profile;

  updateCache(profile);

  return profile;
};

const updateCache = (profile: Profile) => {
  nameCache[profile.name] = profile as Profile;
  emailCache[profile.email] = profile as Profile;
};
