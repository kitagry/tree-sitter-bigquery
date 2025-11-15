-- Simple STRUCT
SELECT STRUCT(1 AS id, 'John' AS name) AS user

-- STRUCT with multiple fields
SELECT STRUCT(1 AS x, 2 AS y, 3 AS z) AS point

-- Nested STRUCT
SELECT STRUCT(1 AS id, STRUCT('John' AS first, 'Doe' AS last) AS name) AS user
