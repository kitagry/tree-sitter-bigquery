-- Simple CREATE TABLE
CREATE TABLE dataset.users (
  id INT64,
  name STRING,
  email STRING
)

-- CREATE TABLE with more types
CREATE TABLE dataset.products (
  id INT64,
  name STRING,
  price FLOAT64,
  created_at TIMESTAMP,
  is_active BOOL
)

-- CREATE OR REPLACE TABLE
CREATE OR REPLACE TABLE dataset.temp_table (
  id INT64,
  value STRING
)

-- CREATE TABLE with nested types
CREATE TABLE dataset.events (
  id INT64,
  user_id INT64,
  event_data STRUCT<
    event_type STRING,
    timestamp TIMESTAMP
  >,
  tags ARRAY<STRING>
)
