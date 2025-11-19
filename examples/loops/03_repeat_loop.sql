-- Simple REPEAT...UNTIL loop
BEGIN
  DECLARE x INT64 DEFAULT 0;

  REPEAT
    SET x = x + 1;
  UNTIL x >= 5
  END REPEAT;

  SELECT x;
END;

-- REPEAT with multiple statements
BEGIN
  DECLARE counter INT64 DEFAULT 0;
  DECLARE sum INT64 DEFAULT 0;

  REPEAT
    SET counter = counter + 1;
    SET sum = sum + counter;
  UNTIL counter >= 10
  END REPEAT;

  SELECT counter, sum;
END;

-- REPEAT with complex condition
BEGIN
  DECLARE i INT64 DEFAULT 0;
  DECLARE done BOOL DEFAULT FALSE;

  REPEAT
    SET i = i + 1;
    IF i >= 5 THEN
      SET done = TRUE;
    END IF;
  UNTIL done OR i > 10
  END REPEAT;

  SELECT i;
END;
