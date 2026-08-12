# CodeNest

> A real-time developer collaboration platform built with Next.js.

CodeNest is a full-stack collaboration platform designed for developers to create workspaces, collaborate with other developers, and communicate through direct messages and real-time conversations.

The project is being built as a production-style application rather than a simple tutorial project, with a focus on learning real-world full-stack architecture, authentication, authorization, relational databases, and real-time communication.

---

## ✨ Features

### 🔐 Authentication

- User registration and login
- Session-based authentication
- Protected application routes
- Sign out functionality
- Dynamic user profile/avatar
- Server-side authentication checks

### 🏢 Workspaces

- Create workspaces
- View workspaces in the sidebar
- Add users to workspaces
- View workspace members
- Workspace roles:
  - Owner
  - Admin
  - Member
- Owner-only workspace deletion
- Real-time workspace membership updates
- Real-time workspace deletion updates
- Automatic redirection when an active workspace is deleted

### 💬 Direct Messaging

- Start direct conversations with other users
- View direct conversations in the sidebar
- Persistent message storage
- Real-time message delivery

### ⚡ Real-Time Communication

CodeNest uses **Socket.IO** for real-time communication.

Currently implemented real-time functionality includes:

- Real-time messages
- Conversation-specific rooms
- User-specific Socket.IO rooms
- Real-time workspace membership updates
- Real-time workspace deletion updates
- Authenticated socket connections
- Authorized conversation access

### 🎨 User Interface

- Next.js App Router
- Sidebar navigation
- Workspace navigation
- Direct message navigation
- Workspace member dialog
- Add members dialog
- Workspace deletion confirmation
- User profile menu
- Search bar UI
- shadcn/ui components
- Lucide icons

---

# 🛠️ Tech Stack

## Frontend

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide React](https://lucide.dev/)

## Backend

- Next.js Server Actions
- Node.js
- Socket.IO

## Database

- PostgreSQL
- Prisma ORM

## Authentication

- Better Auth
- Email/password authentication
- Cookie-based sessions

## Other Technologies

- `@better-auth/prisma-adapter`
- `@prisma/client`
- `socket.io-client`
- `tsx`

---

# 🏗️ Architecture

CodeNest uses a full-stack Next.js architecture with PostgreSQL as the persistent data layer and Socket.IO for real-time communication.

A simplified view of the application:

```text
                         Browser
                            │
                            ▼
                      ┌───────────┐
                      │  Next.js  │
                      │    App    │
                      └─────┬─────┘
                            │
               ┌────────────┴────────────┐
               │                         │
               ▼                         ▼
      Server Components          Client Components
               │                         │
               │                         ▼
               │                    Socket.IO
               │                         │
               ▼                         ▼
        Server Actions            Real-Time Events
               │
               ▼
           ┌────────┐
           │ Prisma │
           └────┬───┘
                │
                ▼
          ┌───────────┐
          │ PostgreSQL│
          └───────────┘
```

Authentication is handled through **Better Auth**.

Real-time Socket.IO connections are authenticated using the user's Better Auth session.

---

# 🗄️ Database

CodeNest uses **PostgreSQL** with **Prisma ORM**.

The current database contains models for:

- Users
- Sessions
- Accounts
- Verification records
- Workspaces
- Workspace members
- Conversations
- Conversation participants
- Messages

## Main Relationships

```text
User
 │
 ├── Session
 │
 ├── Account
 │
 ├── WorkspaceMember
 │
 ├── Message
 │
 └── ConversationParticipant
```

```text
Workspace
 │
 ├── WorkspaceMember
 │
 └── Conversation
       │
       ├── Message
       │
       └── ConversationParticipant
```

Workspace membership uses three roles:

```text
OWNER
ADMIN
MEMBER
```

A user can only have one membership record for a particular workspace.

---

# 🔑 Authentication Flow

CodeNest uses **Better Auth** for authentication.

A simplified authentication flow looks like this:

```text
User
 │
 │ Login / Register
 ▼
Better Auth
 │
 ▼
Session
 │
 ▼
Cookie
 │
 ▼
Authenticated Request
 │
 ▼
Server
```

Protected Server Actions retrieve the current session before performing database operations.

For example, deleting a workspace verifies:

1. The user is authenticated.
2. The user belongs to the workspace.
3. The user has the `OWNER` role.

Authorization is therefore enforced on the server rather than relying only on frontend UI restrictions.

---

# ⚡ Real-Time Architecture

Socket.IO is used for real-time communication.

The application maintains an application-level Socket.IO connection while the authenticated user is inside the application.

## Conversation Rooms

When a user opens a conversation, their socket joins a conversation-specific room:

```text
conversation:<conversationId>
```

Messages can then be sent to users connected to that conversation.

## User Rooms

Each authenticated socket also joins a user-specific room:

```text
user:<userId>
```

This allows the server to send events to a specific user.

For example:

```text
Account A adds Account B
        │
        ▼
WorkspaceMember created
        │
        ▼
     Socket.IO
        │
        ▼
user:<Account B>
        │
        ▼
workspace-added
        │
        ▼
Account B's Sidebar
        │
        ▼
     Refresh
```

This allows Account B's workspace list to update without requiring a manual page refresh.

---

# 🏢 Workspace Lifecycle

## Creating a Workspace

```text
Create Workspace
       │
       ▼
Create Workspace
       │
       ├── Create Workspace Conversation
       │
       └── Create OWNER Membership
       │
       ▼
Navigate to Workspace
```

## Adding a Member

```text
Owner / Admin
      │
      ▼
Select User
      │
      ▼
Server Authorization
      │
      ▼
Create WorkspaceMember
      │
      ▼
Emit "workspace-added"
      │
      ▼
User's Sidebar Refreshes
```

## Deleting a Workspace

Only the workspace owner can delete a workspace.

```text
Owner
 │
 ▼
Delete Workspace
 │
 ├── Verify Authentication
 │
 ├── Verify Membership
 │
 ├── Verify OWNER Role
 │
 ├── Find Workspace Members
 │
 ├── Delete Workspace
 │
 └── Notify Members
 │
 ▼
workspace-deleted
```

Users currently viewing the deleted workspace are automatically redirected to the dashboard.

The deleted workspace is also removed from affected users' sidebars without requiring a manual refresh.

---

# 📁 Project Structure

CodeNest uses a feature-oriented structure alongside Next.js's App Router.

```text
src/
├── actions/
│   ├── addWorkspaceMember.ts
│   ├── createWorkspace...
│   ├── deleteWorkspace.ts
│   ├── getDirectConversation.ts
│   ├── getDirectConversations.ts
│   ├── getUsers.ts
│   ├── getWorkspaceChat.ts
│   ├── getWorkspaceMembers.ts
│   ├── getWorkspaces.ts
│   └── sendMessage.ts
│
├── app/
│   ├── (app)/
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
│   ├── prisma.ts
│   ├── socket.ts
│   └── socket-server.ts
│
└── types/
```

> The project structure will continue to evolve as new features are implemented.

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/PranavSharma124/CodeNest.git
cd CodeNest
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL="your-postgresql-connection-string"
```

Add any other environment variables required by your local configuration.

> **Never commit `.env` to Git.**

## 4. Set Up the Database

Generate the Prisma client:

```bash
npx prisma generate
```

Run the database migrations:

```bash
npx prisma migrate dev
```

## 5. Start the Development Server

```bash
npm run dev
```

The application will run locally using the project's Next.js/Socket.IO server.

---

# 💻 Development Commands

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Run ESLint:

```bash
npm run lint
```

---

# 📈 V1 Progress

## ✅ Completed

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
- [x] Owner-only workspace deletion
- [x] Direct messages
- [x] Persistent messages
- [x] Socket.IO integration
- [x] Real-time messaging
- [x] Socket authentication
- [x] Conversation authorization
- [x] Real-time workspace membership updates
- [x] Real-time workspace deletion updates
- [x] Automatic redirect when an active workspace is deleted

## 🚧 In Progress / Planned

- [ ] Message editing
- [ ] Message deletion
- [ ] Search functionality
- [ ] Typing indicators
- [ ] Online presence
- [ ] Reactions
- [ ] Markdown messages
- [ ] Code syntax highlighting
- [ ] File attachments
- [ ] Image uploads
- [ ] Responsive/mobile improvements
- [ ] Additional UI polish
- [ ] Accessibility improvements
- [ ] Deployment
- [ ] Final documentation

---

# 🔒 Security

CodeNest performs authorization checks on the server.

Examples include:

- Users must be authenticated to access protected actions.
- Users must belong to a workspace before accessing its members.
- Only workspace owners can delete workspaces.
- Only authorized workspace members can access workspace conversations.
- Socket connections are authenticated using the Better Auth session.
- Socket conversation joins are authorized against the database.
- Workspace membership uses a unique user/workspace constraint.

Frontend restrictions are **not** treated as the security boundary.

---

# 🎯 Project Goals

CodeNest is being developed as a portfolio-quality full-stack application.

The main goals are:

1. Build a realistic developer collaboration platform.
2. Learn full-stack development through implementation.
3. Understand the architecture rather than simply copying code.
4. Practice authentication and authorization.
5. Learn relational database design.
6. Build real-time features with Socket.IO.
7. Develop production-oriented engineering habits.
8. Create a project that can be demonstrated on a résumé and GitHub.

---

# 📚 Documentation

Detailed technical documentation will be created at the completion of V1.

The documentation will cover:

- Project architecture
- Folder and file responsibilities
- Database schema and relationships
- Authentication flow
- Authorization model
- Server Actions
- Socket.IO architecture
- Real-time event flow
- Workspace lifecycle
- Messaging lifecycle
- Important engineering decisions
- Development and deployment architecture

---

# 📄 License

This project is currently being developed as a personal portfolio project.