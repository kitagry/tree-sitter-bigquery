-- CREATE TABLE AS SELECT
CREATE TABLE dataset.active_users AS
SELECT * FROM users WHERE active = TRUE

-- CREATE OR REPLACE TABLE AS SELECT
CREATE OR REPLACE TABLE dataset.summary AS
SELECT
  category,
  COUNT(*) AS count,
  AVG(price) AS avg_price
FROM products
GROUP BY category
