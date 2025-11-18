-- Simple WHILE loop
BEGIN
  DECLARE counter INT64 DEFAULT 0;

  WHILE counter < 10 DO
    SET counter = counter + 1;
  END WHILE;

  SELECT counter;
END;

-- WHILE loop with multiple statements
BEGIN
  DECLARE i INT64 DEFAULT 1;
  DECLARE sum INT64 DEFAULT 0;

  WHILE i <= 5 DO
    SET sum = sum + i;
    SET i = i + 1;
  END WHILE;

  SELECT sum;
END;

-- Nested WHILE loops
BEGIN
  DECLARE x INT64 DEFAULT 0;
  DECLARE y INT64 DEFAULT 0;

  WHILE x < 3 DO
    SET y = 0;
    WHILE y < 3 DO
      SET y = y + 1;
    END WHILE;
    SET x = x + 1;
  END WHILE;
END;
