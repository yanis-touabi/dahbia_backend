-- SQLBook: Code
-- This is an empty migration.

CREATE OR REPLACE VIEW "ProductSortedByPrice" AS
SELECT
  *,
  CASE
    WHEN "isPromo" = true AND "priceAfterDiscount" IS NOT NULL THEN "priceAfterDiscount"
    ELSE "price"
  END AS "effectivePrice"
FROM
  "Product"
ORDER BY
  "effectivePrice" DESC;