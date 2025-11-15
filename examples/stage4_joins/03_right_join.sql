-- RIGHT JOIN
SELECT * FROM users RIGHT JOIN orders ON users.id = orders.user_id

-- RIGHT OUTER JOIN (equivalent)
SELECT * FROM users RIGHT OUTER JOIN orders ON users.id = orders.user_id
