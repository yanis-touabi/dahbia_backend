-- SQLBook: Code
CREATE VIEW "ProductInfo" AS
SELECT 
    p.id AS "productId",
    p.sku,
    p.name AS "productName",
    p.description,
    p.price,
    p."imageCover",
    p.images,
    p.sold,
    p."isBestSeller",
    p.gender,
    p."isPromo",
    p."isFreeShipping",
    p."priceAfterDiscount",
    p."categoryId",
    p."brandId",
    p."supplierId",
    ps.id AS "productSpecificationId",
    s.name AS size,
    c.name AS color,
    m.name AS material,
    ps."createdAt" AS "product_spec_created_at",
    ps."modifiedAt" AS "product_spec_modified_at",
    ps."deletedAt" AS "product_spec_deleted_at",
    b.name AS "brandName",
    b.description AS "brandDescription",
    sup.name AS "supplierName",
    sup.phone AS "supplierPhone",
    sup.email AS "supplierEmail"
FROM "Product" p
LEFT JOIN "ProductSpecification" ps ON p.id = ps."productId"
LEFT JOIN "Size" s ON ps."sizeId" = s.id
LEFT JOIN "Color" c ON ps."colorId" = c.id
LEFT JOIN "Material" m ON ps."materialId" = m.id
LEFT JOIN "Brand" b ON p."brandId" = b.id
LEFT JOIN "Supplier" sup ON p."supplierId" = sup.id;


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
    sup.name AS "supplierName",
    COALESCE(SUM(pi.quantity), 0) AS "remainingQuantity"
FROM "Product" p
LEFT JOIN "ProductSpecification" ps ON p.id = ps."productId"
LEFT JOIN "ProductInventory" pi ON pi."productSpecificationId" = ps.id
LEFT JOIN "Brand" b ON b.id = p."brandId"
LEFT JOIN "Supplier" sup ON sup.id = p."supplierId"
GROUP BY p.id, p.sku, p.name, p.description, p.price, p."imageCover", p.sold, b.name, sup.name;

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
    u."phoneNumber",
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
    o."deliveredAt"
FROM
    "Order" o
LEFT JOIN
    "User" u ON o."userId" = u.id
LEFT JOIN
    "Address" a ON o."addressId" = a.id
LEFT JOIN
    "Shipping" s ON o."shippingId" = s.id
LEFT JOIN
    "Wilaya" w ON a."wilayaId" = w.id;

CREATE VIEW "OrderItemDetails" AS
SELECT
    od."orderId",
    od."orderNumber",
    od."customerName",
    od."customerEmail",
    od."shippingWilayaName",
    od."shippingCompany",
    od.status,
    oi."productSpecificationId",
    oi.quantity AS "orderItemQuantity",
    oi."unitPrice" AS "orderItemUnitPrice",
    (oi.quantity * oi."unitPrice") AS "totalPrice",
    pi."productId",
    pi."productName",
    pi.sku AS "productSku",
    pi.description AS "productDescription",
    pi."imageCover" AS "productImageCover",
    pi."isFreeShipping",
    pi."isPromo",
    pi.size,
    pi.color,
    pi.material,
    pi."brandName",
    pi."supplierName",
    od."createdAt",
    od."paidAt",
    od."shippedAt",
    od."deliveredAt"
FROM
    "OrderDetails" od
RIGHT JOIN
    "OrderItem" oi ON od."orderId" = oi."orderId"
JOIN
    "ProductInfo" pi ON oi."productSpecificationId" = pi."productSpecificationId";

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