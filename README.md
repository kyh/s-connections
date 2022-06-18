<img src="https://github.com/kyh/interview-sequoia/blob/main/docs/snapshot.png?raw=true" height="500" />

## Solution

There were 3 categories of decisions made in order to implement the take-home assignment:

- App architecture
- Data structure
- UI Design

#### App architecture

The web framework of choice is [`Next.js`](https://nextjs.org/) since it offers a fullstack React experience. I leveraged the existing Firestore database that was set up for this assignment for my backend, though it turned out to be more difficult than I expected in order to stitch the data on the frontend.

#### Data structure

Each of the 3 tables touched by the app has it's own set of modules in the `lib` directory in order to interact with the data. I centered around creating [multiple maps](https://github.com/kyh/interview-sequoia/blob/main/lib/interactions.ts#L13-L19) with a users "email" as the key since it can be used as a constant relationship between the models.

#### UI Design

Based the UI off the Mac Spotlight feature since the requirements follow a similar concept. I leveraged Tailwind CSS for the styling since it provides great looking defaults and working inline styles speeds up the development process.

### Improvements

Ideally, with more time there are a few things I would like to improve:

- Instead of querying Firestore directly, I would create a Next.js API handler and do the data stitching on the backend. This is helpful for two reasons:
  1. Less client code needs to be bundled and served improving initial load performance and
  2. we can optimize caching results for all client requests rather than a local client cache
- I may consider setting up a materialized view for the data the page view would be just a simple request rather than a series of cascading queries
- Add more relations to the Firestore database
- Frontend UI improvements like autocomplete, more interactions with the list, etc.

### Timeline

- Setting up 10 mins
- Implementing profile search: 30 mins
- Implementing interactions search: 30 mins
- Implementing history search: 30 mins
- Calculating scores: 1.5 hours
- Stitching data: 1 hour
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
