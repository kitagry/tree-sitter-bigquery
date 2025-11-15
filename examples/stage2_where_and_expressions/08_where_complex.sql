-- Complex WHERE clause with multiple conditions
SELECT id, name, email
FROM users
WHERE (role = admin OR role = moderator)
  AND active = TRUE
  AND NOT deleted
