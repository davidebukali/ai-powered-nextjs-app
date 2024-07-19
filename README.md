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

## Google AI

We use Gemini AI to analyze journal entries. Create an API key from [Google AI Studio](https://aistudio.google.com/app/apikey?_gl=1*dl1nx8*_ga*MTYyMjk3NzAyNi4xNzE3NjAxMTg4*_ga_P1DBVKWT6V*MTcxNzYwMTE4OC4xLjEuMTcxNzYwMTQxMS41NS4wLjE4NDc5NTU5NTE.)

## Semantic Search

Added using pgvector extension from postgresql and open source [embeddings](https://openai.com/index/introducing-text-and-code-embeddings/) from [Hugging Face](https://huggingface.co/docs/transformers.js/pipelines).
