-- Simple UNNEST
SELECT * FROM UNNEST([1, 2, 3]) AS number

-- UNNEST with table
SELECT u.name, number
FROM users u
CROSS JOIN UNNEST(u.favorite_numbers) AS number
