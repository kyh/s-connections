import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "lib/db";

type History = {
  name: string;
  email: string;
  company: string;
  start: Date;
  end: Date;
};

type Cache = {
  [email: string]: HistoryMap;
};

type Company = {
  name: string;
  start: Date;
  end: Date;
  score: number;
};

export type HistoryMap = {
  [email: string]: {
    name: string;
    email: string;
    companies: Company[];
    score: number;
  };
};

const cache: Cache = {};

export const getHistory = async (email: string) => {
  console.log("Searching history for", email);
  if (cache[email]) return cache[email];

  const historyCollection = collection(db, "histories");

  // Get history for this user
  const historyQuery = query(historyCollection, where("email", "==", email));
  const historySnapshot = await getDocs(historyQuery);

  const historyMap: HistoryMap = {};
  // Search for other people who worked at these companies between the dates
  for (const historyDoc of historySnapshot.docs) {
    const historyData = historyDoc.data();

    const history: History = {
      name: historyData.name,
      email: historyData.email,
      company: historyData.company,
      start: new Date(historyData.start_date),
      end: new Date(historyData.end_date),
    };

    // TODO: Would need to change the startDate & endDate data structure
    // in Firestore to query between two dates
    const companyQuery = query(
      historyCollection,
      where("company", "==", history.company)
      // where("startDate", ">", history.startDate)
      // where("endDate", "<", history.endDate)
    );
    const companySnapshot = await getDocs(companyQuery);

    // Extract snapshot, filter to only overlaps, and create history map
    companySnapshot.docs
      .map((d) => {
        const data = d.data();
        return {
          name: data.name,
          email: data.email,
          company: data.company,
          start: new Date(data.start_date),
          end: new Date(data.end_date),
        } as History;
      })
      // We can remove this if we backfill the db to use Date objects instead.
      .filter((d) => {
        if (
          d.name !== history.name &&
          history.start <= d.end &&
          d.start <= history.end
        )
          return true;
        return false;
      })
      // Create the history map
      .forEach((d) => {
        const overlapStart = history.start < d.start ? d.start : history.start;
        const overlapEnd = history.end < d.end ? history.end : d.end;

        if (!historyMap[d.email]) {
          historyMap[d.email] = {
            name: d.name,
            email: d.email,
            companies: [],
            score: 0,
          };
        }

        const score = monthDiff(overlapStart, overlapEnd);

        historyMap[d.email].companies.push({
          name: d.company,
          start: overlapStart,
          // Last date of overlap
          end: overlapEnd,
          score,
        });

        historyMap[d.email].score += score;
      });
  }

  cache[email] = historyMap;

  return historyMap;
};

const monthDiff = (start: Date, end: Date) => {
  return (
    end.getMonth() -
    start.getMonth() +
    12 * (end.getFullYear() - start.getFullYear())
  );
};
