# CodeNest — High-Level Design

## 1. Introduction

CodeNest is a full-stack developer collaboration platform built with Next.js, React, TypeScript, PostgreSQL, MongoDB, Better Auth, Prisma, Socket.IO, and the Gemini API.

The system combines relational application data with document-oriented AI review history.

## 2. High-Level Architecture

```text
                         ┌──────────────────────┐
                         │       Browser        │
                         │ React / Next.js UI   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Next.js Application│
                         │                      │
                         │ Server Components   │
                         │ Client Components   │
                         │ Server Actions      │
                         └──────┬───────┬───────┘
                                │       │
                  ┌─────────────┘       └─────────────┐
                  ▼                                   ▼
          ┌──────────────┐                    ┌──────────────┐
          │ Better Auth  │                    │  Socket.IO   │
          │              │                    │ Real-time    │
          └──────┬───────┘                    └──────┬───────┘
                 │                                   │
                 ▼                                   │
          ┌──────────────┐                           │
          │ PostgreSQL   │◄──────────────────────────┘
          │              │
          │ Core data    │
          └──────────────┘

                 Next.js Server
                       │
              ┌────────┴────────┐
              ▼                 ▼
       ┌──────────────┐  ┌──────────────┐
       │   Gemini API │  │   MongoDB    │
       │              │  │              │
       │ Code review  │  │ AI review    │
       │ generation   │  │ history      │
       └──────────────┘  └──────────────┘
```

## 3. Frontend Architecture

The frontend uses:

- Next.js.
- React.
- TypeScript.
- Tailwind CSS.
- shadcn/ui.
- Lucide React.
- React Markdown.
- React Syntax Highlighter.

The application uses server and client components according to their responsibilities.

Server components are used where server-side data access or rendering is appropriate.

Client components are used for interactive interfaces and real-time functionality.

## 4. Application Structure

The application is organized around:

```text
src/
├── actions/
├── app/
├── components/
├── features/
├── lib/
├── models/
└── types/
```

Important areas include:

```text
src/actions/
```

Server-side application operations.

```text
src/features/app/
```

Feature-specific client-side functionality.

```text
src/lib/
```

Infrastructure integrations including:

- Authentication.
- Prisma.
- MongoDB.
- Gemini.
- Socket.IO.

```text
src/models/
```

MongoDB/Mongoose models.

## 5. Authentication Architecture

Better Auth manages authentication using PostgreSQL through its Prisma adapter.

Protected server operations retrieve the authenticated session from the request headers.

Authorization is performed server-side.

The system does not trust frontend UI restrictions as a security mechanism.

## 6. PostgreSQL Architecture

PostgreSQL stores the core relational application data.

Major entities include:

```text
User
Workspace
WorkspaceMember
Conversation
ConversationParticipant
Message
Authentication/session entities
```

Relationships are represented using relational keys and foreign keys.

Prisma provides the database access layer.

## 7. MongoDB Architecture

MongoDB is used specifically for AI review history.

The MongoDB document model is:

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

The `issues` array is embedded inside the CodeReview document.

The `userId` field references the PostgreSQL user's identifier without duplicating the complete user record.

An index is maintained on `userId` for review-history queries.

## 8. MongoDB CRUD Architecture

The AI review lifecycle is:

```text
Create
User submits code
      ↓
Gemini produces review
      ↓
CodeReview.create()
      ↓
MongoDB

Read
      ↓
CodeReview.find()
      ↓
Current user's review history

Update
      ↓
CodeReview.findOneAndUpdate()
      ↓
Rename review

Delete
      ↓
CodeReview.findOneAndDelete()
      ↓
Remove review
```

Update and delete operations include both the review identifier and authenticated user's ID.

This provides ownership protection.

## 9. AI Architecture

CodeNest AI is a standalone feature available through `/ai`.

The architecture is:

```text
User
  │
  ▼
CodeNest AI UI
  │
  ▼
Server-side AI operation
  │
  ▼
Gemini API
  │
  ▼
Structured review
  │
  ├── title
  ├── summary
  ├── severity
  ├── issues[]
  └── improvedCode
  │
  ▼
MongoDB
  │
  ▼
Review History
```

The Gemini API key is kept server-side.

## 10. Real-Time Architecture

Socket.IO provides real-time communication.

Conversation rooms follow the pattern:

```text
conversation:<conversationId>
```

User-specific rooms follow:

```text
user:<userId>
```

Conversation rooms are used for real-time messaging.

User rooms are used for user-level application events such as workspace changes.

## 11. Messaging Architecture

The shared chat architecture consists of:

```text
Chat
├── ChatHeader
├── MessageList
│   └── MessageItem
└── MessageInput
```

Messages are persisted in PostgreSQL.

Socket.IO provides real-time delivery.

Server-side authorization controls editing and deletion.

## 12. Security Architecture

Security is enforced at the server.

Protected operations verify:

1. Authentication.
2. Workspace membership.
3. Role.
4. Resource ownership.

The exact checks depend on the operation.

Secrets such as Gemini credentials are stored using environment variables.

## 13. Data Flow: AI Review

```text
1. User submits source code.
2. Client sends the request to the server.
3. Server validates the authenticated session.
4. Server validates the submitted input.
5. Server sends the code to Gemini.
6. Gemini returns structured review data.
7. Server persists the review in MongoDB.
8. UI displays the review.
9. Review becomes available in review history.
```

## 14. Data Flow: Review History

```text
Authenticated User
       ↓
getReviewHistory
       ↓
Verify Session
       ↓
Query MongoDB using userId
       ↓
Sort by createdAt descending
       ↓
Return review summary information
       ↓
ReviewHistory UI
```

The history list does not need the complete source code and complete review document for every list item.

## 15. Scalability Considerations

The current architecture separates responsibilities between PostgreSQL and MongoDB.

PostgreSQL handles relational application data.

MongoDB handles document-oriented AI review data.

Socket.IO handles real-time communication separately from persistent message storage.

Indexes are used where query patterns justify them.

The architecture can later be extended with features such as caching, rate limiting, testing infrastructure, containerization, and AI evaluation systems.

These are not part of the current implemented system.
