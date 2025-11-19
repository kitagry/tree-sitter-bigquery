-- Simple BEGIN...END block
BEGIN
  SELECT 1;
END;

-- BEGIN...END with DECLARE
BEGIN
  DECLARE x INT64 DEFAULT 10;
  SELECT x;
END;

-- BEGIN...END with multiple statements
BEGIN
  DECLARE total INT64;
  SET total = 100;
  SELECT total;
END;
