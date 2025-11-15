-- Simple INSERT with VALUES
INSERT INTO users (id, name, email)
VALUES (1, 'John', 'john@example.com')

-- INSERT with multiple rows
INSERT INTO users (id, name, email)
VALUES
  (1, 'John', 'john@example.com'),
  (2, 'Jane', 'jane@example.com'),
  (3, 'Bob', 'bob@example.com')

-- INSERT from SELECT
INSERT INTO active_users (id, name)
SELECT id, name FROM users WHERE active = TRUE
