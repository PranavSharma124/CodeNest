# CodeNest --- High-Level Design (HLD)

## 1. System Overview

CodeNest is a full-stack web application built around Next.js.

The system combines: - React client components. - Next.js server
components and server actions. - PostgreSQL. - Prisma ORM. - Better
Auth. - Socket.IO. - Gemini AI.

------------------------------------------------------------------------

## 2. High-Level Architecture

``` text
                         ┌─────────────────────┐
                         │       Browser       │
                         │  React / Next.js UI │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
             Next.js Server                   Socket.IO Client
                    │                               │
          ┌─────────┴─────────┐                     │
          │                   │                     │
          ▼                   ▼                     ▼
   Server Components     Server Actions       Socket.IO Server
          │                   │                     │
          │                   ▼                     │
          │                Better Auth              │
          │                   │                     │
          ▼                   ▼                     ▼
       Prisma             PostgreSQL          Real-Time Events
          │
          ▼
     Application Data

                    Server-side AI
                         │
                         ▼
                    Gemini API
```

------------------------------------------------------------------------

## 3. Major Components

### Frontend

The frontend uses: - React. - Next.js App Router. - TypeScript. -
Tailwind CSS. - shadcn/ui. - Lucide icons.

Client components manage interactive UI such as: - Sidebar. - Search. -
Messaging. - Message editing/deletion. - Workspace dialogs. - CodeNest
AI interface.

Server components are used where server-side data fetching is
appropriate.

------------------------------------------------------------------------

## 4. Application Routing

The main application route structure is organized under the `(app)`
route group.

Conceptually:

``` text
/app
  /(app)
    /dashboard
    /DM/[conversationId]
    /workspace/[workspaceId]
    /workspace/new
    /ai
    /layout.tsx
```

Authentication routes are separated under `(auth)`.

------------------------------------------------------------------------

## 5. Backend Architecture

CodeNest primarily uses Next.js server-side functionality rather than a
separate Express backend.

Server Actions are responsible for operations such as: - Creating
workspaces. - Adding members. - Deleting workspaces. - Leaving
workspaces. - Fetching workspace data. - Fetching conversations. -
Sending messages. - Editing messages. - Deleting messages. - Searching
application data. - Calling Gemini for CodeNest AI.

------------------------------------------------------------------------

## 6. Authentication Architecture

Better Auth manages authentication and sessions.

Simplified flow:

``` text
User
  │
  ▼
Login / Signup
  │
  ▼
Better Auth
  │
  ▼
Session
  │
  ▼
Authenticated request
  │
  ▼
Server Action / Server Component
```

Protected operations retrieve the current session on the server.

The browser is not treated as the security boundary.

------------------------------------------------------------------------

## 7. Authorization

Authorization is performed server-side.

Example workspace deletion flow:

``` text
Request
  │
  ▼
Get session
  │
  ├── No session → Unauthorized
  │
  ▼
Find WorkspaceMember
  │
  ├── No membership → Unauthorized
  │
  ▼
Check role
  │
  ├── Not OWNER → Forbidden
  │
  ▼
Delete workspace
```

Similar authorization checks are used for workspace membership and
conversations.

------------------------------------------------------------------------

## 8. Database Architecture

PostgreSQL is the primary relational database.

Prisma is used as the ORM.

The application contains authentication data plus application data
for: - Users. - Workspaces. - Workspace members. - Conversations. -
Conversation participants. - Messages.

Conceptual relationship:

``` text
User
 │
 ├── Session
 ├── Account
 ├── WorkspaceMember
 ├── Message
 └── ConversationParticipant

Workspace
 │
 ├── WorkspaceMember
 └── Conversation

Conversation
 │
 ├── Message
 └── ConversationParticipant
```

Workspace membership connects users and workspaces and contains a role.

------------------------------------------------------------------------

## 9. Real-Time Architecture

Socket.IO provides bidirectional real-time communication.

The application maintains a client Socket.IO connection.

### Conversation Rooms

When a user opens a conversation, the socket joins a
conversation-specific room:

``` text
conversation:<conversationId>
```

Messages can then be broadcast to users in that room.

### User Rooms

Authenticated sockets can also use a user-specific room:

``` text
user:<userId>
```

This is useful for events targeted at one user's sidebar or application
state.

### Example: Workspace Added

``` text
User A adds User B
       │
       ▼
WorkspaceMember created
       │
       ▼
Socket.IO event
       │
       ▼
user:<User B>
       │
       ▼
workspace-added
       │
       ▼
User B sidebar refreshes
```

------------------------------------------------------------------------

## 10. Workspace Deletion

Workspace deletion follows:

``` text
Owner
  │
  ▼
Delete Workspace
  │
  ├── Verify authentication
  ├── Verify membership
  ├── Verify OWNER role
  ├── Delete workspace
  └── Notify affected clients
          │
          ▼
    workspace-deleted
          │
          ▼
    Sidebar updates
          │
          ▼
    Active workspace user redirects
```

------------------------------------------------------------------------

## 11. Leave Workspace

Workspace owners cannot leave their own workspace because the owner is
responsible for workspace lifecycle.

Members can leave.

Conceptual flow:

``` text
Member
  │
  ▼
Leave Workspace
  │
  ▼
Verify authentication
  │
  ▼
Find membership
  │
  ├── Not found → Error
  │
  ▼
Check role
  │
  ├── OWNER → Reject
  │
  ▼
Delete membership
  │
  ▼
Emit workspace-left
  │
  ▼
Member's sidebar removes workspace
```

------------------------------------------------------------------------

## 12. Messaging Architecture

Message flow:

``` text
MessageInput
    │
    ▼
sendMessage()
    │
    ▼
Authenticate user
    │
    ▼
Authorize conversation access
    │
    ▼
Prisma creates Message
    │
    ▼
Socket.IO
    │
    ▼
conversation:<id>
    │
    ▼
MessageList
    │
    ▼
MessageItem
```

Messages are persisted in PostgreSQL before being displayed through the
real-time system.

------------------------------------------------------------------------

## 13. CodeNest AI Architecture

CodeNest AI is a separate application feature from Direct Messages.

It should be treated as an AI assistant, not as another
user/conversation.

``` text
Sidebar
   │
   ▼
CodeNest AI
   │
   ▼
AI UI
   │
   ▼
reviewCode()
   │
   ├── Authenticate user
   ├── Validate input
   ├── Build prompt
   │
   ▼
Gemini API
   │
   ▼
Structured JSON
   │
   ▼
Server Action
   │
   ▼
React UI
```

The Gemini API key remains server-side.

------------------------------------------------------------------------

## 14. AI Structured Output

The AI response is represented using a predictable structure:

``` text
{
  summary,
  severity,
  issues[],
  improvedCode
}
```

This allows the frontend to render the AI result consistently instead of
parsing arbitrary natural-language text.

------------------------------------------------------------------------

## 15. Security Boundaries

The browser is treated as an untrusted client.

Sensitive operations occur on the server: - Authentication checks. -
Authorization checks. - Database operations. - Gemini API calls. -
Secret access.

Environment variables are used for sensitive configuration.

------------------------------------------------------------------------

## 16. Error Handling

Application operations use server-side error handling and client-side
loading/error states.

Examples: - Unauthorized user. - Missing workspace membership. - Invalid
workspace role. - Empty message/code input. - Invalid AI request. -
Failed AI response. - Database failures.

------------------------------------------------------------------------

## 17. Deployment Architecture

The production deployment will contain: - Next.js application/server. -
PostgreSQL database. - Required environment variables. - Socket.IO
server functionality. - Gemini API access.

The exact hosting provider and final deployment configuration are part
of the deployment phase.

------------------------------------------------------------------------

## 18. Design Principles

CodeNest follows these high-level principles: - Server-side
authorization. - Separation of UI and server logic. - Feature-oriented
organization. - Persistent relational data. - Real-time synchronization
through Socket.IO. - Type-safe development with TypeScript. - Secrets
kept on the server. - AI responses constrained through structured
output.
