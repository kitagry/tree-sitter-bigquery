-- ORDER BY ascending (default)
SELECT name, age FROM users ORDER BY age

-- ORDER BY descending
SELECT name, age FROM users ORDER BY age DESC

-- ORDER BY ascending explicitly
SELECT name, age FROM users ORDER BY age ASC

-- ORDER BY multiple columns
SELECT name, age, city FROM users ORDER BY city ASC, age DESC
