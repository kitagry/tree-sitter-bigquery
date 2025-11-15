-- Simple CREATE VIEW
CREATE VIEW dataset.active_users_view AS
SELECT * FROM users WHERE active = TRUE

-- CREATE OR REPLACE VIEW
CREATE OR REPLACE VIEW dataset.user_summary AS
SELECT
  id,
  name,
  email,
  created_at
FROM users
WHERE deleted = FALSE
