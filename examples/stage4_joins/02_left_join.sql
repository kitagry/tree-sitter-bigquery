-- LEFT JOIN
SELECT * FROM users LEFT JOIN orders ON users.id = orders.user_id

-- LEFT OUTER JOIN (equivalent)
SELECT * FROM users LEFT OUTER JOIN orders ON users.id = orders.user_id
