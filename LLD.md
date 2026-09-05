# CodeNest --- Low-Level Design (LLD)

**Version:** 1.0\
**Status:** Current implementation / deployment preparation

## 1. Project Structure

``` text
src/
├── actions/          # Server Actions
├── app/              # Next.js routes/pages
├── features/         # Feature-specific React components
├── lib/              # Shared clients/utilities
└── models/           # Mongoose models

prisma/
└── schema.prisma

server.ts             # Node + Next.js + Socket.IO server
```

## 2. Authentication

### `src/lib/auth.ts`

Configures Better Auth and the Prisma adapter. The production base URL
is supplied through `BETTER_AUTH_URL`.

### `src/app/api/auth/[...all]/route.ts`

Provides the Next.js route-handler entry point for Better Auth.

### `src/lib/auth-client.ts`

Creates the client auth instance without a hardcoded localhost URL.

### Login flow

``` text
Login Page
  ↓
authClient.signIn.email()
  ↓
Better Auth
  ↓
Session
  ↓
/dashboard
```

## 3. PostgreSQL Data Model

The Prisma schema contains:

``` text
User
Session
Account
Verification
Workspace
WorkspaceMember
Conversation
ConversationParticipant
Message
```

Workspace membership is a relationship between users and workspaces and
contains the user's role.

Conversations support:

``` text
DIRECT
WORKSPACE
```

Messages belong to conversations and users.

## 4. Server Action Pattern

Protected Server Actions generally follow:

``` text
Input
 ↓
Get session
 ↓
Validate input
 ↓
Check authorization
 ↓
Database/external operation
 ↓
Return result
```

This prevents the client from being the source of authorization
decisions.

## 5. SQL JOIN

Workspace member retrieval uses an explicit parameterized PostgreSQL
`INNER JOIN` conceptually equivalent to:

``` sql
SELECT ...
FROM workspace_member wm
INNER JOIN "user" u
  ON wm."userId" = u.id
WHERE wm."workspaceId" = $1;
```

This combines membership information with user information in one
relational query.

## 6. Workspace Authorization

Protected workspace operations verify the authenticated user's
membership.

Owner-only actions additionally verify:

``` text
role === OWNER
```

## 7. Messaging

Server actions support message retrieval, sending, editing, and
deletion.

The send flow is:

``` text
sendMessage()
   ↓
Authenticate
   ↓
Validate
   ↓
Authorize conversation
   ↓
Create Message with Prisma
   ↓
Real-time update
```

## 8. Socket.IO Server

`server.ts` creates the HTTP server and attaches Socket.IO:

``` text
createServer()
   ├── Next.js request handler
   └── Socket.IO
```

Production settings:

``` text
hostname = 0.0.0.0
port = process.env.PORT
```

Socket.IO is configured with the application origin from
`BETTER_AUTH_URL`.

## 9. Socket Authentication

During the handshake:

``` text
Socket connection
 ↓
auth.api.getSession()
 ↓
No session → Unauthorized
 ↓
socket.data.userId = session.user.id
 ↓
Connection accepted
```

Authenticated sockets join their user room.

## 10. Conversation Room Authorization

For `join-conversation`, the server queries Prisma using the
authenticated user ID and conversation ID.

Direct conversations require participation.

Workspace conversations require relevant workspace membership.

Only an authorized socket joins:

``` text
conversation:<conversationId>
```

## 11. Client Socket Lifecycle

`SocketConnection.tsx` controls connection lifecycle:

``` text
Component mounts
 ↓
socket.connect()
 ↓
Real-time connection
 ↓
Component unmounts
 ↓
socket.disconnect()
```

`src/lib/socket.ts` uses:

``` ts
io({ autoConnect: false })
```

Because no URL is supplied, the client uses the current browser origin.

## 12. Search and Debouncing

Search state is managed on the client.

A reusable debounce helper delays callback execution until the user
stops changing the query for the configured delay.

Conceptually:

``` text
Typing
 ↓
debounce()
 ↓
300ms quiet period
 ↓
searchApp()
 ↓
Server-side search
 ↓
Update results
```

The scheduled callback can be cancelled during component cleanup.

## 13. MongoDB CodeReview Model

`src/models/CodeReview.ts` stores:

``` text
userId
title
code
summary
severity
issues
improvedCode
createdAt
updatedAt
```

Issues are embedded:

``` text
CodeReview
 └── issues[]
      ├── title
      ├── explanation
      └── suggestion
```

`userId` is indexed because review history is queried by authenticated
user.

## 14. MongoDB CRUD

AI review history uses real MongoDB CRUD:

``` text
Create → CodeReview.create()
Read   → CodeReview.find()
Update → CodeReview.findOneAndUpdate()
Delete → CodeReview.findOneAndDelete()
```

Ownership constraints use the authenticated user's ID.

## 15. Review History

`src/actions/getReviewHistory.ts` retrieves the authenticated user's
reviews conceptually using:

``` text
CodeReview.find({
  userId: session.user.id
}).sort({ createdAt: -1 })
```

The history list uses summary metadata rather than requiring the full
review payload.

Review history supports rename and deletion through dedicated server
actions.

## 16. Gemini Integration

`src/lib/gemini.ts` creates the server-side Gemini client.

The key is:

``` text
GEMINI_API_KEY
```

It must not be exposed through a `NEXT_PUBLIC_` variable.

## 17. AI Review Action

`src/actions/reviewCode.ts`:

1.  Authenticates the user.
2.  Validates code input.
3.  Rejects empty input.
4.  Enforces the configured input-length limit.
5.  Builds the review prompt.
6.  Calls Gemini.
7.  Requests structured JSON.
8.  Parses the result.
9.  Persists the review in MongoDB.
10. Returns the structured result.

## 18. AI Prompt Design

The prompt defines the AI as a programming code-review assistant.

It asks the model to explain code, identify bugs/problems, explain why
issues occur, suggest improvements, provide improved code, and return
structured output.

The submitted code is treated as untrusted input, and the prompt
instructs the model not to follow embedded instructions that attempt to
override its review role.

The AI should not claim that code was actually executed or tested.

## 19. AI Response Contract

The response is conceptually:

``` ts
{
  title: string;
  summary: string;
  severity: "low" | "medium" | "high";
  issues: {
    title: string;
    explanation: string;
    suggestion: string;
  }[];
  improvedCode: string;
}
```

## 20. AI UI

The AI interface provides:

-   Code input.
-   Review action.
-   Loading state.
-   Error state.
-   Summary.
-   Severity.
-   Issue list.
-   Suggestions.
-   Improved code.

CodeNest AI remains separate from the messaging model.

## 21. Environment Variables

``` text
DATABASE_URL
MONGODB_URI
GEMINI_API_KEY
BETTER_AUTH_URL
BETTER_AUTH_SECRET
```

`.env.example` contains placeholders only. Real secrets belong in
local/deployment environment configuration.

## 22. Build and Start

Build:

``` bash
npm run build
```

which executes:

``` text
prisma generate
 ↓
next build
```

Production start:

``` bash
npm start
```

which runs the custom Node server in production mode.

## 23. Error Handling

Important failure cases include missing authentication, unauthorized
membership, invalid roles, invalid input, missing records, database
failures, and failed Gemini requests.

Interactive components expose loading/error states where appropriate.

## 24. Implementation Boundary

The following are not implemented V1 features:

-   Reactions
-   Mentions
-   File attachments
-   Advanced presence
-   AI streaming
-   RAG
-   Tool/function calling
-   Rate limiting
-   Automated testing
-   Docker

They remain future scope.
