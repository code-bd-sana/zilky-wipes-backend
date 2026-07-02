# Zilky Wipes - Frontend API Integration Guide

Welcome to the Zilky Wipes API documentation for frontend developers. This guide explains the core business flows, authentication mechanisms, and how to integrate specific modules like Stripe payments.

For a complete, interactive list of all endpoints, parameters, and response schemas, please refer to the Swagger API Docs.

> [!IMPORTANT]  
> **Swagger URL:** `http://localhost:5000/api/docs` (Replace `localhost:5000` with the production domain when deployed).

---

## 1. Authentication (JWT)

The API uses **JWT (JSON Web Tokens)** for authentication.

- **Login/Register:** Call `POST /api/v1/auth/login` or `POST /api/v1/auth/register`. 
- **Response:** You will receive an `accessToken` and a `refreshToken` in the response body.
- **Usage:** For any protected route, attach the `accessToken` in the `Authorization` header of your HTTP request.
  ```http
  Authorization: Bearer <your_access_token>
  ```
- **Refresh Token:** If the access token expires, use `POST /api/v1/auth/refresh-token` with the `refreshToken` to get a new access token.

---

## 2. File Uploads (Multipart/form-data)

When creating or updating entities that require files (like a `Product` with images), you cannot send a standard JSON body. You must send a `FormData` object.

**Example: Creating a Product**
Endpoint: `POST /api/v1/products`
```javascript
const formData = new FormData();
formData.append('name', 'Zilky Wipes Pack');
formData.append('description', 'Soft and clean.');
formData.append('categoryId', 'uuid-1234');
formData.append('accordionDetails', JSON.stringify([...]));

// Append multiple images/videos
fileInput.files.forEach(file => {
  formData.append('images', file); 
});

axios.post('/api/v1/products', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 3. Order & Stripe Payment Flow

Zilky Wipes uses **Stripe Checkout Sessions** for a highly secure and optimized payment experience. You do not need to build custom credit card forms.

**Step 1: Create Order**
- Call `POST /api/v1/orders` with the user's cart items and shipping details.
- **Response:** The backend will create the order, reserve stock, generate a Stripe Checkout Session, and return a `checkoutUrl`.
```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "total": 150,
    "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_..."
  }
}
```

**Step 2: Redirect User**
- Immediately redirect the user to the `checkoutUrl` provided in the response.
- `window.location.href = response.data.data.checkoutUrl;`

**Step 3: Handle Success/Cancel**
- After the user pays on Stripe's page, Stripe will redirect them back to your frontend.
- **Success URL:** `http://localhost:3000/payment-success?session_id=...` (Show a "Thank you for your order" page).
- **Cancel URL:** `http://localhost:3000/payment-cancel` (Show a "Payment failed or cancelled" page).

> [!NOTE]  
> The backend handles the order status updates automatically via Stripe Webhooks. You do not need to call any API to confirm the payment on the frontend.

---

## 4. Subscription Flow

Subscriptions follow the exact same Stripe Checkout pattern as Orders.

**Step 1: Create Subscription**
- Call `POST /api/v1/subscriptions` providing the `productVariantId` and `frequency`.
- **Response:** Returns a `checkoutUrl`.

**Step 2: Redirect User**
- Redirect the user to the `checkoutUrl`.

**Step 3: Handle Redirect**
- Similar to orders, Stripe will redirect to `/subscription-success` or `/subscription-cancel`.

> [!WARNING]  
> For a subscription to work, the `ProductVariant` must have a valid `stripePriceId` configured by the admin in the database. Otherwise, the API will throw an error.

### Managing Active Subscriptions

Users can manage their active subscriptions directly from their profile or dashboard. This will interact directly with Stripe to modify their billing schedule.

- **Pause Subscription (Skip next deliveries):** `POST /api/v1/subscriptions/{id}/pause`
  - Pauses the billing cycle in Stripe. The user will not be charged, and no new orders will be generated until they resume.
- **Resume Subscription:** `POST /api/v1/subscriptions/{id}/resume`
  - Resumes a previously paused billing cycle in Stripe.

### Auto-Order Generation (Background Process)

You do **not** need to call any API to generate a new order for recurring subscription deliveries. 
When a subscription billing cycle hits (e.g., after 15 days), Stripe automatically charges the user's saved card. The backend listens for this successful charge via Webhooks and **automatically creates a new Order** in the database using the user's **Default Shipping Address**. The new order will automatically appear in the user's `GET /api/v1/orders/me` list with the status `PAID`.

---

## 5. Coupon Flow

Before creating an order, a user might apply a coupon.

**Step 1: Validate Coupon**
- Call `GET /api/v1/coupons/code/{coupon_code}`.
- If it returns `200 OK`, apply the `discountValue` (either `PERCENTAGE` or `FIXED_AMOUNT`) to the cart total on the frontend.
- If it returns `404 Not Found` or the `isActive` flag is false, show an "Invalid Coupon" error.

**Step 2: Send with Order**
- Currently, the order schema does not enforce sending the `couponId`, but the backend will calculate the final price automatically based on its own logic (you may need to pass the coupon code in the order payload if the backend is updated to expect it). 

---

## Summary of Key Endpoints for Frontend

- **Auth:** `/api/v1/auth/*`
- **Products:** `/api/v1/products` (GET for listing, filtering, and single view)
- **Categories:** `/api/v1/categories` (GET for dropdowns and navigation)
- **User Profile:** `/api/v1/users/me`
- **My Addresses:** `/api/v1/addresses/me`
- **My Orders:** `/api/v1/orders/me`
- **My Subscriptions:** `/api/v1/subscriptions/me`
