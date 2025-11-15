-- Simple CTE (Common Table Expression)
WITH active_users AS (
  SELECT * FROM users WHERE active = TRUE
)
SELECT * FROM active_users
