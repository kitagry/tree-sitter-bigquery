-- Simple IF...THEN...END IF
BEGIN
  DECLARE x INT64 DEFAULT 10;

  IF x > 5 THEN
    SELECT 'x is greater than 5';
  END IF;
END;

-- IF...THEN...ELSE...END IF
BEGIN
  DECLARE age INT64 DEFAULT 20;

  IF age >= 18 THEN
    SELECT 'Adult';
  ELSE
    SELECT 'Minor';
  END IF;
END;

-- IF...THEN...ELSEIF...ELSE...END IF
BEGIN
  DECLARE score INT64 DEFAULT 85;

  IF score >= 90 THEN
    SELECT 'A';
  ELSEIF score >= 80 THEN
    SELECT 'B';
  ELSEIF score >= 70 THEN
    SELECT 'C';
  ELSE
    SELECT 'F';
  END IF;
END;
