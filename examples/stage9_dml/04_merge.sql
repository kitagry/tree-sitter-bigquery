-- Simple MERGE
MERGE target T
USING source S
ON T.id = S.id
WHEN MATCHED THEN
  UPDATE SET name = S.name
WHEN NOT MATCHED THEN
  INSERT (id, name) VALUES (S.id, S.name)

-- MERGE with DELETE
MERGE dataset.inventory T
USING dataset.new_inventory S
ON T.product_id = S.product_id
WHEN MATCHED AND S.quantity = 0 THEN
  DELETE
WHEN MATCHED THEN
  UPDATE SET quantity = S.quantity
WHEN NOT MATCHED THEN
  INSERT (product_id, quantity) VALUES (S.product_id, S.quantity)
