-- WHILE with CONTINUE
BEGIN
  DECLARE i INT64 DEFAULT 0;
  DECLARE sum INT64 DEFAULT 0;

  WHILE i < 10 DO
    SET i = i + 1;
    IF i % 2 = 0 THEN
      CONTINUE;
    END IF;
    SET sum = sum + i;
  END WHILE;

  SELECT sum;
END;

-- LOOP with BREAK and CONTINUE
BEGIN
  DECLARE counter INT64 DEFAULT 0;
  DECLARE result INT64 DEFAULT 0;

  LOOP
    SET counter = counter + 1;

    IF counter > 20 THEN
      BREAK;
    END IF;

    IF counter % 3 = 0 THEN
      CONTINUE;
    END IF;

    SET result = result + counter;
  END LOOP;

  SELECT result;
END;

-- Nested loops with BREAK
BEGIN
  DECLARE x INT64 DEFAULT 0;
  DECLARE y INT64 DEFAULT 0;
  DECLARE found BOOL DEFAULT FALSE;

  WHILE x < 10 DO
    SET y = 0;
    WHILE y < 10 DO
      IF x = y THEN
        SET found = TRUE;
        BREAK;
      END IF;
      SET y = y + 1;
    END WHILE;
    SET x = x + 1;
  END WHILE;
END;
