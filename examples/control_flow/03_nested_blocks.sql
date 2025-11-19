-- Nested BEGIN...END blocks
BEGIN
  DECLARE x INT64 DEFAULT 10;

  BEGIN
    DECLARE y INT64 DEFAULT 20;
    SELECT x + y;
  END;

  SELECT x;
END;

-- Nested IF statements
BEGIN
  DECLARE age INT64 DEFAULT 25;
  DECLARE has_license BOOL DEFAULT TRUE;

  IF age >= 18 THEN
    IF has_license THEN
      SELECT 'Can drive';
    ELSE
      SELECT 'Cannot drive - no license';
    END IF;
  ELSE
    SELECT 'Cannot drive - too young';
  END IF;
END;
