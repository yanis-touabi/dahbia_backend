"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var faker_1 = require("@faker-js/faker");
var bcrypt = require("bcrypt");
var wilaya_1 = require("./dummy_data/wilaya");
var prisma = new client_1.PrismaClient();
// Function to generate random user data
function generateUserData() {
    var _a;
    return {
        firstName: faker_1.faker.person.firstName().substring(0, 50),
        lastName: (_a = faker_1.faker.person.lastName()) === null || _a === void 0 ? void 0 : _a.substring(0, 50),
        email: faker_1.faker.internet.email().substring(0, 100),
        password: bcrypt.hashSync('password123', 10),
        gender: faker_1.faker.helpers.arrayElement(['MALE', 'FEMALE', 'UNISEX']),
        avatar: faker_1.faker.image.avatar(),
        age: faker_1.faker.number.int({ min: 18, max: 80 }),
        phoneNumber: faker_1.faker.phone.number().substring(0, 20),
        isActive: faker_1.faker.datatype.boolean(),
        verificationCode: faker_1.faker.string.uuid(),
    };
}
// Function to generate random product data
function generateProductData(categoryId, brandId) {
    return {
        name: faker_1.faker.commerce.productName(),
        description: faker_1.faker.commerce.productDescription(),
        price: faker_1.faker.number.float({
            min: 10,
            max: 1000,
            fractionDigits: 2,
        }),
        imageCover: faker_1.faker.image.urlLoremFlickr({ category: 'fashion' }),
        images: Array.from({ length: 3 }, function () {
            return faker_1.faker.image.urlLoremFlickr({ category: 'fashion' });
        }),
        sold: faker_1.faker.number.int({ min: 0, max: 1000 }),
        isBestSeller: faker_1.faker.datatype.boolean(),
        gender: faker_1.faker.helpers.arrayElement(['MALE', 'FEMALE', 'UNISEX']),
        categoryId: categoryId,
        brandId: brandId,
    };
}
// Function to generate random address data
function generateAddressData(userId) {
    return {
        userId: userId,
        addressLine1: faker_1.faker.location.streetAddress(),
        addressLine2: faker_1.faker.location.secondaryAddress(),
        commune: faker_1.faker.location.city(),
        willaya: faker_1.faker.location.state(),
        postalCode: faker_1.faker.location.zipCode(),
        country: faker_1.faker.location.country(),
        phoneNumber: faker_1.faker.phone.number(),
    };
}
// Function to generate random review data
function generateReviewData(userId, productId) {
    return {
        rating: faker_1.faker.number.int({ min: 1, max: 5 }),
        reviewText: faker_1.faker.lorem.sentences(),
        userId: userId,
        productId: productId,
    };
}
// Function to generate random cart data
function generateCartData(userId) {
    return {
        userId: userId,
        totalPrice: faker_1.faker.number.float({
            min: 10,
            max: 1000,
            fractionDigits: 2,
        }),
        totalPriceAfterDiscount: faker_1.faker.number.float({
            min: 5,
            max: 500,
            fractionDigits: 2,
        }),
    };
}
// Function to generate random cart item data
function generateCartItemData(cartId, productId) {
    return {
        cartId: cartId,
        productId: productId,
        quantity: faker_1.faker.number.int({ min: 1, max: 10 }),
        color: faker_1.faker.color.human(),
    };
}
// Function to generate random order data
function generateOrderData(userId, addressId, shippingId) {
    return {
        userId: userId,
        addressId: addressId,
        shippingId: shippingId,
        orderNumber: faker_1.faker.string.uuid(),
        subtotal: faker_1.faker.number.float({
            min: 10,
            max: 1000,
            fractionDigits: 2,
        }),
        taxAmount: faker_1.faker.number.float({
            min: 1,
            max: 100,
            fractionDigits: 2,
        }),
        discountAmount: faker_1.faker.number.float({
            min: 0,
            max: 50,
            fractionDigits: 2,
        }),
        totalAmount: faker_1.faker.number.float({
            min: 10,
            max: 1000,
            fractionDigits: 2,
        }),
        status: faker_1.faker.helpers.arrayElement([
            'PENDING',
            'PROCESSING',
            'SHIPPED',
            'DELIVERED',
            'CANCELLED',
        ]),
        paymentStatus: faker_1.faker.helpers.arrayElement([
            'PENDING',
            'PAID',
            'FAILED',
            'REFUNDED',
        ]),
        paymentMethod: faker_1.faker.helpers.arrayElement(['CASH', 'CARD']),
    };
}
// Function to generate random order item data
function generateOrderItemData(orderId, productId) {
    return {
        orderId: orderId,
        productId: productId,
        quantity: faker_1.faker.number.int({ min: 1, max: 10 }),
        unitPrice: faker_1.faker.number.float({
            min: 10,
            max: 100,
            fractionDigits: 2,
        }),
        color: faker_1.faker.color.human(),
    };
}
// Function to generate random shipping data
function generateShippingData(wilayaId) {
    return {
        company: faker_1.faker.company.name(),
        wilayaId: 1,
        amount: faker_1.faker.number.int({ min: 5, max: 50 }),
    };
}
// Function to generate random coupon data
function generateCouponData() {
    return {
        code: faker_1.faker.string.alphanumeric(10),
        discount: faker_1.faker.number.float({
            min: 5,
            max: 50,
            fractionDigits: 2,
        }),
        type: faker_1.faker.helpers.arrayElement(['PERCENTAGE', 'FIXED']),
        maxUses: faker_1.faker.number.int({ min: 10, max: 100 }),
        usedCount: faker_1.faker.number.int({ min: 0, max: 10 }),
        startDate: faker_1.faker.date.past(),
        endDate: faker_1.faker.date.future(),
        isActive: faker_1.faker.datatype.boolean(),
    };
}
// Function to generate random supplier data
function generateSupplierData() {
    return {
        name: faker_1.faker.company.name(),
        email: faker_1.faker.internet.email(),
        phone: faker_1.faker.phone.number(),
        website: faker_1.faker.internet.url(),
    };
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        // Helper function to get a random item from an array
        function getRandom(array) {
            return array[Math.floor(Math.random() * array.length)];
        }
        var NUM_USERS, NUM_ADDRESSES_PER_USER, NUM_PRODUCTS, NUM_REVIEWS_PER_PRODUCT, NUM_CARTS_PER_USER, NUM_CART_ITEMS_PER_CART, NUM_ORDERS_PER_USER, NUM_ORDER_ITEMS_PER_ORDER, NUM_SHIPPINGS, NUM_COUPONS, NUM_SUPPLIERS, NUM_CATEGORIES, NUM_SUBCATEGORIES, NUM_BRAND, NUM_PRODUCT_SPECIFICATIONS, SIZES, MATERIALS, COLORS, colors, sizes, materials, user, users, i, user_1, j, i, category_1, j, subCategory_1, i, brand_1, category, subCategory, brand, products, i, product, j, randomUser, i, randomProduct, productSpecification, _i, users_1, user_2, i, cart, j, randomProduct, randomProductSpecification, existingCartItem, wilayas, i, _a, users_2, user_3, addresses, i, order, j, randomProduct, randomProductSpecification, i, i;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    NUM_USERS = 10;
                    NUM_ADDRESSES_PER_USER = 2;
                    NUM_PRODUCTS = 20;
                    NUM_REVIEWS_PER_PRODUCT = 5;
                    NUM_CARTS_PER_USER = 1;
                    NUM_CART_ITEMS_PER_CART = 3;
                    NUM_ORDERS_PER_USER = 2;
                    NUM_ORDER_ITEMS_PER_ORDER = 3;
                    NUM_SHIPPINGS = 5;
                    NUM_COUPONS = 5;
                    NUM_SUPPLIERS = 5;
                    NUM_CATEGORIES = 5;
                    NUM_SUBCATEGORIES = 5;
                    NUM_BRAND = 8;
                    NUM_PRODUCT_SPECIFICATIONS = 40;
                    SIZES = [
                        { name: 'X' },
                        { name: 'S' },
                        { name: 'M' },
                        { name: 'L' },
                        { name: 'XL' },
                        { name: 'XXL' },
                        { name: 'XXXL' },
                    ];
                    MATERIALS = [
                        { name: 'LEATHER' },
                        { name: 'METAL' },
                        { name: 'PLASTIC' },
                        { name: 'FABRIC' },
                        { name: 'WOOD' },
                        { name: 'COTTON' },
                        { name: 'POLYESTER' },
                        { name: 'RAYON' },
                        { name: 'SILK' },
                        { name: 'LYCRA' },
                        { name: 'CASHMERE' },
                        { name: 'WOOL' },
                        { name: 'GOLD' },
                        { name: 'SILVER' },
                        { name: 'PLATINUM' },
                    ];
                    COLORS = [
                        { name: 'RED' },
                        { name: 'BLUE' },
                        { name: 'GREEN' },
                        { name: 'YELLOW' },
                        { name: 'BLACK' },
                        { name: 'WHITE' },
                        { name: 'PINK' },
                        { name: 'ORANGE' },
                        { name: 'PURPLE' },
                        { name: 'BROWN' },
                    ];
                    // inserting colors variables
                    return [4 /*yield*/, prisma.color.createMany({
                            data: COLORS,
                        })];
                case 1:
                    // inserting colors variables
                    _b.sent();
                    return [4 /*yield*/, prisma.color.findMany()];
                case 2:
                    colors = _b.sent();
                    // inserting sizes variables
                    return [4 /*yield*/, prisma.size.createMany({
                            data: SIZES,
                        })];
                case 3:
                    // inserting sizes variables
                    _b.sent();
                    return [4 /*yield*/, prisma.size.findMany()];
                case 4:
                    sizes = _b.sent();
                    // inserting materials variables
                    return [4 /*yield*/, prisma.material.createMany({
                            data: MATERIALS,
                        })];
                case 5:
                    // inserting materials variables
                    _b.sent();
                    return [4 /*yield*/, prisma.material.findMany()];
                case 6:
                    materials = _b.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                firstName: 'yanis',
                                lastName: 'touabi',
                                email: 'yanis.touabi@gmail.com',
                                password: bcrypt.hashSync('123456', 10),
                                role: 'USER',
                                gender: 'MALE',
                                age: 25,
                                phoneNumber: '0658294692',
                                isActive: true,
                            },
                        })];
                case 7:
                    user = _b.sent();
                    return [4 /*yield*/, prisma.admin.create({
                            data: {
                                userId: user.id,
                                permissionLevel: 0,
                            },
                        })];
                case 8:
                    _b.sent();
                    return [2 /*return*/, 0];
                case 9:
                    if (!(i < NUM_USERS)) return [3 /*break*/, 15];
                    return [4 /*yield*/, prisma.user.create({
                            data: generateUserData(),
                        })];
                case 10:
                    user_1 = _b.sent();
                    users.push(user_1);
                    j = 0;
                    _b.label = 11;
                case 11:
                    if (!(j < NUM_ADDRESSES_PER_USER)) return [3 /*break*/, 14];
                    return [4 /*yield*/, prisma.address.create({
                            data: generateAddressData(user_1.id),
                        })];
                case 12:
                    _b.sent();
                    _b.label = 13;
                case 13:
                    j++;
                    return [3 /*break*/, 11];
                case 14:
                    i++;
                    return [3 /*break*/, 9];
                case 15:
                    i = 0;
                    _b.label = 16;
                case 16:
                    if (!(i < NUM_CATEGORIES)) return [3 /*break*/, 22];
                    return [4 /*yield*/, prisma.category.create({
                            data: {
                                name: faker_1.faker.commerce.department(),
                                description: faker_1.faker.lorem.sentence(),
                            },
                        })];
                case 17:
                    category_1 = _b.sent();
                    j = 0;
                    _b.label = 18;
                case 18:
                    if (!(j < NUM_SUBCATEGORIES)) return [3 /*break*/, 21];
                    return [4 /*yield*/, prisma.subCategory.create({
                            data: {
                                name: faker_1.faker.commerce.productAdjective(),
                                description: faker_1.faker.lorem.sentence(),
                                categoryId: category_1.id,
                            },
                        })];
                case 19:
                    subCategory_1 = _b.sent();
                    _b.label = 20;
                case 20:
                    j++;
                    return [3 /*break*/, 18];
                case 21:
                    i++;
                    return [3 /*break*/, 16];
                case 22:
                    i = 0;
                    _b.label = 23;
                case 23:
                    if (!(i < NUM_BRAND)) return [3 /*break*/, 26];
                    return [4 /*yield*/, prisma.brand.create({
                            data: {
                                name: faker_1.faker.company.name(),
                                description: faker_1.faker.lorem.sentence(),
                            },
                        })];
                case 24:
                    brand_1 = _b.sent();
                    _b.label = 25;
                case 25:
                    i++;
                    return [3 /*break*/, 23];
                case 26: return [4 /*yield*/, prisma.category.findMany()];
                case 27:
                    category = _b.sent();
                    return [4 /*yield*/, prisma.subCategory.findMany()];
                case 28:
                    subCategory = _b.sent();
                    return [4 /*yield*/, prisma.brand.findMany()];
                case 29:
                    brand = _b.sent();
                    products = [];
                    i = 0;
                    _b.label = 30;
                case 30:
                    if (!(i < NUM_PRODUCTS)) return [3 /*break*/, 36];
                    return [4 /*yield*/, prisma.product.create({
                            data: generateProductData(getRandom(category).id, getRandom(brand).id),
                        })];
                case 31:
                    product = _b.sent();
                    products.push(product);
                    j = 0;
                    _b.label = 32;
                case 32:
                    if (!(j < NUM_REVIEWS_PER_PRODUCT)) return [3 /*break*/, 35];
                    randomUser = users[faker_1.faker.number.int({ min: 0, max: NUM_USERS - 1 })];
                    return [4 /*yield*/, prisma.review.create({
                            data: generateReviewData(randomUser.id, product.id),
                        })];
                case 33:
                    _b.sent();
                    _b.label = 34;
                case 34:
                    j++;
                    return [3 /*break*/, 32];
                case 35:
                    i++;
                    return [3 /*break*/, 30];
                case 36:
                    i = 0;
                    _b.label = 37;
                case 37:
                    if (!(i < NUM_PRODUCT_SPECIFICATIONS)) return [3 /*break*/, 41];
                    randomProduct = products[faker_1.faker.number.int({ min: 0, max: NUM_PRODUCTS - 1 })];
                    return [4 /*yield*/, prisma.productSpecification.create({
                            data: {
                                productId: randomProduct.id,
                                sizeId: getRandom(sizes).id,
                                colorId: getRandom(colors).id,
                                materialId: getRandom(materials).id,
                            },
                        })];
                case 38:
                    productSpecification = _b.sent();
                    return [4 /*yield*/, prisma.productInventory.create({
                            data: {
                                productSpecificationId: productSpecification.id,
                                quantity: faker_1.faker.number.int({ min: 0, max: 1000 }),
                            },
                        })];
                case 39:
                    _b.sent();
                    _b.label = 40;
                case 40:
                    i++;
                    return [3 /*break*/, 37];
                case 41:
                    _i = 0, users_1 = users;
                    _b.label = 42;
                case 42:
                    if (!(_i < users_1.length)) return [3 /*break*/, 52];
                    user_2 = users_1[_i];
                    i = 0;
                    _b.label = 43;
                case 43:
                    if (!(i < NUM_CARTS_PER_USER)) return [3 /*break*/, 51];
                    return [4 /*yield*/, prisma.cart.create({
                            data: generateCartData(user_2.id),
                        })];
                case 44:
                    cart = _b.sent();
                    j = 0;
                    _b.label = 45;
                case 45:
                    if (!(j < NUM_CART_ITEMS_PER_CART)) return [3 /*break*/, 50];
                    randomProduct = products[faker_1.faker.number.int({ min: 0, max: NUM_PRODUCTS - 1 })];
                    return [4 /*yield*/, prisma.productSpecification.findMany({
                            where: {
                                productId: randomProduct.id,
                            },
                        })];
                case 46:
                    randomProductSpecification = _b.sent();
                    if (!(randomProductSpecification.length > 0)) return [3 /*break*/, 49];
                    return [4 /*yield*/, prisma.cartItem.findFirst({
                            where: {
                                cartId: cart.id,
                                productSpecificationId: randomProductSpecification[0].id,
                            },
                        })];
                case 47:
                    existingCartItem = _b.sent();
                    if (!!existingCartItem) return [3 /*break*/, 49];
                    return [4 /*yield*/, prisma.cartItem.create({
                            data: {
                                cartId: cart.id,
                                productSpecificationId: randomProductSpecification[0].id,
                                quantity: faker_1.faker.number.int({ min: 1, max: 10 }),
                            },
                        })];
                case 48:
                    _b.sent();
                    _b.label = 49;
                case 49:
                    j++;
                    return [3 /*break*/, 45];
                case 50:
                    i++;
                    return [3 /*break*/, 43];
                case 51:
                    _i++;
                    return [3 /*break*/, 42];
                case 52: 
                // create wilaya
                return [4 /*yield*/, prisma.wilaya.createMany({
                        data: wilaya_1.WILAYAS,
                    })];
                case 53:
                    // create wilaya
                    _b.sent();
                    return [4 /*yield*/, prisma.wilaya.findMany()];
                case 54:
                    wilayas = _b.sent();
                    i = 0;
                    _b.label = 55;
                case 55:
                    if (!(i < NUM_SHIPPINGS)) return [3 /*break*/, 58];
                    return [4 /*yield*/, prisma.shipping.create({
                            data: generateShippingData(getRandom(wilayas).id), // Assuming wilayaId = 1
                        })];
                case 56:
                    _b.sent();
                    _b.label = 57;
                case 57:
                    i++;
                    return [3 /*break*/, 55];
                case 58:
                    _a = 0, users_2 = users;
                    _b.label = 59;
                case 59:
                    if (!(_a < users_2.length)) return [3 /*break*/, 69];
                    user_3 = users_2[_a];
                    return [4 /*yield*/, prisma.address.findMany({
                            where: { userId: user_3.id },
                        })];
                case 60:
                    addresses = _b.sent();
                    i = 0;
                    _b.label = 61;
                case 61:
                    if (!(i < NUM_ORDERS_PER_USER)) return [3 /*break*/, 68];
                    return [4 /*yield*/, prisma.order.create({
                            data: generateOrderData(user_3.id, addresses[0].id, 1), // Assuming shippingId = 1
                        })];
                case 62:
                    order = _b.sent();
                    j = 0;
                    _b.label = 63;
                case 63:
                    if (!(j < NUM_ORDER_ITEMS_PER_ORDER)) return [3 /*break*/, 67];
                    randomProduct = products[faker_1.faker.number.int({ min: 0, max: NUM_PRODUCTS - 1 })];
                    return [4 /*yield*/, prisma.productSpecification.findMany({
                            where: {
                                productId: randomProduct.id,
                            },
                        })];
                case 64:
                    randomProductSpecification = _b.sent();
                    if (!(randomProductSpecification.length > 0)) return [3 /*break*/, 66];
                    return [4 /*yield*/, prisma.orderItem.create({
                            data: {
                                orderId: order.id,
                                productSpecificationId: randomProductSpecification[0].id,
                                quantity: faker_1.faker.number.int({ min: 1, max: 10 }),
                                unitPrice: faker_1.faker.number.float({
                                    min: 10,
                                    max: 100,
                                    fractionDigits: 2,
                                }),
                            },
                        })];
                case 65:
                    _b.sent();
                    _b.label = 66;
                case 66:
                    j++;
                    return [3 /*break*/, 63];
                case 67:
                    i++;
                    return [3 /*break*/, 61];
                case 68:
                    _a++;
                    return [3 /*break*/, 59];
                case 69:
                    i = 0;
                    _b.label = 70;
                case 70:
                    if (!(i < NUM_COUPONS)) return [3 /*break*/, 73];
                    return [4 /*yield*/, prisma.coupon.create({
                            data: generateCouponData(),
                        })];
                case 71:
                    _b.sent();
                    _b.label = 72;
                case 72:
                    i++;
                    return [3 /*break*/, 70];
                case 73:
                    i = 0;
                    _b.label = 74;
                case 74:
                    if (!(i < NUM_SUPPLIERS)) return [3 /*break*/, 77];
                    return [4 /*yield*/, prisma.supplier.create({
                            data: generateSupplierData(),
                        })];
                case 75:
                    _b.sent();
                    _b.label = 76;
                case 76:
                    i++;
                    return [3 /*break*/, 74];
                case 77:
                    console.log('Database seeded successfully!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                console.log('Database connection closed.');
                return [2 /*return*/];
        }
    });
}); });
