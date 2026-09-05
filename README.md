# CodeNest

CodeNest is a full-stack developer collaboration platform built with
Next.js. It combines workspaces, direct and workspace messaging,
real-time communication, search, authentication, and an AI-powered
code-review feature.

## Features

-   Email/password authentication with Better Auth
-   Protected application functionality
-   Workspace creation and membership
-   Workspace roles: OWNER, ADMIN, MEMBER
-   Direct messaging
-   Workspace messaging
-   Persistent messages
-   Real-time Socket.IO communication
-   Message editing and deletion
-   Deleted-message state
-   Markdown and syntax-highlighted code blocks
-   Application search
-   CodeNest AI code review
-   Structured Gemini AI responses
-   MongoDB AI review history
-   Review rename and delete operations
-   Responsive UI with Tailwind CSS and shadcn/ui

## Tech Stack

  Area             Technology
  ---------------- ----------------------------------
  Frontend         Next.js 16, React 19, TypeScript
  Styling          Tailwind CSS, shadcn/ui
  Backend          Next.js Server Actions, Node.js
  Real-time        Socket.IO
  Relational DB    PostgreSQL + Prisma
  Document DB      MongoDB + Mongoose
  Authentication   Better Auth
  AI               Google Gemini + `@google/genai`

## Architecture

CodeNest uses PostgreSQL and MongoDB for different purposes.

PostgreSQL stores relational application data:

-   Users
-   Authentication/session data
-   Workspaces
-   Workspace members
-   Conversations
-   Conversation participants
-   Messages

MongoDB stores CodeNest AI review history. Review issues are embedded
inside each `CodeReview` document.

Socket.IO runs on the same custom Node.js server as Next.js.

``` text
Browser
   │
   ├── Next.js / Server Actions
   │       ├── Better Auth
   │       ├── Prisma → PostgreSQL
   │       └── Gemini → MongoDB review history
   │
   └── Socket.IO
           │
           └── Socket.IO Server
```

## CodeNest AI

CodeNest AI is a standalone feature at:

``` text
/ai
```

It is not modeled as a fake user or direct-message conversation.

``` text
User
  ↓
CodeNest AI
  ↓
reviewCode()
  ↓
Gemini
  ↓
Structured review
  ↓
MongoDB review history
  ↓
UI
```

The review contains:

-   Title
-   Summary
-   Severity
-   Issues
-   Improved code

Each issue contains:

-   Title
-   Explanation
-   Suggestion

The Gemini API key is accessed only on the server.

## Project Structure

``` text
codenest/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
├── src/
│   ├── actions/
│   ├── app/
│   ├── features/
│   ├── lib/
│   └── models/
├── .env.example
├── next.config.ts
├── package.json
├── server.ts
└── tsconfig.json
```

## Requirements

You need:

-   Node.js
-   npm
-   PostgreSQL
-   MongoDB
-   Gemini API key
-   Better Auth secret

## Installation

Clone the repository:

``` bash
git clone <your-repository-url>
cd codenest
```

Install dependencies:

``` bash
npm install
```

## Environment Variables

Create a local `.env` file using `.env.example`:

``` env
DATABASE_URL=
MONGODB_URI=
GEMINI_API_KEY=
BETTER_AUTH_URL=
BETTER_AUTH_SECRET=
```

For local development:

``` env
BETTER_AUTH_URL=http://localhost:3000
```

Do not commit `.env` or real secret values.

## Database Setup

Generate the Prisma client:

``` bash
npx prisma generate
```

Apply existing migrations to the configured database:

``` bash
npx prisma migrate deploy
```

MongoDB only requires a valid `MONGODB_URI`; the application manages its
Mongoose connection.

## Development

Start the application:

``` bash
npm run dev
```

Then open:

``` text
http://localhost:3000
```

The custom Node server starts Next.js and Socket.IO together.

## Production Build

``` bash
npm run build
```

The build runs:

``` text
prisma generate
 ↓
next build
```

Start production:

``` bash
npm start
```

The production server binds to `0.0.0.0` and uses the hosting provider's
`PORT` environment variable.

## Scripts

``` text
npm run dev
npm run build
npm start
npm run lint
```

## Authentication

Better Auth manages email/password authentication and sessions.

Protected operations retrieve the authenticated session on the server.

## Real-Time Messaging

Authenticated sockets join a user room:

``` text
user:<userId>
```

Before a conversation room is joined, the server checks whether the
authenticated user has access:

``` text
conversation:<conversationId>
```

The client uses:

``` ts
io({ autoConnect: false })
```

so the React SocketConnection component controls connection lifecycle.

## Security

The current implementation uses:

-   Server-side authentication.
-   Server-side authorization.
-   Workspace membership checks.
-   Owner-role checks.
-   Conversation access checks before Socket.IO room joins.
-   AI review ownership checks.
-   Server-side Gemini API access.
-   Environment variables for secrets.
-   `.env.example` placeholders without secret values.

## Engineering Notes

CodeNest deliberately uses different storage models:

-   PostgreSQL for strongly relational collaboration data.
-   MongoDB for document-oriented AI review history.

The project also demonstrates TypeScript, React state/effects, Server
Actions, Socket.IO rooms, search debouncing, SQL joins, structured AI
output, and environment-based configuration.

## Current V1 Scope

Implemented:

-   Authentication
-   Workspaces
-   Workspace membership and roles
-   Direct messaging
-   Workspace messaging
-   Message persistence
-   Real-time messaging
-   Message editing/deletion
-   Search
-   Markdown/code rendering
-   CodeNest AI
-   Structured AI output
-   MongoDB review persistence
-   Review history management

## Future Scope

Potential future work:

-   File/image uploads
-   Notifications
-   Presence
-   Typing indicators
-   Reactions
-   Mentions
-   AI streaming
-   RAG
-   AI tool/function calling
-   Evaluation datasets
-   Token/cost monitoring
-   Rate limiting
-   Automated testing
-   Docker

These are future possibilities, not completed V1 features.

## Documentation

-   `PRD.md` --- product requirements and scope
-   `HLD.md` --- high-level architecture
-   `LLD.md` --- implementation-level design
-   `README.md` --- setup and project overview

## Deployment Status

The codebase is prepared for production deployment, including production
server binding, environment-variable configuration, Socket.IO setup, and
a production build script.

The project should only be described as deployed after the production
host, databases, environment variables, authentication, AI, and
real-time functionality have been verified end-to-end.

## License

This is a portfolio/academic software project.
