# E-commerce Coupon Management API

This project implements a RESTful API for managing and applying different types of discount coupons (cart-wise, product-wise, and BxGy) for an e-commerce platform.

## Features

- Create, read, update, and delete coupons
- Get applicable coupons for a given cart
- Apply a specific coupon to a cart

## Implemented Cases

1. Cart-wise Coupons:

   - Percentage discount on total cart value above a threshold
   - Fixed amount discount on total cart value above a threshold

2. Product-wise Coupons:

   - Percentage discount on specific products
   - Fixed amount discount on specific products

3. BxGy (Buy X Get Y) Coupons:

   - Buy a specified number of products from one set and get a specified number of products from another set for free
   - Implement repetition limit

4. Expiration dates for coupons

## Unimplemented Cases (Future Improvements)

1. Stackable coupons: Ability to apply multiple coupons to a single cart
2. Tiered discounts: Increasing discount percentages based on cart total
3. Time-based coupons: Coupons valid only during specific hours or days
4. User-specific coupons: Coupons applicable only to certain user groups or individual users
5. Category-wide coupons: Discounts applicable to all products in a specific category
6. Minimum purchase requirements for BxGy coupons
7. Exclusions: Ability to exclude certain products or categories from coupon applicability

## Limitations

1. The current implementation does not handle complex combinations of multiple coupon types
2. Performance may degrade with a large number of coupons or cart items
3. The BxGy implementation is simplified and may not cover all edge cases
4. No real-time validation of product availability for BxGy coupons

## Assumptions

1. All prices and discounts are in the same currency
2. Product IDs are unique across the system
3. The cart structure remains consistent across all API calls
4. The database is always available and responsive
5. Coupon codes are not implemented; coupons are identified by their database ID

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up MongoDB and update the connection string in `.env`
4. Run the server: `npm start`
5. Run tests: `npm test`

## API Endpoints

- POST /api/v1/coupons/add-new: Create a new coupon
- GET /api/v1/coupons/all: Retrieve all coupons
- GET /api/v1/coupons/get/{id}: Retrieve a specific coupon by its ID
- PUT /api/v1/coupons/update/{id}: Update a specific coupon by its ID
- DELETE /api/v1/coupons/delete/{id}: Delete a specific coupon by its ID
- POST /api/v1/coupons/applicable-coupons: Fetch all applicable coupons for a given cart
- POST /api/v1/coupons/apply-coupon/{id}: Apply a specific coupon to the cart

## Future Improvements

1. Implement more complex coupon types and combinations
2. Add authentication and authorization
3. Improve error handling and input validation
4. Implement caching for better performance
5. Add more comprehensive unit and integration tests
6. Implement logging and monitoring
7. Create a user interface for coupon management

## API Endpoints and Test Cases

### 1. Create a new coupon (POST /api/v1/coupons/add-new)

#### Request Payload:

```json
{
  "type": "cart-wise",
  "details": {
    "threshold": 100,
    "discount": 10
  },
  "expirationDate": "2024-12-31T23:59:59.999Z"
}
```

#### Expected Response (201 Created):

```json
{
  "_id": "60f1a7b9e6e8f32b4c9b1234",
  "type": "cart-wise",
  "details": {
    "threshold": 100,
    "discount": 10
  },
  "expirationDate": "2024-12-31T23:59:59.999Z",
  "createdAt": "2023-07-16T12:00:00.000Z",
  "updatedAt": "2023-07-16T12:00:00.000Z"
}
```

### 2. Retrieve all coupons (GET /api/v1/coupons/all)

#### Request Payload: None

#### Expected Response (200 OK):

```json
[
  {
    "_id": "60f1a7b9e6e8f32b4c9b1234",
    "type": "cart-wise",
    "details": {
      "threshold": 100,
      "discount": 10
    },
    "expirationDate": "2024-12-31T23:59:59.999Z",
    "createdAt": "2023-07-16T12:00:00.000Z",
    "updatedAt": "2023-07-16T12:00:00.000Z"
  },
  {
    "_id": "60f1a7b9e6e8f32b4c9b5678",
    "type": "product-wise",
    "details": {
      "product_id": "prod123",
      "discount": 20
    },
    "expirationDate": "2024-06-30T23:59:59.999Z",
    "createdAt": "2023-07-16T12:30:00.000Z",
    "updatedAt": "2023-07-16T12:30:00.000Z"
  }
]
```

### 3. Retrieve a specific coupon (GET /api/v1/coupons/get/{id})

#### Request Payload: None

#### Expected Response (200 OK):

```json
{
  "_id": "60f1a7b9e6e8f32b4c9b1234",
  "type": "cart-wise",
  "details": {
    "threshold": 100,
    "discount": 10
  },
  "expirationDate": "2024-12-31T23:59:59.999Z",
  "createdAt": "2023-07-16T12:00:00.000Z",
  "updatedAt": "2023-07-16T12:00:00.000Z"
}
```

### 4. Update a specific coupon (PUT /api/v1/coupons/update/{id})

#### Request Payload:

```json
{
  "details": {
    "threshold": 150,
    "discount": 15
  },
  "expirationDate": "2025-06-30T23:59:59.999Z"
}
```

#### Expected Response (200 OK):

```json
{
  "_id": "60f1a7b9e6e8f32b4c9b1234",
  "type": "cart-wise",
  "details": {
    "threshold": 150,
    "discount": 15
  },
  "expirationDate": "2025-06-30T23:59:59.999Z",
  "createdAt": "2023-07-16T12:00:00.000Z",
  "updatedAt": "2023-07-16T13:00:00.000Z"
}
```

### 5. Delete a specific coupon (DELETE /api/v1/coupons/delete/{id})

#### Request Payload: None

#### Expected Response (200 OK):

```json
{
  "message": "Coupon deleted successfully"
}
```

### 6. Fetch applicable coupons (POST /api/v1/coupons/applicable-coupons)

#### Request Payload:

```json
{
  "cart": {
    "items": [
      { "product_id": "prod123", "quantity": 2, "price": 50 },
      { "product_id": "prod456", "quantity": 1, "price": 75 }
    ]
  }
}
```

#### Expected Response (200 OK):

```json
{
  "applicable_coupons": [
    {
      "coupon_id": "60f1a7b9e6e8f32b4c9b1234",
      "type": "cart-wise",
      "discount": 17.5
    },
    {
      "coupon_id": "60f1a7b9e6e8f32b4c9b5678",
      "type": "product-wise",
      "discount": 20
    }
  ]
}
```

### 7. Apply a specific coupon (POST /api/v1/coupons/apply-coupon/{id})

#### Request Payload:

```json
{
  "cart": {
    "items": [
      { "product_id": "prod123", "quantity": 2, "price": 50 },
      { "product_id": "prod456", "quantity": 1, "price": 75 }
    ]
  }
}
```

#### Expected Response (200 OK):

```json
{
  "updated_cart": {
    "items": [
      {
        "product_id": "prod123",
        "quantity": 2,
        "price": 50,
        "total_discount": 20
      },
      {
        "product_id": "prod456",
        "quantity": 1,
        "price": 75,
        "total_discount": 0
      }
    ],
    "total_price": 175,
    "total_discount": 20,
    "final_price": 155
  }
}
```

## Additional Test Cases

### 8. Create a BxGy coupon (POST /api/v1/coupons/add-new)

#### Request Payload:

```json
{
  "type": "bxgy",
  "details": {
    "buy_products": [
      { "product_id": "prod123", "quantity": 2 },
      { "product_id": "prod456", "quantity": 1 }
    ],
    "get_products": [{ "product_id": "prod789", "quantity": 1 }],
    "repetition_limit": 2
  },
  "expirationDate": "2024-12-31T23:59:59.999Z"
}
```

#### Expected Response (201 Created):

```json
{
  "_id": "60f1a7b9e6e8f32b4c9b9012",
  "type": "bxgy",
  "details": {
    "buy_products": [
      { "product_id": "prod123", "quantity": 2 },
      { "product_id": "prod456", "quantity": 1 }
    ],
    "get_products": [{ "product_id": "prod789", "quantity": 1 }],
    "repetition_limit": 2
  },
  "expirationDate": "2024-12-31T23:59:59.999Z",
  "createdAt": "2023-07-16T14:00:00.000Z",
  "updatedAt": "2023-07-16T14:00:00.000Z"
}
```

### 9. Apply a BxGy coupon (POST /api/v1/coupons/apply-coupon/{id})

#### Request Payload:

```json
{
  "cart": {
    "items": [
      { "product_id": "prod123", "quantity": 4, "price": 50 },
      { "product_id": "prod456", "quantity": 2, "price": 75 },
      { "product_id": "prod789", "quantity": 3, "price": 25 }
    ]
  }
}
```

#### Expected Response (200 OK):

```json
{
  "updated_cart": {
    "items": [
      {
        "product_id": "prod123",
        "quantity": 4,
        "price": 50,
        "total_discount": 0
      },
      {
        "product_id": "prod456",
        "quantity": 2,
        "price": 75,
        "total_discount": 0
      },
      {
        "product_id": "prod789",
        "quantity": 3,
        "price": 25,
        "total_discount": 50
      }
    ],
    "total_price": 375,
    "total_discount": 50,
    "final_price": 325
  }
}
```

### 10. Attempt to apply an expired coupon (POST /api/v1/coupons/apply-coupon/{id})

#### Request Payload:

```json
{
  "cart": {
    "items": [
      { "product_id": "prod123", "quantity": 2, "price": 50 },
      { "product_id": "prod456", "quantity": 1, "price": 75 }
    ]
  }
}
```

#### Expected Response (400 Bad Request):

```json
{
  "error": "Coupon has expired"
}
```

These test cases cover various scenarios for each API endpoint, including different coupon types and edge cases like expired coupons. They provide a comprehensive set of examples for testing the API's functionality and can serve as a reference for developers integrating with the system.

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
