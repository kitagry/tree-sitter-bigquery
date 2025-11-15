-- Subquery in FROM clause (derived table)
SELECT *
FROM (
  SELECT id, name, email
  FROM users
  WHERE active = TRUE
) AS active_users
