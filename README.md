# CodeNest

CodeNest is a full-stack developer collaboration platform that combines real-time communication, workspace management, direct messaging, and AI-powered code review.

The project is designed as a portfolio-quality application while demonstrating practical full-stack engineering concepts including authentication, authorization, relational and document databases, real-time communication, and LLM integration.

---

## Features

### Authentication

- Email/password authentication
- Better Auth
- PostgreSQL-backed authentication data
- Protected application routes
- Server-side session verification

### Workspaces

- Create workspaces
- Workspace membership
- Workspace roles
- Owner, Admin, and Member roles
- Add members
- View workspace members
- Leave a workspace
- Owner-only workspace deletion
- Real-time workspace events

### Messaging

CodeNest supports two types of communication:

- Workspace conversations
- Direct messages

Messaging includes:

- Persistent messages
- Real-time messaging with Socket.IO
- Message editing
- Message deletion
- Deleted-message state
- Markdown rendering
- Code blocks
- Syntax highlighting

Direct-message deletion is account-specific. Deleting a DM removes it only for the account performing the deletion and does not globally delete it for the other participant.

### Search

Search functionality is available for:

- Users
- Workspaces
- Direct conversations

---

# CodeNest AI

CodeNest AI is a standalone code-review feature available at:

```text
/ai
```

It is not modeled as a fake user or as a direct-message conversation.

The AI workflow is:

```text
User
  ↓
CodeNest AI
  ↓
Gemini API
  ↓
Structured Code Review
  ↓
MongoDB
  ↓
Review History
```

Users can submit source code and receive a structured review containing:

- Review title
- Summary
- Severity
- Issues
- Suggestions
- Improved code

Each issue contains:

- Title
- Explanation
- Suggestion

The AI is instructed to review the submitted code and provide recommendations without claiming that code was actually executed or tested.

---

# AI Review History

AI review results are persisted in MongoDB.

Users can:

- View previous reviews
- Rename reviews
- Delete reviews

Review history is protected by authentication and ownership checks.

A user can only access and modify their own reviews.

The review document contains:

```text
CodeReview
├── userId
├── title
├── code
├── summary
├── severity
├── issues[]
│   ├── title
│   ├── explanation
│   └── suggestion
├── improvedCode
├── createdAt
└── updatedAt
```

The `issues` array is embedded inside the `CodeReview` document because issues belong directly to a review and do not currently have an independent lifecycle.

The PostgreSQL user's ID is stored as `userId` rather than duplicating the complete user record in MongoDB.

`userId` is indexed because review history is commonly queried by authenticated user.

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- React Markdown
- React Syntax Highlighter

## Backend

- Next.js Server Actions
- Node.js
- Socket.IO

## Databases

- PostgreSQL
- Prisma
- MongoDB
- Mongoose

## Authentication

- Better Auth
- Prisma adapter
- Email/password authentication

## AI

- Google Gemini API
- `@google/genai`
- Structured AI output

## Real-Time Communication

- Socket.IO
- socket.io-client

---

# Database Architecture

CodeNest intentionally uses two databases for different responsibilities.

## PostgreSQL

PostgreSQL is the core relational database.

It stores application data including:

- Users
- Authentication/session-related data
- Workspaces
- Workspace memberships
- Conversations
- Conversation participants
- Messages

Prisma is used as the PostgreSQL ORM.

## MongoDB

MongoDB is used specifically for AI code-review history.

MongoDB demonstrates:

- Document schema modeling
- CRUD operations
- Embedded documents
- Referencing data across systems
- Indexing

This separation allows CodeNest to demonstrate both relational and document-oriented database design.

---

# Architecture

```text
                         Browser
                            │
                            ▼
                    ┌───────────────┐
                    │    Next.js    │
                    │   Application │
                    └───────┬───────┘
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
        Better Auth      Prisma        Socket.IO
             │              │              │
             │              ▼              │
             │        PostgreSQL           │
             │                             │
             │              Next.js Server │
             │                    │        │
             │              ┌─────┴─────┐  │
             │              ▼           ▼  │
             │          Gemini API   MongoDB
             │                          │
             │                          ▼
             │                    AI Review History
             │
             └──────────── Authentication
```

---

# Security

CodeNest follows server-side authorization principles.

The frontend is not treated as the authorization boundary.

Protected operations verify the appropriate combination of:

- Authentication
- Workspace membership
- Workspace role
- Resource ownership

For example, AI review update and delete operations verify both:

```text
reviewId
+
authenticated user ID
```

This prevents users from modifying another user's review.

The Gemini API key is stored server-side using environment variables and is never exposed to the browser.

---

# Real-Time Communication

Socket.IO is used for real-time application events.

Conversation-specific rooms use:

```text
conversation:<conversationId>
```

User-specific rooms use:

```text
user:<userId>
```

Real-time events include:

- New messages
- Workspace added
- Workspace left
- Workspace deleted

Socket listeners are cleaned up appropriately to avoid duplicate event handlers.

---

# Project Structure

```text
src/
├── actions/
├── app/
│   ├── (app)/
│   │   ├── dashboard/
│   │   ├── DM/
│   │   ├── workspace/
│   │   └── ai/
│   ├── (auth)/
│   └── globals.css
│
├── components/
│   ├── auth/
│   └── ui/
│
├── features/
│   ├── app/
│   │   ├── ai/
│   │   ├── chat/
│   │   ├── header/
│   │   ├── sidebar/
│   │   └── socket/
│   └── workspace/
│
├── lib/
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── gemini.ts
│   ├── mongodb.ts
│   ├── prisma.ts
│   ├── socket.ts
│   └── socket-server.ts
│
├── models/
│   └── CodeReview.ts
│
└── types/
```

---

# Environment Variables

Create a `.env` file containing the required environment variables for:

- PostgreSQL
- MongoDB
- Better Auth
- Gemini API

The exact secret values must remain local and must not be committed to Git.

At minimum, Better Auth requires:

```env
BETTER_AUTH_SECRET=your-random-secret
```

Generate a strong secret with:

```bash
openssl rand -base64 32
```

Make sure `.env` is included in `.gitignore`.

---

# Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application can then be opened using the local development URL provided by Next.js.

---

# Code Quality

Before committing changes, run:

```bash
npm run lint
```

For a production build:

```bash
npm run build
```

The project uses Git for version control.

Typical workflow:

```bash
git status
git add .
git commit -m "your commit message"
git push
```

---

# Documentation

The project documentation is maintained in:

```text
PRD.md
HLD.md
LLD.md
README.md
```

### PRD

Describes the product, requirements, users, features, scope, and product decisions.

### HLD

Describes the overall architecture, system components, database architecture, integrations, and major data flows.

### LLD

Describes implementation-level details including modules, models, server actions, database operations, authentication checks, and AI review flow.

These documents describe the current implemented system and should be updated when major features are added.

---

# Current V1 Features

The current implementation includes:

- Next.js application
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Better Auth
- PostgreSQL
- Prisma
- MongoDB
- Mongoose
- Authentication
- Protected routes
- User profiles/avatar
- Workspaces
- Workspace roles
- Workspace membership
- Add members
- Leave workspace
- Owner-only workspace deletion
- Direct messaging
- Workspace messaging
- Persistent messages
- Socket.IO real-time communication
- Message editing
- Message deletion
- Deleted-message state
- Markdown
- Code blocks
- Syntax highlighting
- Search
- Gemini API integration
- AI code review
- Structured AI output
- CodeNest AI standalone route
- MongoDB AI review persistence
- AI review history
- Review renaming
- Review deletion
- MongoDB CRUD
- MongoDB embedding
- MongoDB referencing
- MongoDB indexing

---

# Deferred Features

The following features are intentionally not part of the current V1 implementation:

- Reactions
- Mentions
- File uploads
- Notifications
- Presence
- Typing indicators
- AI streaming
- Function/tool calling
- RAG
- LLM evaluation sets
- Token/cost monitoring
- Rate limiting
- Automated testing
- Docker
- Production deployment

These may be considered in future versions if they provide meaningful product or engineering value.

---

# Project Goal

CodeNest is being developed as a portfolio-quality full-stack project.

The goal is not only to create a working application, but to demonstrate understanding of:

- Full-stack application architecture
- React and Next.js
- TypeScript
- Authentication and authorization
- Relational database design
- Document database design
- CRUD operations
- Real-time communication
- LLM integration
- Structured AI output
- Server-side security
- Git workflow
- Environment and secret management
