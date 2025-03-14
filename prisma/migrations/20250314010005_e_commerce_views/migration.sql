-- SQLBook: Code
CREATE VIEW "ProductQuantity" AS
SELECT
    p.id AS "productId",
    p.sku AS "productSku",
    p.name AS "productName",
    p.description AS "description",
    p.price AS "price",
    p."imageCover" AS "imageCover",
    p.sold,
    b.name AS "brandName",
    s.name AS "supplierName",
    SUM(pi.quantity) AS "remainingQuantity"
FROM
    "ProductInventory" pi
LEFT JOIN
    "ProductSpecification" ps ON pi."productSpecificationId" = ps.id
LEFT JOIN
    "Product" p ON ps."productId" = p.id
LEFT JOIN
    "Brand" b ON b.id = p."brandId"
LEFT JOIN
    "Supplier" s ON s.id = p."supplierId"
GROUP BY
    p.id,
    p.sku,
    p.name,
    p.description,
    p.price,
    p."imageCover",
    p.sold,
    b.name,
    s.name;

CREATE VIEW "ProductQuantityDetails" AS
SELECT
    pi."productId",
    pi."productSpecificationId",
    pi."productSku",
    pi."productName",
    pi."description",
    pi."price",
    pi."imageCover",
    pi.sold,
    pi."brandName",
    pi."supplierName",
    pi."remainingQuantity",
    COALESCE(s.name, 'Unknown') AS "size",
    COALESCE(col.name, 'Unknown') AS "color",
    COALESCE(m.name, 'Unknown') AS "material"
FROM
    (SELECT
        p.id AS "productId",
        p.sku AS "productSku",
        p.name AS "productName",
        p.description AS "description",
        p.price AS "price",
        p."imageCover" AS "imageCover",
        p.sold,
        b.name AS "brandName",
        s.name AS "supplierName",
        ps.id AS "productSpecificationId",
        SUM(pi.quantity) AS "remainingQuantity"
    FROM
        "ProductInventory" pi
    JOIN
        "ProductSpecification" ps ON pi."productSpecificationId" = ps.id
    JOIN
        "Product" p ON ps."productId" = p.id
    LEFT JOIN
        "Brand" b ON b.id = p."brandId"
    LEFT JOIN
        "Supplier" s ON s.id = p."supplierId"
    GROUP BY
        p.id, p.sku, p.name, p.description, p.price, p."imageCover", p.sold,
        b.name, s.name, ps.id) pi
LEFT JOIN
    "Size" s ON pi."productSpecificationId" = s.id
LEFT JOIN
    "Color" col ON pi."productSpecificationId" = col.id
LEFT JOIN
    "Material" m ON pi."productSpecificationId" = m.id;


CREATE VIEW "OrderDetails" AS
SELECT
    o.id AS "orderId",
    o."orderNumber",
    u."firstName" AS "customerName",
    u."lastName" AS "customerLastName",
    u.email AS "customerEmail",
    a."addressLine1" AS "shippingAddress",
    a.commune AS "shippingCommune",
    a."wilayaId" AS "shippingWilayaId",
    w.name AS "shippingWilayaName",
    s.company AS "shippingCompany",
    o.subtotal,
    o."shippingCost",
    o."taxAmount",
    o."discountAmount",
    o."totalAmount",
    o.status,
    o."paymentStatus",
    o."paymentMethod",
    o."createdAt",
    o."paidAt",
    o."shippedAt",
    o."deliveredAt",
    oi.quantity AS "orderItemQuantity",
    oi."unitPrice" AS "orderItemUnitPrice",
    p.id AS "productId",
    p.name AS "productName",
    p.sku AS "productSku",
    p.description AS "productDescription",
    p."imageCover" AS "productImageCover"
FROM
    "Order" o
LEFT JOIN
    "User" u ON o."userId" = u.id
LEFT JOIN
    "Address" a ON o."addressId" = a.id
LEFT JOIN
    "Shipping" s ON o."shippingId" = s.id
LEFT JOIN
    "Wilaya" w ON a."wilayaId" = w.id
LEFT JOIN
    "OrderItem" oi ON o.id = oi."orderId"
LEFT JOIN
    "ProductSpecification" ps ON oi."productSpecificationId" = ps.id
LEFT JOIN
    "Product" p ON ps."productId" = p.id;

CREATE VIEW "SupplierProduct" AS
SELECT
    s.id AS "supplierId",
    s.name AS "supplierName",
    s.email AS "supplierEmail",
    s.phone AS "supplierPhone",
    s.website AS "supplierWebsite",
    p.id AS "productId",
    p.sku AS "productSku",
    p.name AS "productName",
    p.description AS "productDescription",
    p.price AS "productPrice",
    p."imageCover" AS "productImageCover"
FROM
    "Supplier" s
LEFT JOIN
    "Product" p ON s.id = p."supplierId"
LEFT JOIN
    "Brand" b ON b.id = p."brandId";