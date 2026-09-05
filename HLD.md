# CodeNest --- High-Level Design (HLD)

**Version:** 1.0\
**Status:** Current implementation / deployment preparation

## 1. System Overview

CodeNest is a full-stack web application built with Next.js, React, and
TypeScript. It combines Next.js Server Actions, a custom Node.js server,
Socket.IO, Better Auth, PostgreSQL/Prisma, MongoDB/Mongoose, and Google
Gemini.

## 2. High-Level Architecture

``` text
                         ┌──────────────────────┐
                         │       Browser        │
                         │   React / Next.js    │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
             Next.js application              Socket.IO Client
                    │                               │
          ┌─────────┴─────────┐                     │
          │                   │                     ▼
          ▼                   ▼              Socket.IO Server
   Server Components    Server Actions             │
          │                   │                     │
          │          ┌────────┴────────┐            │
          │          │                 │            │
          ▼          ▼                 ▼            ▼
       Prisma   Better Auth        Gemini API   Real-time rooms
          │          │                 │
          ▼          ▼                 ▼
     PostgreSQL   Sessions        Structured AI
                                      │
                                      ▼
                                  MongoDB
                              Review history
```

## 3. Major Components

### Frontend

React/Next.js components provide the UI. Client components manage
interactive state, search, messaging, workspace dialogs, AI
interactions, and Socket.IO lifecycle. Tailwind CSS and shadcn/ui
provide the UI system.

### Backend

CodeNest uses Next.js Server Actions rather than a separate Express
backend. A custom Node.js server starts Next.js and attaches Socket.IO
to the same HTTP server.

### Authentication

Better Auth manages email/password authentication and sessions. The
Prisma adapter stores authentication-related data in PostgreSQL.

### Databases

PostgreSQL stores relational application data. MongoDB stores AI review
history.

### AI

Gemini is called only from the server-side AI flow. Structured output
provides a predictable response contract.

## 4. Application Routing

Conceptually:

``` text
src/app/
├── (auth)/
│   ├── login/
│   └── signup/
├── (app)/
│   ├── dashboard/
│   ├── DM/[conversationId]/
│   ├── workspace/[workspaceId]/
│   ├── workspace/new/
│   └── ai/
├── api/
│   ├── auth/[...all]/
│   └── user/
└── page.tsx
```

## 5. Authorization

Authorization occurs on the server.

``` text
Request
  ↓
Get session
  ↓
Check membership/ownership
  ↓
Check role when required
  ↓
Perform operation
```

The browser is not treated as the security boundary.

## 6. Database Architecture

PostgreSQL entities include:

-   User
-   Session
-   Account
-   Verification
-   Workspace
-   WorkspaceMember
-   Conversation
-   ConversationParticipant
-   Message

Conceptual relationships:

``` text
User
 ├── Session
 ├── Account
 ├── WorkspaceMember
 ├── Message
 └── ConversationParticipant

Workspace
 ├── WorkspaceMember
 └── Conversation

Conversation
 ├── Message
 └── ConversationParticipant
```

MongoDB contains `CodeReview` documents with embedded issues.

## 7. Real-Time Architecture

Authenticated sockets join:

``` text
user:<userId>
```

Conversation access is checked before joining:

``` text
conversation:<conversationId>
```

Current event patterns include new messages and workspace lifecycle
events such as workspace-added, workspace-left, and workspace-deleted.

## 8. Messaging Flow

``` text
Message UI
   ↓
sendMessage()
   ↓
Authenticate
   ↓
Authorize conversation
   ↓
Persist Message in PostgreSQL
   ↓
Socket.IO event
   ↓
conversation:<id>
   ↓
Connected clients update
```

## 9. CodeNest AI Architecture

CodeNest AI is a standalone `/ai` feature.

``` text
User
  ↓
CodeNest AI UI
  ↓
reviewCode()
  ├── Authenticate
  ├── Validate input
  └── Build prompt
          ↓
       Gemini API
          ↓
    Structured JSON
          ↓
     Parse result
          ↓
  Persist CodeReview
      in MongoDB
          ↓
      React UI
```

## 10. Security Boundaries

Server-side responsibilities include authentication, authorization,
database access, Gemini calls, secret access, and Socket.IO room
authorization.

Required sensitive configuration is supplied through environment
variables.

## 11. Error Handling

The system handles unauthenticated requests, unauthorized operations,
invalid roles, invalid input, missing records, database failures, and
external AI failures. Client components use loading/error states where
appropriate.

## 12. Deployment Architecture

The current production design uses one custom Node.js service capable of
serving both Next.js and Socket.IO.

The server uses `localhost` in development and `0.0.0.0` in production,
with `PORT` read from the environment.

Required environment variables:

``` text
DATABASE_URL
MONGODB_URI
GEMINI_API_KEY
BETTER_AUTH_URL
BETTER_AUTH_SECRET
```

The codebase is prepared for deployment. Deployment should only be
described as completed after the production service and end-to-end
functionality have actually been verified.
