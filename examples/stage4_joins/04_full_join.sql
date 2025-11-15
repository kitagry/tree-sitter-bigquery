-- FULL JOIN
SELECT * FROM users FULL JOIN orders ON users.id = orders.user_id

-- FULL OUTER JOIN (equivalent)
SELECT * FROM users FULL OUTER JOIN orders ON users.id = orders.user_id
