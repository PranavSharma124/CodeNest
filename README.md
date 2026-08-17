# CodeNest

CodeNest is a real-time developer collaboration platform built with Next.js.

The goal of CodeNest is to provide developers with a shared environment where they can create workspaces, collaborate with other developers, communicate through direct and workspace messaging, and use an AI-powered code review assistant.

The project is being developed as a production-style full-stack application rather than a simple tutorial project.

---

## Features

### Authentication

- User registration and login
- Session-based authentication
- Protected application routes
- Sign out functionality
- Dynamic user profile/avatar
- Server-side authentication checks
- Server-side authorization

### Workspaces

- Create workspaces
- View workspaces in the sidebar
- Add users to workspaces
- View workspace members
- Workspace roles:
  - Owner
  - Admin
  - Member
- Owner-only workspace deletion
- Members can leave workspaces
- Owners cannot leave their own workspace
- Real-time workspace membership updates
- Real-time workspace deletion updates
- Automatic sidebar updates when membership changes
- Automatic redirect when an active workspace is deleted or left

### Messaging

- Workspace conversations
- Direct messages between users
- Persistent message storage
- Real-time message delivery
- Edit your own messages
- Delete your own messages
- Deleted-message state
- Markdown rendering
- Code block rendering
- Syntax highlighting

### Search

- Search users
- Search workspaces
- Search direct conversations
- Search results displayed through the application search interface

### CodeNest AI

CodeNest AI is a separate application feature from Direct Messages.

It provides an AI-powered code review assistant using Google's Gemini API.

Users can:

- Paste code into CodeNest AI
- Request an AI code review
- Receive a summary
- Receive an overall severity level
- View identified issues
- View explanations
- Receive improvement suggestions
- Receive improved code

The AI response uses structured output rather than relying on arbitrary text responses.

The Gemini API key is kept server-side.

### Real-Time Communication

CodeNest uses Socket.IO for real-time communication.

Currently implemented real-time events include:

- New messages
- Workspace membership changes
- Workspace deletion
- Workspace leaving
- Conversation rooms
- User-specific Socket.IO rooms

### User Interface

- Next.js App Router
- React
- TypeScript
- Responsive application layout
- Sidebar navigation
- Workspace navigation
- Direct message navigation
- Workspace member dialog
- Add members dialog
- Workspace deletion confirmation
- User profile menu
- Search bar
- CodeNest AI interface
- shadcn/ui components
- Lucide icons
- Loading states
- Error states

---

# Tech Stack

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

CodeNest currently uses Next.js server-side functionality rather than a separate Express backend.

## Database

- PostgreSQL
- Prisma ORM

PostgreSQL is currently the primary application database.

## Authentication

- Better Auth
- Email/password authentication
- Cookie/session-based authentication
- Prisma adapter

## AI

- Google Gemini API
- `@google/genai`
- Structured JSON output

## Other Technologies

- Socket.IO
- Socket.IO Client
- Zod
- TypeScript
- ESLint
- tsx

---

# Architecture

CodeNest uses a full-stack Next.js architecture with PostgreSQL as the primary persistent data layer and Socket.IO for real-time communication.

CodeNest AI is integrated as a separate server-side AI service.

A simplified architecture is:

```text
                         Browser
                            |
                            v
                    Next.js Application
                            |
              +-------------+-------------+
              |                           |
              v                           v
       Server Components           Client Components
              |                           |
              |                           +------> Socket.IO Client
              |                                      |
              v                                      v
       Server Actions                         Real-Time Events
              |
        +-----+------+
        |            |
        v            v
   Better Auth     Prisma
        |            |
        |            v
        |       PostgreSQL
        |
        v
     Sessions


                    CodeNest AI
                         |
                         v
                  Server Action
                         |
                         v
                    Gemini API
                         |
                         v
                Structured JSON
                         |
                         v
                    React UI
```

---

# Database

CodeNest currently uses PostgreSQL with Prisma ORM.

The database contains authentication and application data for concepts such as:

- Users
- Sessions
- Accounts
- Workspaces
- Workspace members
- Conversations
- Conversation participants
- Messages

## Main Relationships

```text
User
 |
 +-- Session
 |
 +-- Account
 |
 +-- WorkspaceMember
 |
 +-- Message
 |
 +-- ConversationParticipant


Workspace
 |
 +-- WorkspaceMember
 |
 +-- Conversation
       |
       +-- Message
       |
       +-- ConversationParticipant
```

Workspace membership connects users to workspaces and contains a role:

```text
OWNER
ADMIN
MEMBER
```

A user/workspace membership is unique.

---

# Authentication Flow

CodeNest uses Better Auth for authentication.

A simplified authentication flow is:

```text
User
 |
 | Login / Register
 v
Better Auth
 |
 v
Session
 |
 v
Cookie
 |
 v
Authenticated Request
 |
 v
Next.js Server
```

Protected server actions retrieve the current session before performing sensitive operations.

The frontend is not treated as the security boundary.

---

# Authorization

Authorization is enforced on the server.

For example, deleting a workspace requires:

```text
1. User must be authenticated
2. User must belong to the workspace
3. User must have the OWNER role
```

Conceptually:

```text
Request
   |
   v
Get Session
   |
   +---- No session ----> Unauthorized
   |
   v
Find Workspace Membership
   |
   +---- No membership ----> Unauthorized
   |
   v
Check Role
   |
   +---- Not OWNER ----> Forbidden
   |
   v
Delete Workspace
```

This prevents users from bypassing frontend restrictions by directly invoking server functionality.

---

# Real-Time Architecture

Socket.IO provides real-time communication.

## Conversation Rooms

When a user opens a conversation, the socket joins a conversation-specific room:

```text
conversation:<conversationId>
```

Messages can then be broadcast to users connected to that conversation.

## User Rooms

Authenticated users can also use a user-specific room:

```text
user:<userId>
```

This allows the server to send events to a specific user.

For example:

```text
Account A adds Account B
        |
        v
WorkspaceMember created
        |
        v
Socket.IO
        |
        v
user:<Account B>
        |
        v
workspace-added
        |
        v
Account B sidebar updates
```

---

# Workspace Lifecycle

## Creating a Workspace

```text
Create Workspace
       |
       v
Authenticate User
       |
       v
Create Workspace
       |
       +----> Create Workspace Conversation
       |
       +----> Create OWNER Membership
       |
       v
Navigate to Workspace
```

## Adding a Member

```text
Owner/Admin
     |
     v
Select User
     |
     v
Server Authorization
     |
     v
Create WorkspaceMember
     |
     v
Emit workspace-added
     |
     v
User's Sidebar Updates
```

## Leaving a Workspace

Members can leave workspaces.

Owners cannot leave their own workspace.

```text
Member
   |
   v
Leave Workspace
   |
   +----> Verify Authentication
   |
   +----> Verify Membership
   |
   +----> Check Role
   |
   +----> Reject OWNER
   |
   v
Delete WorkspaceMember
   |
   v
Emit workspace-left
   |
   v
Sidebar Removes Workspace
```

## Deleting a Workspace

Only the owner can delete a workspace.

```text
Owner
 |
 v
Delete Workspace
 |
 +----> Verify Authentication
 |
 +----> Verify Membership
 |
 +----> Verify OWNER Role
 |
 +----> Delete Workspace
 |
 +----> Notify Connected Members
 |
 v
workspace-deleted
 |
 v
Sidebar Updates
 |
 v
Active Users Redirect
```

---

# Messaging Architecture

CodeNest supports both workspace conversations and direct messages.

The same shared chat interface is used for both.

```text
Chat
 |
 +-- ChatHeader
 |
 +-- MessageList
 |     |
 |     +-- MessageItem
 |
 +-- MessageInput
```

## Sending a Message

```text
MessageInput
      |
      v
sendMessage()
      |
      v
Authenticate User
      |
      v
Authorize Conversation Access
      |
      v
Prisma
      |
      v
PostgreSQL
      |
      v
Socket.IO
      |
      v
conversation:<id>
      |
      v
MessageList
      |
      v
MessageItem
```

Messages are persisted in PostgreSQL and then delivered to connected users through Socket.IO.

---

# Message Editing and Deletion

Users can edit and delete their own messages.

The frontend checks the message sender to display the controls, but the actual authorization is performed on the server.

```text
User
 |
 v
Edit/Delete
 |
 v
Server Action
 |
 v
Authentication
 |
 v
Authorization
 |
 v
Database Update
```

Deleted messages are represented in the UI as:

```text
This message was deleted.
```

---

# Search

CodeNest contains a global search interface.

Search can return:

- Users
- Workspaces
- Direct conversations

The general flow is:

```text
User enters query
       |
       v
SearchBar
       |
       v
searchApp()
       |
       v
Server
       |
       v
Search Results
       |
       +---- Users
       +---- Workspaces
       +---- Direct Messages
```

---

# CodeNest AI

CodeNest AI is intentionally separate from Direct Messages.

Direct Messages represent:

```text
User <----> User
```

CodeNest AI represents:

```text
User
  |
  v
CodeNest AI
  |
  v
Gemini
  |
  v
Structured AI Response
```

The AI is therefore treated as an application capability rather than a fake user inside the messaging system.

## AI Flow

```text
CodeNest AI UI
      |
      v
reviewCode()
      |
      v
Authenticate User
      |
      v
Validate Input
      |
      v
Build Prompt
      |
      v
Gemini API
      |
      v
Structured JSON
      |
      v
React UI
```

## AI Response

The AI returns structured data containing:

```json
{
  "summary": "...",
  "severity": "high",
  "issues": [
    {
      "title": "...",
      "explanation": "...",
      "suggestion": "..."
    }
  ],
  "improvedCode": "..."
}
```

This allows the frontend to render each part of the review independently.

## AI Security

The Gemini API key is stored in an environment variable:

```env
GEMINI_API_KEY="your-key"
```

The key is accessed only by server-side code.

It is intentionally not exposed through:

```text
NEXT_PUBLIC_GEMINI_API_KEY
```

---

# Project Structure

The project uses feature-oriented organization alongside Next.js App Router.

A simplified structure is:

```text
src/
├── actions/
│   ├── addWorkspaceMember.ts
│   ├── createWorkspace.ts
│   ├── deleteWorkspace.ts
│   ├── deleteMessage.ts
│   ├── editMessage.ts
│   ├── getDirectConversation.ts
│   ├── getDirectConversations.ts
│   ├── getUsers.ts
│   ├── getWorkspaceChat.ts
│   ├── getWorkspaceMembers.ts
│   ├── getWorkspaces.ts
│   ├── leaveWorkspace.ts
│   ├── searchApp.ts
│   ├── sendMessage.ts
│   └── reviewCode.ts
│
├── app/
│   ├── (app)/
│   │   ├── ai/
│   │   ├── dashboard/
│   │   ├── DM/
│   │   ├── workspace/
│   │   └── layout.tsx
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   │
│   └── globals.css
│
├── components/
│   └── ui/
│
├── features/
│   ├── app/
│   │   ├── ai/
│   │   ├── chat/
│   │   ├── header/
│   │   ├── sidebar/
│   │   └── socket/
│   │
│   └── workspace/
│
├── lib/
│   ├── auth.ts
│   ├── auth-client.ts
│   ├── gemini.ts
│   ├── prisma.ts
│   ├── socket.ts
│   └── socket-server.ts
│
└── types/
```

The exact structure may continue to evolve as new features are implemented.

---

# Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/PranavSharma124/CodeNest.git
cd codenest
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create or configure your `.env` file.

Required environment variables include the PostgreSQL connection and authentication configuration.

Example:

```env
DATABASE_URL="your-postgresql-connection-string"
GEMINI_API_KEY="your-gemini-api-key"
```

Use the actual environment variables required by the current project configuration.

Do not commit `.env` to Git.

## 4. Set Up the Database

Generate the Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

## 5. Start the Development Server

```bash
npm run dev
```

The application will run using the project's Next.js/Socket.IO server.

---

# Development Commands

### Start Development Server

```bash
npm run dev
```

### Create Production Build

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Run ESLint

```bash
npm run lint
```

### Format Code

If Prettier is configured in the project:

```bash
npx prettier --write .
```

---

# Current V1 Progress

## Completed

- [x] Next.js project foundation
- [x] TypeScript configuration
- [x] Tailwind CSS
- [x] shadcn/ui
- [x] PostgreSQL database
- [x] Prisma schema
- [x] Better Auth
- [x] User registration
- [x] User login
- [x] User logout
- [x] Protected application routes
- [x] Dynamic user profile
- [x] Workspace creation
- [x] Workspace membership
- [x] Workspace roles
- [x] Workspace member list
- [x] Add people to workspace
- [x] Leave workspace
- [x] Owner-only workspace deletion
- [x] Direct messages
- [x] Workspace messaging
- [x] Persistent messages
- [x] Real-time messaging
- [x] Socket authentication
- [x] Conversation authorization
- [x] Real-time workspace membership updates
- [x] Real-time workspace deletion updates
- [x] Automatic workspace redirect
- [x] Message editing
- [x] Message deletion
- [x] Deleted message state
- [x] Markdown messages
- [x] Code blocks
- [x] Syntax highlighting
- [x] Search
- [x] CodeNest AI
- [x] Gemini API integration
- [x] AI authentication
- [x] AI input validation
- [x] AI prompt engineering
- [x] Structured AI outputs
- [x] AI code review UI

---

# In Progress / Planned

### Product Features

- [ ] Profile image uploads
- [ ] Notifications
- [ ] Typing indicators
- [ ] Online presence
- [ ] File attachments
- [ ] Responsive/mobile improvements
- [ ] Additional accessibility and UI polish

### AI

- [ ] Streaming responses
- [ ] AI tool/function calling
- [ ] Prompt injection defenses
- [ ] Token and cost monitoring
- [ ] AI evaluation sets
- [ ] RAG / project context

### Backend / Infrastructure

- [ ] MongoDB feature
- [ ] REST API endpoints where appropriate
- [ ] Additional request validation
- [ ] Rate limiting
- [ ] Automated testing
- [ ] Docker
- [ ] Deployment

---

# Security

CodeNest treats the frontend as an untrusted client.

Authorization is enforced on the server.

Examples include:

- Users must be authenticated to access protected actions.
- Users must belong to a workspace before accessing its members.
- Only owners can delete workspaces.
- Workspace owners cannot leave their own workspace.
- Only authorized users can access workspace conversations.
- Users can only edit/delete their own messages.
- Socket conversation joins are authorized.
- Gemini credentials remain server-side.
- AI requests require authentication.
- AI input is validated before being sent to Gemini.
- `.env` is not committed to Git.

Frontend restrictions are not treated as the security boundary.

---

# Engineering Practices

CodeNest is being developed with production-oriented engineering practices including:

- TypeScript
- Git version control
- Environment variable management
- Server-side authorization
- Feature-oriented organization
- Prisma ORM
- Relational database design
- Real-time communication
- Structured AI responses
- Loading and error states
- Server-side validation
- Reusable React components

---

# Documentation

The project includes detailed technical documentation:

- **PRD** — Product Requirements Document
- **HLD** — High-Level Design
- **LLD** — Low-Level Design

These documents describe the product requirements, system architecture, implementation details, data flow, authentication, authorization, messaging, Socket.IO architecture, and CodeNest AI.

---

# Project Goals

CodeNest is being developed as a portfolio-quality full-stack application.

The main goals are:

1. Build a realistic developer collaboration platform.
2. Learn full-stack development through implementation.
3. Understand the architecture rather than simply copying code.
4. Practice authentication and authorization.
5. Learn relational database design.
6. Build real-time features with Socket.IO.
7. Integrate an LLM into a real application.
8. Learn structured AI outputs and prompt engineering.
9. Develop production-oriented engineering habits.
10. Create a project that can be demonstrated on a résumé and GitHub.

---

# Future Vision

CodeNest can eventually evolve into a more complete developer collaboration platform with:

- Real-time presence
- Typing indicators
- File sharing
- Project/code context
- AI-assisted development
- RAG over project documentation
- AI tool use
- Advanced search
- Notifications
- Automated testing
- Production deployment

---

# License

This project is currently being developed as a personal portfolio project.
