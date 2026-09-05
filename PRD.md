# CodeNest --- Product Requirements Document (PRD)

**Version:** 1.0\
**Status:** V1 implementation / deployment preparation

## 1. Product Overview

CodeNest is a full-stack developer collaboration platform combining
authenticated workspaces, direct and workspace messaging, application
search, and an AI-powered code-review feature.

## 2. Problem Statement

Developers often use separate tools for communication, project
collaboration, and code review. CodeNest brings these workflows into one
application so developers can manage workspaces, communicate, search
application data, and receive structured AI code-review feedback.

## 3. Product Goals

### Primary goals

1.  Provide secure user authentication.
2.  Provide workspace-based collaboration.
3.  Support persistent direct and workspace messaging.
4.  Provide real-time communication.
5.  Provide a standalone AI code-review workflow.
6.  Persist AI review history.
7.  Maintain a type-safe and maintainable architecture.

### V1 non-goals

Reactions, mentions, file attachments, advanced notifications/presence,
AI streaming, RAG, AI tool calling, payments, and similar non-essential
functionality are outside the current V1.

## 4. Target Users

Developers and students who need a lightweight environment for developer
collaboration and code-review assistance.

## 5. Core Features

### Authentication

Users can sign up and sign in with email/password. Better Auth manages
sessions and integrates with PostgreSQL through the Prisma adapter.

### Workspaces

Authenticated users can create workspaces, add members, leave permitted
workspaces, and delete workspaces as owners.

Workspace roles are **OWNER**, **ADMIN**, and **MEMBER**.

### Messaging

CodeNest supports direct conversations and workspace conversations,
persistent messages, editing, deletion, deleted-message state, Markdown,
and syntax-highlighted code blocks.

### Search

Application search supports users, workspaces, and direct conversations.
The client uses debouncing to reduce unnecessary search requests.

### CodeNest AI

CodeNest AI is a standalone feature at `/ai`, not a fake user or
direct-message participant.

The flow is:

``` text
User → CodeNest AI → Gemini → Structured review
```

A review contains a title, summary, severity, issues, and improved code.
Each issue contains a title, explanation, and suggestion.

### AI Review History

AI reviews are persisted in MongoDB. Users can view history, rename
reviews, and delete their own reviews.

## 6. Functional Requirements

### Authentication

-   Protected operations require authentication.
-   Better Auth sessions are used for authenticated requests.
-   Authentication secrets remain server-side.

### Workspace authorization

-   Protected workspace operations verify membership.
-   Owner-only operations verify the OWNER role.
-   Authorization is performed server-side.

### Messaging

-   Messages persist in PostgreSQL.
-   Real-time updates use Socket.IO.
-   Conversation access is checked before joining a Socket.IO room.

### AI

-   AI review requests require authentication.
-   Empty code input is rejected.
-   Excessively large input is rejected.
-   Gemini is called server-side.
-   The Gemini API key is never exposed to the browser.
-   The AI response follows a structured contract.
-   Submitted code is treated as untrusted input.

## 7. Non-Functional Requirements

### Security

Server-side authentication and authorization, environment-based secret
management, workspace membership checks, owner-role checks, Socket.IO
conversation authorization, and AI review ownership checks.

### Performance

Real-time updates should avoid unnecessary refreshes. Search is
debounced, and asynchronous UI operations expose loading states.

### Reliability

Server operations handle failures, client operations expose useful error
states, and Socket.IO listeners are cleaned up with component lifecycle.

### Maintainability

TypeScript is used throughout. UI is componentized, server operations
are separated into Server Actions, PostgreSQL access uses Prisma, and AI
review persistence uses Mongoose.

## 8. User Stories

### Workspace

-   As a developer, I want to create a workspace so that I can
    collaborate.
-   As an owner, I want to add members.
-   As a member, I want to leave a workspace.
-   As an owner, I want to delete a workspace.

### Messaging

-   As a developer, I want to send messages in real time.
-   As a developer, I want my messages to persist.
-   As a developer, I want to edit and delete my messages.
-   As a developer, I want to send direct messages.

### AI

-   As a developer, I want CodeNest AI to review my code.
-   As a developer, I want issues explained clearly.
-   As a developer, I want suggested improvements.
-   As a developer, I want previous reviews to remain available.

## 9. V1 Success Criteria

CodeNest V1 is successful when users can authenticate, use authorized
workspaces, persist and exchange messages in real time, search supported
application data, securely obtain structured Gemini reviews, and manage
their MongoDB review history.

## 10. Future Scope

Potential future improvements include file/image uploads, notifications,
presence, typing indicators, reactions, mentions, AI streaming, RAG, AI
tool calling, evaluation datasets, token/cost monitoring, rate limiting,
automated testing, Docker, and further production infrastructure.

These are future scope and are not represented as completed features.
