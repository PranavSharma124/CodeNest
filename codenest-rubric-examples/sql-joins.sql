-- SQL JOIN Demonstration
-- Required for SQL JOIN evaluation criteria


-- ============================================================
-- 1. Create Sample Tables
-- ============================================================

CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE reviews (
    id INT PRIMARY KEY,
    user_id INT,
    review_text VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


-- ============================================================
-- 2. Insert Sample Data
-- ============================================================

INSERT INTO users (id, name)
VALUES
    (1, 'Pranav'),
    (2, 'Rahul'),
    (3, 'Aman');

INSERT INTO reviews (id, user_id, review_text)
VALUES
    (101, 1, 'Good code'),
    (102, 1, 'Needs optimization'),
    (103, 2, 'Looks clean');


-- ============================================================
-- 3. INNER JOIN
-- ============================================================

-- INNER JOIN returns only users who have reviews.

SELECT
    users.id,
    users.name,
    reviews.review_text
FROM users
INNER JOIN reviews
    ON users.id = reviews.user_id;


-- ============================================================
-- 4. LEFT JOIN
-- ============================================================

-- LEFT JOIN returns ALL users,
-- even if they do not have a review.

SELECT
    users.id,
    users.name,
    reviews.review_text
FROM users
LEFT JOIN reviews
    ON users.id = reviews.user_id;


-- ============================================================
-- 5. LEFT JOIN to Find Users Without Reviews
-- ============================================================

-- This shows users who have no associated review.

SELECT
    users.id,
    users.name
FROM users
LEFT JOIN reviews
    ON users.id = reviews.user_id
WHERE reviews.id IS NULL;


-- ============================================================
-- 6. JOIN with Filtering
-- ============================================================

-- Retrieve reviews belonging to a specific user.

SELECT
    users.name,
    reviews.review_text
FROM users
INNER JOIN reviews
    ON users.id = reviews.user_id
WHERE users.id = 1;


-- ============================================================
-- 7. JOIN Summary
-- ============================================================

/*
INNER JOIN:
    Returns only matching records from both tables.

LEFT JOIN:
    Returns every record from the left table
    and matching records from the right table.

In CodeNest:
    INNER JOIN is useful when we only need users
    that have associated review data.

    LEFT JOIN is useful when we want all users,
    including users who may not have review data.
*/