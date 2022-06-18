<img src="https://github.com/kyh/interview-sequoia/blob/main/docs/snapshot.png?raw=true" height="500" />

## Solution

> https://ssearch.vercel.app/

There were 3 categories of decisions made in order to implement the take-home assignment:

- App architecture
- Data structure
- UI Design

#### App architecture

The web framework of choice is [`Next.js`](https://nextjs.org/) since it offers a fullstack React experience. I leveraged the existing Firestore database that was set up for this assignment for my backend, though it turned out to be more difficult than I expected in order to stitch the data on the frontend. I may have done things slightly differently given this experience and more time, more on that below.

#### Data structure

Each of the 3 tables touched by the app has it's own set of modules in the `lib` directory in order to interact with the data. I centered around creating [a mapping](https://github.com/kyh/interview-sequoia/blob/main/lib/interactions.ts#L13-L19) from the users `email` to their calculated data values to act as a cache and the join key between models.

#### UI Design

Based the UI off the Mac Spotlight feature since the requirements follow a similar concept. I leveraged Tailwind CSS for the styling since it provides great looking defaults and working with the inline style process speeds up the development process. I would break these up into smaller components to make it more maintainable.

### Improvements

Ideally, with more time there are a few things I would like to improve:

- Instead of querying Firestore directly, I would create a Next.js API handler and do the data stitching on the backend. This is helpful for two reasons:
  1. Less client code needs to be bundled and served improving initial load performance and
  2. we can optimize caching results for all client requests rather than a local client cache
- I may consider setting up a materialized view for the data. Searching would then be just a simple request rather than a series of cascading queries
- Add better relationship keys directly in the Firestore database. Leverage [cloud functions](https://firebase.google.com/docs/firestore/extend-with-functions) to pre-compute these values
- Frontend UI improvements like autocomplete, more interactions with the list, break up UI into smaller components.

### Timeline

- Setting up 10 mins
- Implementing profile search: 30 mins
- Implementing interactions search: 30 mins
- Implementing history search: 30 mins
- Calculating scores and stitching data: 2 hours
- UI: 1 hour
- Docs, bit of cleanup, deployment: 30 mins

Total Time: ~6 hours

### File structure

```
├── /lib                     # Feature source code (most of the logic lives here)
├── /components              # Reusable shared components
└── /pages                   # Next.js Routing
```

### Setup

#### Prerequisites

- [Node.js](https://nodejs.org/en/) - LTS version recommended

#### Installation and Running

```sh
npm i

# Local development
npm run dev
# This command starts a local development instance of the server accessible at:
# http://localhost:3000
```

### Stack

- Framework - [Next.js](https://nextjs.org/)
- Styling - [Tailwind](https://tailwindcss.com)
- Database - [Firestore](https://firebase.google.com/docs/firestore)
