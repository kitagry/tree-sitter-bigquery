-- Named window with frame specification
SELECT
  date,
  revenue,
  SUM(revenue) OVER w AS rolling_sum
FROM sales
WINDOW w AS (
  ORDER BY date
  ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
)

-- Named window with UNBOUNDED frame
SELECT
  date,
  revenue,
  SUM(revenue) OVER cumulative AS cumulative_sum
FROM sales
WINDOW cumulative AS (
  ORDER BY date
  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
)
