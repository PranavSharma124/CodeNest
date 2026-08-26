-- CodeNest SQL JOIN Demonstrations
-- Educational examples for the SQL JOIN rubric.
-- These examples do NOT modify CodeNest's production database.

CREATE TABLE IF NOT EXISTS rubric_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS rubric_workspaces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS rubric_workspace_members (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES rubric_users(id) ON DELETE CASCADE,
    workspace_id INT NOT NULL REFERENCES rubric_workspaces(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL
);

-- 1. INNER JOIN: members with their user details
SELECT
    wm.id AS membership_id,
    wm.role,
    u.id AS user_id,
    u.name AS user_name,
    u.email AS user_email
FROM rubric_workspace_members AS wm
INNER JOIN rubric_users AS u
    ON wm.user_id = u.id
WHERE wm.workspace_id = 1
ORDER BY wm.id;

-- 2. LEFT JOIN: every user, including users with no workspace membership
SELECT
    u.id AS user_id,
    u.name AS user_name,
    wm.workspace_id,
    wm.role
FROM rubric_users AS u
LEFT JOIN rubric_workspace_members AS wm
    ON u.id = wm.user_id
ORDER BY u.id;

-- 3. RIGHT JOIN: every user from the right-hand table
SELECT
    wm.id AS membership_id,
    wm.workspace_id,
    wm.role,
    u.id AS user_id,
    u.name AS user_name,
    u.email AS user_email
FROM rubric_workspace_members AS wm
RIGHT JOIN rubric_users AS u
    ON wm.user_id = u.id
ORDER BY u.id;

-- 4. CodeNest production JOIN used by:
--    src/actions/getWorkspaceMembers.ts
SELECT
    wm.id,
    wm.role,
    u.id AS "userId",
    u.name AS "userName",
    u.email AS "userEmail",
    u.image AS "userImage"
FROM "workspace_member" AS wm
INNER JOIN "user" AS u
    ON wm."userId" = u.id
WHERE wm."workspaceId" = 1
ORDER BY wm."createdAt" ASC;
