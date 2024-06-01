## Getting Started

First, install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication

Create an account at [Clerk](https://clerk.com/) to manage authentication and add api keys to `.env.local`

## Database

Create a database and add a connection string using details from [Neon website](https://neon.tech/docs/guides/prisma#connect-to-neon-from-prisma)

Open prisma studio to view the database entries:

```bash
npx prisma studio
```

To push schema changes to the database repository:

```bash
npx prisma db push
```

Please check [Prisma documentation](https://www.prisma.io/docs) for more features

## Todo

Add vector search to journal entries so that we can perform semantic search on the entire dataset.
