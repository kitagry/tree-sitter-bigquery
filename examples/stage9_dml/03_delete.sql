-- Simple DELETE
DELETE FROM users
WHERE id = 1

-- DELETE with complex WHERE
DELETE FROM users
WHERE active = FALSE AND last_login < '2020-01-01'

-- DELETE all rows (be careful!)
DELETE FROM temp_table
WHERE TRUE
