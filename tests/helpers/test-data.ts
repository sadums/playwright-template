import { faker } from '@faker-js/faker';

export interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface ProductData {
  name: string;
  description: string;
  price: number;
  sku: string;
}

/**
 * Generate a random user with a UUID suffix on the email to ensure
 * uniqueness across parallel test runs.
 */
export function createUser(overrides: Partial<UserData> = {}): UserData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const uniqueSuffix = faker.string.uuid().slice(0, 8);

  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${uniqueSuffix}@example.com`,
    password: faker.internet.password({ length: 16, memorable: false }),
    ...overrides,
  };
}

/**
 * Generate a random product with a UUID suffix on the SKU.
 */
export function createProduct(overrides: Partial<ProductData> = {}): ProductData {
  const uniqueSuffix = faker.string.uuid().slice(0, 8);

  return {
    name: `${faker.commerce.productName()} ${uniqueSuffix}`,
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price({ min: 1, max: 999 })),
    sku: `SKU-${uniqueSuffix.toUpperCase()}`,
    ...overrides,
  };
}
