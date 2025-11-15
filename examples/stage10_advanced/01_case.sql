-- Simple CASE expression
SELECT
  CASE
    WHEN age < 18 THEN 'minor'
    WHEN age < 65 THEN 'adult'
    ELSE 'senior'
  END AS age_group
FROM users

-- CASE with searched conditions
SELECT
  name,
  CASE
    WHEN score >= 90 THEN 'A'
    WHEN score >= 80 THEN 'B'
    WHEN score >= 70 THEN 'C'
    ELSE 'F'
  END AS grade
FROM students

-- CASE expression (simple form)
SELECT
  CASE status
    WHEN 'active' THEN 'Active User'
    WHEN 'inactive' THEN 'Inactive User'
    ELSE 'Unknown'
  END AS status_label
FROM users
