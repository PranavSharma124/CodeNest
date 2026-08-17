# CodeNest --- Product Requirements Document (PRD)

## 1. Product Overview

**CodeNest** is a real-time developer collaboration platform built with
Next.js.

The product gives developers a shared environment where they can: -
Create and manage workspaces. - Collaborate with other developers
through workspace membership. - Communicate through workspace
conversations and direct messages. - Receive real-time updates without
manually refreshing the application. - Use CodeNest AI to review and
improve code.

CodeNest is being developed as a production-style portfolio project with
an emphasis on understanding full-stack architecture, authentication,
relational data modeling, real-time communication, and AI integration.

------------------------------------------------------------------------

## 2. Problem Statement

Developers often use several disconnected tools for collaboration,
communication, and code assistance.

CodeNest aims to provide a unified developer-focused environment where
collaboration and communication can happen in one application while also
providing an AI assistant for code review.

------------------------------------------------------------------------

## 3. Target Users

Primary users are: - Students learning software development. -
Individual developers. - Small development teams. - Developers who want
a shared workspace for communication and collaboration.

------------------------------------------------------------------------

## 4. Product Goals

### Primary Goals

1.  Provide authenticated developer accounts.
2.  Allow users to create and participate in workspaces.
3.  Support workspace roles and authorization.
4.  Provide persistent direct and workspace messaging.
5.  Provide real-time communication using Socket.IO.
6.  Provide an AI-powered code review assistant.
7.  Demonstrate production-oriented full-stack engineering practices.

### Technical Goals

-   Use Next.js and React for the application.
-   Use PostgreSQL and Prisma for relational application data.
-   Use Better Auth for authentication.
-   Use Socket.IO for real-time communication.
-   Use Gemini for AI-powered code review.
-   Protect server-side secrets and enforce authorization on the server.

------------------------------------------------------------------------

## 5. Functional Requirements

### Authentication

Users must be able to: - Register. - Log in. - Log out. - Maintain an
authenticated session. - Access protected application functionality only
when authenticated.

### Workspaces

Users must be able to: - Create workspaces. - View their workspaces. -
Add members. - View workspace members. - Leave a workspace when they are
not the owner. - Delete a workspace when they are the owner.

Workspace roles: - OWNER - ADMIN - MEMBER

### Messaging

Users must be able to: - Send messages. - View persistent messages. -
Edit their own messages. - Delete their own messages. - Send direct
messages. - Participate in workspace conversations.

### Real-Time Communication

The application must support real-time events including: - New
messages. - Workspace membership changes. - Workspace deletion. -
Workspace membership/leave updates. - Conversation-specific socket
rooms. - User-specific socket rooms.

### Search

Users must be able to search application data through the CodeNest
search interface.

### CodeNest AI

Users must be able to: 1. Open CodeNest AI independently from direct
messages. 2. Paste code into the AI interface. 3. Request a code review.
4. Receive a structured AI response. 5. View: - Summary - Severity -
Issues - Explanations - Suggestions - Improved code

The AI request must be authenticated and the Gemini API key must remain
server-side.

------------------------------------------------------------------------

## 6. Non-Functional Requirements

### Security

-   Authentication must be enforced server-side.
-   Authorization must be enforced server-side.
-   Secrets must not be exposed to the browser.
-   Workspace access must be checked against membership.
-   Owner-only actions must verify the OWNER role.
-   AI input must be validated.
-   AI requests must not be available to unauthenticated users.

### Performance

-   Real-time updates should avoid unnecessary page refreshes.
-   Database queries should retrieve only the required data.
-   The UI should provide loading states during asynchronous operations.

### Reliability

-   Server operations should handle errors.
-   Invalid operations should return meaningful errors.
-   Real-time listeners should be cleaned up when components unmount.

### Maintainability

-   Features should be organized into reusable components and server
    actions.
-   TypeScript should be used throughout the application.
-   Database access should be centralized through Prisma.
-   AI integration should be isolated from presentation components.

------------------------------------------------------------------------

## 7. User Stories

### Workspace

-   As a developer, I want to create a workspace so that I can
    collaborate with other developers.
-   As a workspace owner, I want to add members so that other developers
    can participate.
-   As a workspace member, I want to leave a workspace so that I can
    remove myself from collaboration.
-   As a workspace owner, I want to delete the workspace when it is no
    longer needed.

### Messaging

-   As a developer, I want to send messages in real time.
-   As a developer, I want to edit my own messages.
-   As a developer, I want to delete my own messages.
-   As a developer, I want to send direct messages to another user.

### AI

-   As a developer, I want CodeNest AI to review my code.
-   As a developer, I want AI feedback to be structured and easy to
    understand.
-   As a developer, I want AI to suggest an improved version of my code.

------------------------------------------------------------------------

## 8. V1 Scope

### Included

-   Authentication
-   Workspaces
-   Workspace membership
-   Workspace roles
-   Workspace deletion
-   Leave workspace
-   Direct messaging
-   Workspace messaging
-   Message editing/deletion
-   Search
-   Socket.IO real-time communication
-   Markdown/code block rendering
-   CodeNest AI code review
-   Structured AI responses

### Deferred

-   Reactions
-   Mentions
-   Advanced notifications
-   File attachments
-   Advanced presence
-   Advanced AI/RAG
-   Payments
-   Other non-essential integrations

------------------------------------------------------------------------

## 9. Success Criteria

CodeNest V1 is successful when: - Users can authenticate and access
protected functionality. - Workspace authorization is correctly
enforced. - Messages persist in PostgreSQL. - Real-time events work
without manual refreshes. - Users can manage workspace membership. -
Users can edit/delete their own messages. - CodeNest AI can securely
call Gemini and return structured code reviews. - The architecture and
implementation can be clearly documented.

------------------------------------------------------------------------

## 10. Future Scope

Potential future improvements: - File and image uploads. - Online
presence. - Typing indicators. - Message reactions. - Mentions. - AI
streaming. - AI tool use. - RAG over project documentation/code. - AI
evaluation sets. - Docker deployment. - Automated testing. - Redis-based
caching/presence.
