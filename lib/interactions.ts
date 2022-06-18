import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "lib/db";

type Interaction = {
  email: string;
  date: Date;
};

type Cache = {
  [email: string]: InteractionsMap;
};

export type InteractionsMap = {
  [email: string]: {
    totalInteractionsCount: number;
    withinYearInteractionsCount: number;
    score: number;
  };
};

const cache: Cache = {};

export const getInteractions = async (email: string) => {
  if (cache[email]) return cache[email];
  console.log("Searching interactions for", email);

  const fromQuery = query(
    collection(db, "interactions"),
    where("from", "==", email)
  );

  const toQuery = query(
    collection(db, "interactions"),
    where("to", "array-contains", email)
  );

  // Interactions are both emails from the user and to the user.
  // Possibly could be 1 API call rather than 2? Need to dive deeper into
  // FireStore API docs.
  const [fromSnapshot, toSnapshot] = await Promise.all([
    getDocs(fromQuery),
    getDocs(toQuery),
  ]);

  const fromInteractions = fromSnapshot.docs.reduce((interactions, d) => {
    const data = d.data();
    data.to.forEach((to: string) => {
      interactions.push({
        email: to,
        date: toDate(data.timestamp),
      });
    });
    return interactions;
  }, [] as Interaction[]);

  const toInteractions = toSnapshot.docs.map((d) => {
    const data = d.data();
    return {
      email: data.from,
      date: toDate(data.timestamp),
    } as Interaction;
  });

  const totalInteractions = [...fromInteractions, ...toInteractions];

  const interactionMap = createInteractionMap(totalInteractions);

  cache[email] = interactionMap;

  return interactionMap;
};

const toDate = (timestamp: string) => {
  // Timestamp from the DB is a string in seconds
  return new Date(Number(timestamp) * 1000);
};

const withinLastYear = (date: Date) => {
  const now = new Date().getTime();
  const lastYear = new Date(now - 365 * 24 * 60 * 60 * 1000);
  return date > lastYear;
};

const createInteractionMap = (interactions: Interaction[]) => {
  return interactions.reduce((map, { email, date }) => {
    if (!map[email]) {
      map[email] = {
        totalInteractionsCount: 0,
        withinYearInteractionsCount: 0,
        score: 0,
      };
    }

    const lastYear = withinLastYear(date);

    map[email].totalInteractionsCount++;
    map[email].withinYearInteractionsCount += lastYear ? 1 : 0;
    map[email].score += lastYear ? 3 : 2;

    return map;
  }, {} as InteractionsMap);
};
