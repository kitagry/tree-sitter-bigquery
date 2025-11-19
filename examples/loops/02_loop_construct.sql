-- Simple LOOP with BREAK
BEGIN
  DECLARE i INT64 DEFAULT 0;

  LOOP
    SET i = i + 1;
    IF i >= 10 THEN
      BREAK;
    END IF;
  END LOOP;

  SELECT i;
END;

-- LOOP with conditional BREAK
BEGIN
  DECLARE counter INT64 DEFAULT 0;
  DECLARE found BOOL DEFAULT FALSE;

  LOOP
    SET counter = counter + 1;

    IF counter = 5 THEN
      SET found = TRUE;
      BREAK;
    END IF;

    IF counter > 100 THEN
      BREAK;
    END IF;
  END LOOP;

  SELECT counter, found;
END;
