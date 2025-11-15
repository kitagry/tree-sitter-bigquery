-- Dataset qualified
SELECT * FROM dataset.table_name

-- Project and dataset qualified
SELECT * FROM `project-id.dataset.table_name`

-- Backtick identifiers (required for special characters)
SELECT * FROM `my-project.my_dataset.my-table`
