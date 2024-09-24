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

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
