-- Complex script with control flow
BEGIN
  DECLARE user_count INT64;
  DECLARE message STRING;

  SET user_count = (SELECT COUNT(*) FROM users);

  IF user_count > 1000 THEN
    SET message = 'Large database';
  ELSEIF user_count > 100 THEN
    SET message = 'Medium database';
  ELSE
    SET message = 'Small database';
  END IF;

  SELECT user_count, message;
END;

-- Multiple IF statements in sequence
BEGIN
  DECLARE x INT64 DEFAULT 10;
  DECLARE y INT64 DEFAULT 20;

  IF x > 5 THEN
    SET x = x * 2;
  END IF;

  IF y > 15 THEN
    SET y = y + 10;
  END IF;

  SELECT x, y;
END;
