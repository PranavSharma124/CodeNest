# CodeNest — Low-Level Design

## 1. Overview

This document describes the implementation-level design of CodeNest, including the major modules, data models, server actions, authentication checks, AI integration, MongoDB implementation, and real-time communication.

## 2. Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- React Markdown
- React Syntax Highlighter

### Backend

- Next.js Server Actions
- Node.js
- Socket.IO

### Databases

- PostgreSQL
- Prisma
- MongoDB
- Mongoose

### Authentication

- Better Auth
- Prisma adapter
- Email/password authentication

### AI

- Google Gemini API
- `@google/genai`

## 3. Module Structure

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

## 4. Authentication

Better Auth manages authentication.

The server retrieves the current authenticated session using request headers.

Protected operations must verify the session before accessing or modifying protected resources.

Conceptually:

```text
Request
  ↓
Get Session
  ↓
Session exists?
  ├── No → Unauthorized
  └── Yes
       ↓
Continue operation
```

## 5. Workspace Authorization

Workspace operations use membership and role information.

Roles:

```text
OWNER
ADMIN
MEMBER
```

Authorization checks are performed on the server.

Examples:

- Workspace deletion requires owner authorization.
- Workspace membership is checked before protected workspace operations.
- The owner cannot leave their own workspace.
- Members can leave a workspace.

## 6. MongoDB Connection

MongoDB is accessed through a dedicated database connection module:

```text
src/lib/mongodb.ts
```

Mongoose is used for schema definition and database operations.

## 7. CodeReview Model

The MongoDB model is located at:

```text
src/models/CodeReview.ts
```

Conceptual schema:

```ts
CodeReview {
  userId: String
  title: String
  code: String
  summary: String
  severity: String
  issues: Issue[]
  improvedCode: String
  createdAt: Date
  updatedAt: Date
}
```

## 8. Embedded Issue Model

Issues are embedded inside the CodeReview document.

```ts
interface Issue {
  title: string;
  explanation: string;
  suggestion: string;
}
```

### Reason for embedding

Issues are embedded because:

- An issue belongs to a single review.
- Issues do not currently have an independent lifecycle.
- Reviews are normally retrieved together with their issues.
- A separate collection would add unnecessary complexity.

## 9. PostgreSQL User Reference

The MongoDB review stores:

```text
userId
```

This value represents the PostgreSQL user's identifier.

The complete PostgreSQL user object is not duplicated in MongoDB.

This creates a reference between the two database systems while maintaining separate ownership of the data.

## 10. MongoDB Index

`userId` is indexed.

The reason is that review history is normally queried for the authenticated user:

```text
CodeReview.find({
  userId: session.user.id
})
```

The index improves the efficiency of this common lookup as the review collection grows.

## 11. Create Review

When an AI review is successfully generated, the review is persisted using:

```text
CodeReview.create()
```

The stored document contains the generated review information together with the authenticated user's ID.

Conceptual flow:

```text
Authenticated User
       ↓
Submit Code
       ↓
Gemini Review
       ↓
Structured Result
       ↓
CodeReview.create()
       ↓
MongoDB
```

## 12. Read Review History

Review history is implemented in:

```text
src/actions/getReviewHistory.ts
```

The query conceptually performs:

```ts
CodeReview.find({
  userId: session.user.id,
}).sort({
  createdAt: -1,
});
```

Only information required for the history list is returned.

The list requires:

- ID.
- Title.
- Severity.
- Summary.
- Creation date.

The complete code and full review payload are not required for the history list.

## 13. Update Review Title

Review renaming is implemented in:

```text
src/actions/updateReviewTitle.ts
```

The update operation uses:

```text
CodeReview.findOneAndUpdate()
```

The operation is scoped to both:

```text
reviewId
+
authenticated user ID
```

This prevents a user from renaming another user's review.

## 14. Delete Review

Review deletion is implemented in:

```text
src/actions/deleteReview.ts
```

The deletion operation uses:

```text
CodeReview.findOneAndDelete()
```

The query is scoped to:

```text
reviewId
+
authenticated user ID
```

This prevents unauthorized deletion of another user's review.

## 15. ReviewHistory UI

The review history interface is:

```text
src/features/app/ai/ReviewHistory.tsx
```

Responsibilities include:

- Loading review history.
- Displaying loading state.
- Displaying empty state.
- Displaying reviews.
- Renaming reviews.
- Deleting reviews.
- Updating local state after mutations.

## 16. AI Structured Output

The Gemini integration is responsible for producing a structured result.

The conceptual structure is:

```text
Review
├── title
├── summary
├── severity
├── issues[]
│   ├── title
│   ├── explanation
│   └── suggestion
└── improvedCode
```

The structured format allows the frontend to render predictable fields rather than parsing arbitrary natural-language output.

## 17. AI Prompt Responsibilities

The AI prompt instructs Gemini to:

- Review submitted code.
- Identify bugs and problems.
- Explain identified issues.
- Suggest improvements.
- Produce improved code.
- Return structured output.
- Avoid claiming that the code was executed or tested.

User-provided code is treated as input to be reviewed rather than as trusted system instructions.

## 18. Messaging

Messages are persisted through the PostgreSQL data model.

Socket.IO provides real-time communication.

The client communicates through Socket.IO while the server manages room membership and event broadcasting.

Conversation-specific rooms use:

```text
conversation:<conversationId>
```

User-specific rooms use:

```text
user:<userId>
```

## 19. Message Authorization

Message editing and deletion require server-side authorization.

A user should only be able to modify their own messages.

The UI does not act as the security boundary.

## 20. Direct Message Deletion

DM deletion is account-specific.

Deleting a direct message for one account does not globally delete the message for the other participant.

This behavior is intentional and must be preserved unless the product decision is explicitly changed.

## 21. Error Handling

Protected server operations should:

1. Validate authentication.
2. Validate input.
3. Check authorization.
4. Perform the database operation.
5. Handle expected errors.
6. Return an appropriate result to the client.

Unauthorized operations must not be silently treated as successful.

## 22. Environment Variables

Sensitive configuration such as API keys and database credentials is stored using environment variables.

Secrets must not be committed to Git.

The Gemini API key is only accessed server-side.

## 23. Data Ownership

AI reviews belong to the authenticated user who created them.

Ownership is enforced at query level rather than relying only on frontend filtering.

This means that update/delete queries contain both the resource identifier and authenticated user ID.

## 24. Current AI Review Lifecycle

```text
              ┌─────────────┐
              │ Submit Code │
              └──────┬──────┘
                     ▼
              ┌─────────────┐
              │ Authenticate│
              └──────┬──────┘
                     ▼
              ┌─────────────┐
              │   Gemini    │
              └──────┬──────┘
                     ▼
           ┌────────────────────┐
           │ Structured Review  │
           └─────────┬──────────┘
                     ▼
           ┌────────────────────┐
           │ MongoDB CodeReview │
           └─────────┬──────────┘
                     ▼
              ┌─────────────┐
              │   History   │
              └──────┬──────┘
                     │
             ┌───────┴────────┐
             ▼                ▼
          Rename            Delete
             │                │
             ▼                ▼
        MongoDB Update   MongoDB Delete
```

## 25. Design Principles

The implementation follows these principles:

- Authentication and authorization are server-side.
- PostgreSQL is used for core relational data.
- MongoDB is used specifically for AI review history.
- Related review issues are embedded in CodeReview.
- PostgreSQL user records are not duplicated in MongoDB.
- AI API credentials remain server-side.
- Real-time communication is separated from persistent message storage.
- CodeNest AI remains a standalone application feature rather than a fake user.
- DM deletion remains account-specific.
- Documentation reflects implemented functionality rather than future plans.
