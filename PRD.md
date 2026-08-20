# CodeNest — Product Requirements Document

## 1. Product Overview

CodeNest is a developer collaboration platform designed to bring workspace collaboration, real-time communication, direct messaging, and AI-assisted code review into one application.

The platform allows developers to create and participate in workspaces, communicate with other members, exchange messages in real time, and use CodeNest AI to review source code.

CodeNest AI is a standalone feature of the application. It accepts user-submitted code, sends it to the Gemini API for analysis, and presents a structured code review containing a summary, severity, identified issues, suggestions, and improved code.

AI review results are persisted in MongoDB so users can access their previous reviews through review history.

## 2. Problem Statement

Developers often use multiple tools for communication, collaboration, and code review. This creates unnecessary context switching between messaging platforms, project collaboration tools, and AI coding assistants.

CodeNest aims to provide a unified developer-focused environment where collaboration and AI-assisted code review are available within the same platform.

## 3. Product Goals

The primary goals of CodeNest are:

- Provide a collaborative workspace environment for developers.
- Support communication through workspace conversations and direct messages.
- Provide persistent and real-time messaging.
- Provide role-based workspace access.
- Provide an AI-powered code review feature.
- Persist AI review history for later access.
- Demonstrate practical use of both relational and document databases.
- Provide a portfolio-quality full-stack application.

## 4. Target Users

The primary users are:

- Students learning software development.
- Developers working on collaborative projects.
- Developers who want AI-assisted code review.
- Development teams that need lightweight workspace communication.

## 5. Core Features

### 5.1 Authentication

CodeNest provides email/password authentication using Better Auth.

Authenticated users receive access to protected application functionality.

Server-side operations verify the authenticated session before performing protected actions.

## 6. Workspaces

Users can create and participate in workspaces.

Workspace functionality includes:

- Workspace creation.
- Workspace membership.
- Viewing workspace members.
- Adding members.
- Leaving a workspace.
- Owner-only workspace deletion.
- Workspace roles.

Supported roles are:

- OWNER
- ADMIN
- MEMBER

Workspace membership and authorization are checked server-side.

## 7. Messaging

CodeNest supports two types of messaging:

1. Workspace conversations.
2. Direct messages.

Messages are persisted and updated in real time using Socket.IO.

Messaging functionality includes:

- Sending messages.
- Persistent message storage.
- Real-time message delivery.
- Editing messages.
- Deleting messages.
- Deleted-message state.
- Markdown rendering.
- Code blocks.
- Syntax highlighting.

Message modification operations are authorized server-side.

Users can modify only messages they are authorized to modify.

## 8. Direct Message Deletion

Deleting a direct message is account-specific.

A user deleting a DM removes or hides that message only for their own account. The deletion does not globally remove the message for the other participant.

## 9. Search

CodeNest provides search functionality for application data including:

- Users.
- Workspaces.
- Direct conversations.

## 10. CodeNest AI

CodeNest AI is a standalone application feature available through:

`/ai`

It is not modeled as a fake user or as a direct-message conversation.

The AI workflow is:

User → CodeNest AI → Gemini → Structured Review

The user submits source code for review.

The server sends the request to Gemini using a server-side API key.

The AI produces structured review information including:

- Title.
- Summary.
- Severity.
- Issues.
- Improved code.

Each issue contains:

- Title.
- Explanation.
- Suggestion.

The AI is instructed to review code and provide recommendations without claiming that the code was actually executed or tested.

## 11. AI Review History

CodeNest persists AI review results in MongoDB.

Each review stores:

- User ID.
- Review title.
- Source code.
- Summary.
- Severity.
- Issues.
- Improved code.
- Creation timestamp.
- Update timestamp.

Users can:

- View their review history.
- Rename reviews.
- Delete reviews.

Review history is scoped to the authenticated user.

Users cannot modify or delete another user's reviews.

## 12. MongoDB Usage

MongoDB is intentionally used for AI review history.

PostgreSQL remains the primary relational database for core application data, while MongoDB stores AI review documents.

Issues are embedded inside the CodeReview document because they belong directly to a single review and do not currently have an independent lifecycle.

The PostgreSQL user is referenced from MongoDB using the user's ID rather than duplicating the complete user record.

The `userId` field is indexed because review history is commonly queried by authenticated user.

## 13. Data Architecture

CodeNest uses two databases for different responsibilities.

### PostgreSQL

Stores core relational application data such as:

- Users.
- Authentication/session-related data.
- Workspaces.
- Workspace memberships.
- Conversations.
- Conversation participants.
- Messages.

### MongoDB

Stores:

- AI code review history.

This separation allows CodeNest to demonstrate both relational and document-oriented database design.

## 14. Security Requirements

Security requirements include:

- Authentication for protected operations.
- Server-side authorization.
- Workspace membership verification.
- Role verification where required.
- User ownership verification for AI reviews.
- Server-side storage of Gemini API credentials.
- Environment variables for secrets.
- Validation of AI input.
- Protection against unauthorized modification of other users' data.

The frontend is not considered an authorization boundary.

## 15. Real-Time Requirements

CodeNest uses Socket.IO for real-time communication.

Conversation-specific rooms are used for messaging.

User-specific rooms are used for user-level workspace events.

Relevant real-time events include:

- New messages.
- Workspace added.
- Workspace left.
- Workspace deleted.

Socket listeners are cleaned up appropriately to avoid duplicate listeners.

## 16. Non-Functional Requirements

CodeNest should provide:

- Secure server-side authorization.
- Persistent application data.
- Real-time communication.
- Maintainable TypeScript code.
- Clear separation of application responsibilities.
- Reliable error handling.
- Responsive user interfaces.
- Secure environment variable handling.

## 17. Current Scope

The current V1 includes:

- Authentication.
- User profiles/avatar.
- Workspaces.
- Workspace membership.
- Workspace roles.
- Direct messaging.
- Workspace messaging.
- Real-time communication.
- Message editing/deletion.
- Search.
- CodeNest AI.
- Gemini integration.
- Structured AI output.
- MongoDB AI review persistence.
- AI review history.
- Review rename.
- Review deletion.

## 18. Deferred Features

The following features are intentionally deferred:

- Reactions.
- Mentions.
- File uploads.
- Notifications.
- Presence.
- Typing indicators.
- AI streaming.
- Function/tool calling.
- RAG.
- LLM evaluation sets.
- Token/cost monitoring.
- Rate limiting.
- Automated testing.
- Docker.
- Production deployment.

These are not considered implemented features of the current V1.
