import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { WILAYAS } from './dummy_data/wilaya';

const prisma = new PrismaClient();
let orderCounter = 1;

// Function to generate random user data
function generateUserData() {
  return {
    firstName: faker.person.firstName().substring(0, 50),
    lastName: faker.person.lastName()?.substring(0, 50),
    email: faker.internet.email().substring(0, 100),
    password: bcrypt.hashSync('password123', 10),
    gender: faker.helpers.arrayElement(['MALE', 'FEMALE', 'UNISEX']),
    avatar: faker.image.avatar(),
    age: faker.number.int({ min: 18, max: 80 }),
    phoneNumber: faker.phone.number().substring(0, 20),
    isActive: faker.datatype.boolean(),
    verificationCode: faker.string.uuid(),
  };
}

// Function to generate random product data
function generateProductData(categoryId: number, brandId: number) {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.number.float({
      min: 10,
      max: 1000,
      fractionDigits: 2,
    }),
    imageCover: faker.image.urlLoremFlickr({ category: 'fashion' }),
    images: Array.from({ length: 3 }, () =>
      faker.image.urlLoremFlickr({ category: 'fashion' }),
    ),
    sold: faker.number.int({ min: 0, max: 1000 }),
    isBestSeller: faker.datatype.boolean(),
    gender: faker.helpers.arrayElement(['MALE', 'FEMALE', 'UNISEX']),
    categoryId,
    brandId,
  };
}

// Function to generate random address data
function generateAddressData(userId: number) {
  return {
    userId,
    addressLine1: faker.location.streetAddress(),
    addressLine2: faker.location.secondaryAddress(),
    commune: faker.location.city(),
    wilayaId: faker.number.int({ min: 1, max: 58 }),
    postalCode: faker.location.zipCode(),
    country: faker.location.country(),
    phoneNumber: faker.phone.number(),
  };
}

// Function to generate random review data
function generateReviewData(userId: number, productId: number) {
  return {
    rating: faker.number.int({ min: 1, max: 5 }),
    reviewText: faker.lorem.sentences(),
    userId,
    productId,
  };
}

// Function to generate random cart data
function generateCartData(userId: number) {
  return {
    userId,
    totalPrice: faker.number.float({
      min: 10,
      max: 1000,
      fractionDigits: 2,
    }),
    totalPriceAfterDiscount: faker.number.float({
      min: 5,
      max: 500,
      fractionDigits: 2,
    }),
  };
}

// Function to generate random cart item data
function generateCartItemData(cartId: number, productId: number) {
  return {
    cartId,
    productId,
    quantity: faker.number.int({ min: 1, max: 10 }),
    color: faker.color.human(),
  };
}

// Function to generate random order data
function generateOrderData(
  userId: number,
  addressId: number,
  shippingId: number,
) {
  const orderNumber = String(orderCounter).padStart(5, '0');
  orderCounter++;
  return {
    userId,
    addressId,
    shippingId,
    orderNumber,
    subtotal: faker.number.float({
      min: 10,
      max: 1000,
      fractionDigits: 2,
    }),
    shippingCost: faker.number.float({
      min: 1,
      max: 100,
      fractionDigits: 2,
    }),
    taxAmount: faker.number.float({
      min: 1,
      max: 100,
      fractionDigits: 2,
    }),
    discountAmount: faker.number.float({
      min: 0,
      max: 50,
      fractionDigits: 2,
    }),
    totalAmount: faker.number.float({
      min: 10,
      max: 1000,
      fractionDigits: 2,
    }),
    status: faker.helpers.arrayElement([
      'PENDING',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
    ]),
    paymentStatus: faker.helpers.arrayElement([
      'PENDING',
      'PAID',
      'FAILED',
      'REFUNDED',
    ]),
    paymentMethod: faker.helpers.arrayElement(['CASH', 'CARD']),
  };
}

// Function to generate random order item data
function generateOrderItemData(orderId: number, productId: number) {
  return {
    orderId,
    productId,
    quantity: faker.number.int({ min: 1, max: 10 }),
    unitPrice: faker.number.float({
      min: 10,
      max: 100,
      fractionDigits: 2,
    }),
  };
}

// Function to generate random shipping data
function generateShippingData(wilayaId: number) {
  return {
    company: faker.company.name(),
    wilayaId: faker.number.int({ min: 1, max: 58 }),
    amount: faker.number.int({ min: 5, max: 50 }),
  };
}

// Function to generate random coupon data
function generateCouponData() {
  return {
    code: faker.string.alphanumeric(10),
    discount: faker.number.float({
      min: 5,
      max: 50,
      fractionDigits: 2,
    }),
    type: faker.helpers.arrayElement(['PERCENTAGE', 'FIXED']),
    maxUses: faker.number.int({ min: 10, max: 100 }),
    usedCount: faker.number.int({ min: 0, max: 10 }),
    startDate: faker.date.past(),
    endDate: faker.date.future(),
    isActive: faker.datatype.boolean(),
  };
}

// Function to generate random supplier data
function generateSupplierData() {
  return {
    name: faker.company.name(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    website: faker.internet.url(),
  };
}

async function main() {
  // Set the number of rows to insert for each table
  const NUM_USERS = 10;
  const NUM_ADDRESSES_PER_USER = 2;
  const NUM_PRODUCTS = 20;
  const NUM_REVIEWS_PER_PRODUCT = 5;
  const NUM_CARTS_PER_USER = 1;
  const NUM_CART_ITEMS_PER_CART = 3;
  const NUM_ORDERS_PER_USER = 2;
  const NUM_ORDER_ITEMS_PER_ORDER = 3;
  const NUM_SHIPPINGS = 5;
  const NUM_COUPONS = 5;
  const NUM_SUPPLIERS = 5;
  const NUM_CATEGORIES = 5;
  const NUM_SUBCATEGORIES = 5;
  const NUM_BRAND = 8;
  const NUM_PRODUCT_SPECIFICATIONS = 40;
  const SIZES = [
    { name: 'X' },
    { name: 'S' },
    { name: 'M' },
    { name: 'L' },
    { name: 'XL' },
    { name: 'XXL' },
    { name: 'XXXL' },
  ];
  const MATERIALS = [
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
  const COLORS = [
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

  // inserting wilaya
  await prisma.wilaya.createMany({
    data: WILAYAS,
  });

  // inserting colors variables
  await prisma.color.createMany({
    data: COLORS,
  });

  const colors = await prisma.color.findMany();

  // inserting sizes variables
  await prisma.size.createMany({
    data: SIZES,
  });

  const sizes = await prisma.size.findMany();

  // inserting materials variables
  await prisma.material.createMany({
    data: MATERIALS,
  });

  const materials = await prisma.material.findMany();

  // create the admin user
  const user = await prisma.user.create({
    data: {
      firstName: 'yanis',
      lastName: 'touabi',
      email: 'yanis.touabi@gmail.com',
      password: bcrypt.hashSync('123456', 10),
      role: 'ADMIN',
      gender: 'MALE',
      age: 25,
      phoneNumber: '0658294692',
      isActive: true,
    },
  });

  await prisma.admin.create({
    data: {
      userId: user.id,
      permissionLevel: 0,
    },
  });

  // Create Users
  const users = [];
  for (let i = 0; i < NUM_USERS; i++) {
    const user = await prisma.user.create({
      data: generateUserData(),
    });
    users.push(user);

    // Create Addresses for each user
    for (let j = 0; j < NUM_ADDRESSES_PER_USER; j++) {
      await prisma.address.create({
        data: generateAddressData(user.id),
      });
    }
  }

  for (let i = 0; i < NUM_CATEGORIES; i++) {
    let categoryName: string;
    let categoryExists: any;

    do {
      categoryName = faker.commerce.department();
      categoryExists = await prisma.category.findUnique({
        where: { name: categoryName },
      });
    } while (categoryExists); // Keep generating until a unique name is found

    // Create category
    const category = await prisma.category.create({
      data: {
        name: categoryName,
        description: faker.lorem.sentence(),
      },
    });

    for (let j = 0; j < NUM_SUBCATEGORIES; j++) {
      await prisma.subCategory.create({
        data: {
          name: faker.commerce.productAdjective(),
          description: faker.lorem.sentence(),
          categoryId: category.id,
        },
      });
    }
  }

  for (let i = 0; i < NUM_BRAND; i++) {
    const brand = await prisma.brand.create({
      data: {
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        image: faker.image.urlLoremFlickr({ category: 'fashion' }),
        website: faker.internet.url(),
      },
    });
  }

  // Create Tags
  const TAGS = [
    { name: 'Summer Collection' },
    { name: 'Winter Collection' },
    { name: 'Gold' },
    { name: 'Silver' },
    { name: 'Diamond' },
    { name: 'Luxury' },
    { name: 'Minimalist' },
    { name: 'Vintage' },
    { name: 'Engagement' },
    { name: 'Wedding' },
    { name: 'Birthstone' },
    { name: 'Pearl' },
    { name: 'Gemstone' },
    { name: 'Handmade' },
    { name: 'Limited Edition' },
  ];

  await prisma.tag.createMany({
    data: TAGS,
  });

  const tags = await prisma.tag.findMany();

  // Helper function to get a random item from an array
  function getRandom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  const category = await prisma.category.findMany();
  const subCategory = await prisma.subCategory.findMany();
  const brand = await prisma.brand.findMany();

  // Create Products
  const products = [];
  for (let i = 0; i < NUM_PRODUCTS; i++) {
    const product = await prisma.product.create({
      data: {
        ...generateProductData(
          getRandom(category).id,
          getRandom(brand).id,
        ),
        tags: {
          connect: [
            { id: getRandom(tags).id },
            { id: getRandom(tags).id },
          ],
        },
      },
    });
    products.push(product);

    // Create Reviews for each product
    for (let j = 0; j < NUM_REVIEWS_PER_PRODUCT; j++) {
      const randomUser =
        users[faker.number.int({ min: 0, max: NUM_USERS - 1 })];
      await prisma.review.create({
        data: generateReviewData(randomUser.id, product.id),
      });
    }
  }

  // create products specifications
  for (let i = 0; i < NUM_PRODUCT_SPECIFICATIONS; i++) {
    const randomProduct =
      products[faker.number.int({ min: 0, max: NUM_PRODUCTS - 1 })];

    const productSpecification =
      await prisma.productSpecification.create({
        data: {
          productId: randomProduct.id,
          sizeId: getRandom(sizes).id,
          colorId: getRandom(colors).id,
          materialId: getRandom(materials).id,
        },
      });

    await prisma.productInventory.create({
      data: {
        productSpecificationId: productSpecification.id,
        quantity: faker.number.int({ min: 0, max: 1000 }),
      },
    });
  }

  // Create Carts and Cart Items
  for (const user of users) {
    for (let i = 0; i < NUM_CARTS_PER_USER; i++) {
      const cart = await prisma.cart.create({
        data: generateCartData(user.id),
      });

      // Create Cart Items for each cart
      for (let j = 0; j < NUM_CART_ITEMS_PER_CART; j++) {
        const randomProduct =
          products[
            faker.number.int({ min: 0, max: NUM_PRODUCTS - 1 })
          ];

        // Check if the CartItem already exists
        const randomProductSpecification =
          await prisma.productSpecification.findMany({
            where: {
              productId: randomProduct.id,
            },
          });

        if (randomProductSpecification.length > 0) {
          const existingCartItem = await prisma.cartItem.findFirst({
            where: {
              cartId: cart.id,
              productSpecificationId:
                randomProductSpecification[0].id,
            },
          });

          // Only create the CartItem if it doesn't already exist
          if (!existingCartItem) {
            await prisma.cartItem.create({
              data: {
                cartId: cart.id,
                productSpecificationId:
                  randomProductSpecification[0].id,
                quantity: faker.number.int({ min: 1, max: 10 }),
              },
            });
          }
        }
      }
    }
  }

  const wilayas = await prisma.wilaya.findMany();

  // Create Shippings
  for (let i = 0; i < NUM_SHIPPINGS; i++) {
    await prisma.shipping.create({
      data: generateShippingData(getRandom(wilayas).id), // Assuming wilayaId = 1
    });
  }

  // Create Orders and Order Items
  for (const user of users) {
    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
    });
    for (let i = 0; i < NUM_ORDERS_PER_USER; i++) {
      const order = await prisma.order.create({
        data: generateOrderData(user.id, addresses[0].id, 1), // Assuming shippingId = 1
      });

      // Create Order Items for each order
      for (let j = 0; j < NUM_ORDER_ITEMS_PER_ORDER; j++) {
        const randomProduct =
          products[
            faker.number.int({ min: 0, max: NUM_PRODUCTS - 1 })
          ];

        const randomProductSpecification =
          await prisma.productSpecification.findMany({
            where: {
              productId: randomProduct.id,
            },
          });

        if (randomProductSpecification.length > 0) {
          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              productSpecificationId:
                randomProductSpecification[0].id,
              quantity: faker.number.int({ min: 1, max: 10 }),
              unitPrice: faker.number.float({
                min: 10,
                max: 100,
                fractionDigits: 2,
              }),
            },
          });
        }
      }
    }
  }

  // Create Coupons
  for (let i = 0; i < NUM_COUPONS; i++) {
    await prisma.coupon.create({
      data: generateCouponData(),
    });
  }

  // Create Suppliers
  for (let i = 0; i < NUM_SUPPLIERS; i++) {
    await prisma.supplier.create({
      data: generateSupplierData(),
    });
  }

  console.log('Database seeded successfully!');

  // Add Company Info
  await prisma.companyInfo.create({
    data: {
      companyName: 'Jewelry Store',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      phoneNumber: '+1234567890',
      email: 'contact@jewelrystore.com',
      websiteURL: 'https://jewelrystore.com',
      description: 'Premium jewelry store since 1990',
      visitingHours: 'Mon-Fri: 9am-5pm, Sat-Sun: 10am-4pm',
      facebook: 'https://facebook.com/jewelrystore',
      instagram: 'https://instagram.com/jewelrystore',
      twitter: 'https://twitter.com/jewelrystore',
      linkedIn: 'https://linkedin.com/company/jewelrystore',
    },
  });

  // Add Highlights
  await prisma.highlight.createMany({
    data: [
      {
        title: 'Summer Collection',
        description: 'Discover our new summer jewelry collection',
        image: 'https://example.com/summer-collection.jpg',
      },
      {
        title: 'Free Shipping',
        description: 'Free shipping on all orders over $100',
        image: 'https://example.com/free-shipping.jpg',
      },
    ],
  });

  // Add Social Media
  // await prisma.socialMedia.create({
  //   data: {
  //     facebook: 'https://facebook.com/jewelrystore',
  //     instagram: 'https://instagram.com/jewelrystore',
  //     twitter: 'https://twitter.com/jewelrystore',
  //     linkedIn: 'https://linkedin.com/company/jewelrystore',
  //   },
  // });

  // Add Contacts
  await prisma.contact.createMany({
    data: [
      {
        family_name: 'Smith',
        name: 'John',
        email: 'john.smith@example.com',
        phone: '+1234567890',
        description: 'Inquiry about gold rings',
      },
      {
        family_name: 'Johnson',
        name: 'Sarah',
        email: 'sarah.j@example.com',
        phone: '+1987654321',
        description: 'Question about custom orders',
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Database connection closed.');
  });
