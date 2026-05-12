# Order Management System — Microservices + gRPC + RBAC

A microservices-based order management system built with **Node.js**, **TypeScript**, **gRPC**, **Protocol Buffers**, and **JWT-based Role-Based Access Control (RBAC)**. Three independent services communicate over gRPC using HTTP/2.

---

## 🚀 Tech Stack

| Layer            | Technology                             |
| ---------------- | -------------------------------------- |
| Runtime          | Node.js (LTS via nvm)                  |
| Language         | TypeScript                             |
| HTTP Framework   | Express.js (API Gateway only)          |
| RPC Framework    | gRPC (`@grpc/grpc-js`)                 |
| Schema           | Protocol Buffers (`.proto` files)      |
| Proto Loader     | `@grpc/proto-loader` (runtime loading) |
| Authentication   | JWT (`jsonwebtoken`)                   |
| Password Hashing | bcryptjs                               |
| Authorization    | RBAC (Role-Based Access Control)       |
| API Docs         | Swagger UI (swagger-jsdoc)             |
| Linting          | ESLint v10 (flat config)               |
| Formatting       | Prettier                               |
| Git Hooks        | Husky + lint-staged                    |

---

## 📁 Project Structure

```
order-system/
├── proto/
│   ├── messages/
│   │   ├── common.proto              # Shared: ErrorResponse, Pagination
│   │   ├── product_messages.proto    # Product model + request/response messages
│   │   └── order_messages.proto      # Order model + request/response messages
│   └── services/
│       ├── product.proto             # ProductService definition (imports messages)
│       └── order.proto               # OrderService definition (imports messages)
├── services/
│   ├── api-gateway/                  # Express HTTP server — port 5001
│   │   └── src/
│   │       ├── clients/
│   │       │   └── grpc.client.ts            # Typed gRPC client connections
│   │       ├── config/
│   │       │   ├── roles.ts                  # Role definitions + permissions
│   │       │   ├── users.ts                  # Mock user store
│   │       │   └── swagger.ts                # Swagger/OpenAPI config
│   │       ├── controllers/
│   │       │   ├── auth.controller.ts        # Login handler
│   │       │   ├── product.controller.ts     # HTTP → gRPC (products)
│   │       │   └── order.controller.ts       # HTTP → gRPC (orders)
│   │       ├── interceptors/
│   │       │   ├── logger.interceptor.ts     # Logs all gRPC calls
│   │       │   └── error.interceptor.ts      # Maps gRPC → HTTP errors
│   │       ├── middlewares/
│   │       │   ├── auth.middleware.ts        # Verify JWT token
│   │       │   └── rbac.middleware.ts        # Check role permissions
│   │       ├── routes/
│   │       │   ├── auth.routes.ts            # Login route
│   │       │   ├── product.routes.ts         # Protected product routes
│   │       │   └── order.routes.ts           # Protected order routes
│   │       ├── types/
│   │       │   └── grpc.types.ts             # Typed gRPC clients + response shapes
│   │       └── index.ts
│   ├── product-service/              # gRPC server — port 50051
│   │   └── src/
│   │       ├── data/products.ts              # In-memory product store
│   │       ├── handlers/product.handler.ts   # gRPC method implementations
│   │       └── index.ts
│   └── order-service/                # gRPC server — port 50052
│       └── src/
│           ├── data/orders.ts                # In-memory order store
│           ├── handlers/order.handler.ts     # gRPC method implementations
│           └── index.ts
└── package.json                      # Root — runs all services together
```

---

## ⚙️ Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) — Node Version Manager
- Node.js LTS (via nvm)
- Git

> No database or Docker required — data is stored in-memory.

---

## 🛠️ Setup & Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd order-system
```

### 2. Use correct Node version

```bash
nvm use
```

### 3. Install all dependencies

```bash
npm install
cd services/api-gateway && npm install && cd ../..
cd services/product-service && npm install && cd ../..
cd services/order-service && npm install && cd ../..
```

### 4. Configure environment variables

**`services/api-gateway/.env`:**

```env
PORT=5001
PRODUCT_SERVICE_URL=localhost:50051
ORDER_SERVICE_URL=localhost:50052
JWT_SECRET=supersecretkey123
JWT_EXPIRES_IN=1h
```

**`services/product-service/.env`:**

```env
GRPC_PORT=50051
```

**`services/order-service/.env`:**

```env
GRPC_PORT=50052
```

---

## ▶️ Running the App

### Run all services together

```bash
npm run dev
```

### Run individually

```bash
npm run product   # Product Service  :50051
npm run order     # Order Service    :50052
npm run gateway   # API Gateway      :5001
```

Expected output:

```
Product Service running on port 50051
Order Service running on port 50052
gRPC clients initialized
API Gateway running on http://localhost:5001
API Docs at http://localhost:5001/api-docs
```

---

## 📜 Available Scripts

| Script            | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start all 3 services concurrently |
| `npm run gateway` | Start API Gateway only            |
| `npm run product` | Start Product Service only        |
| `npm run order`   | Start Order Service only          |

---

## 🔐 Authentication

All product and order endpoints require a **JWT Bearer token**.

### Test Credentials

| Role   | Email              | Password  |
| ------ | ------------------ | --------- |
| Admin  | admin@example.com  | admin123  |
| Editor | editor@example.com | editor123 |
| Viewer | viewer@example.com | viewer123 |

### Login

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

Response:

```json
{
  "success": true,
  "message": "Welcome Admin User!",
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Using the Token

```bash
curl http://localhost:5001/api/products \
  -H "Authorization: Bearer <your_token>"
```

---

## 🛡️ Role-Based Access Control (RBAC)

### Role Permissions

| Permission        | Admin | Editor | Viewer |
| ----------------- | ----- | ------ | ------ |
| `products:read`   | ✅    | ✅     | ✅     |
| `products:create` | ✅    | ✅     | ❌     |
| `products:update` | ✅    | ✅     | ❌     |
| `products:delete` | ✅    | ❌     | ❌     |
| `orders:read`     | ✅    | ✅     | ✅     |
| `orders:create`   | ✅    | ✅     | ❌     |
| `orders:update`   | ✅    | ✅     | ❌     |

### Auth Flow

```
Request + JWT Token
        │
        ▼
authMiddleware          ← verifies JWT, attaches user to request
        │
        ▼
rbacMiddleware          ← checks if user.role has required permission
        │
   ┌────┴────┐
   │         │
 Pass       Fail
   │         │
Controller  403 Forbidden
```

### Error Responses

**No token (401):**

```json
{ "success": false, "message": "No token provided. Please login first." }
```

**Insufficient role (403):**

```json
{
  "success": false,
  "message": "Forbidden — your role \"viewer\" cannot perform \"products:delete\"."
}
```

---

## 🌐 API Endpoints

Base URL: `http://localhost:5001`

### Auth

| Method | Endpoint          | Auth | Description             |
| ------ | ----------------- | ---- | ----------------------- |
| POST   | `/api/auth/login` | ❌   | Login and get JWT token |

### Products

| Method | Endpoint                   | Permission        | Description        |
| ------ | -------------------------- | ----------------- | ------------------ |
| GET    | `/api/products`            | `products:read`   | Get all products   |
| GET    | `/api/products?category=X` | `products:read`   | Filter by category |
| GET    | `/api/products/:id`        | `products:read`   | Get product by ID  |
| POST   | `/api/products`            | `products:create` | Create a product   |
| PUT    | `/api/products/:id`        | `products:update` | Update a product   |
| DELETE | `/api/products/:id`        | `products:delete` | Delete a product   |

### Orders

| Method | Endpoint                 | Permission      | Description         |
| ------ | ------------------------ | --------------- | ------------------- |
| GET    | `/api/orders`            | `orders:read`   | Get all orders      |
| GET    | `/api/orders?status=X`   | `orders:read`   | Filter by status    |
| GET    | `/api/orders/:id`        | `orders:read`   | Get order by ID     |
| POST   | `/api/orders`            | `orders:create` | Create an order     |
| PATCH  | `/api/orders/:id/status` | `orders:update` | Update order status |

Valid order statuses: `pending` → `confirmed` → `shipped` → `delivered`

---

## 📄 API Documentation (Swagger)

Interactive docs with JWT auth support:

```
http://localhost:5001/api-docs
```

1. Click **Authorize** button
2. Login via `/api/auth/login` to get token
3. Enter: `Bearer <your_token>`
4. All endpoints are now accessible based on your role

---

## 📋 Proto File Structure

Proto files follow a **separation of concerns** pattern — service definitions and message definitions are in separate files.

```
proto/
├── messages/                         ← data shapes only
│   ├── common.proto                  ← shared: ErrorResponse, Pagination
│   ├── product_messages.proto        ← Product model + all request/response messages
│   └── order_messages.proto          ← Order model + all request/response messages
└── services/                         ← RPC contracts only
    ├── product.proto                 ← ProductService (imports product_messages)
    └── order.proto                   ← OrderService (imports order_messages)
```

### Why this structure?

| Old (flat)                             | New (separated)                                    |
| -------------------------------------- | -------------------------------------------------- |
| Service + messages mixed in one file   | Cleanly separated by responsibility                |
| Hard to reuse messages across services | `common.proto` shared across all services          |
| Grows unmanageable as services scale   | Each file has single responsibility                |
| No clear contract boundaries           | `services/` = contracts, `messages/` = data shapes |

### Service Definition Example

```protobuf
// proto/services/product.proto
syntax = "proto3";
package product;

import "messages/product_messages.proto";

service ProductService {
  rpc GetProduct     (GetProductRequest)     returns (ProductResponse);
  rpc GetAllProducts (GetAllProductsRequest) returns (ProductListResponse);
  rpc CreateProduct  (CreateProductRequest)  returns (ProductResponse);
  rpc UpdateProduct  (UpdateProductRequest)  returns (ProductResponse);
  rpc DeleteProduct  (DeleteProductRequest)  returns (DeleteProductResponse);
}
```

---

## 🔌 gRPC Services

### Product Service (port 50051)

| RPC Method       | Request                                          | Description              |
| ---------------- | ------------------------------------------------ | ------------------------ |
| `GetProduct`     | `{ id: number }`                                 | Get single product by ID |
| `GetAllProducts` | `{ category?: string }`                          | Get all products         |
| `CreateProduct`  | `{ name, price, stock, category, description? }` | Create product           |
| `UpdateProduct`  | `{ id, ...fields }`                              | Update product           |
| `DeleteProduct`  | `{ id: number }`                                 | Delete product           |

### Order Service (port 50052)

| RPC Method          | Request                                      | Description            |
| ------------------- | -------------------------------------------- | ---------------------- |
| `GetOrder`          | `{ id: string }`                             | Get single order by ID |
| `GetAllOrders`      | `{ status?: string }`                        | Get all orders         |
| `CreateOrder`       | `{ customer_name, customer_email, items[] }` | Create order           |
| `UpdateOrderStatus` | `{ id: string, status: string }`             | Update order status    |

---

## 🧩 Typed gRPC Clients

All gRPC clients are fully typed in `src/types/grpc.types.ts` — no `any` in business logic.

```typescript
// Typed client interfaces
export interface ProductClient extends grpc.Client {
  GetAllProducts(
    payload: { category: string },
    cb: GrpcCallback<ProductListResponse>
  ): void;
  GetProduct(payload: { id: number }, cb: GrpcCallback<ProductResponse>): void;
  CreateProduct(payload: object, cb: GrpcCallback<ProductResponse>): void;
  UpdateProduct(payload: object, cb: GrpcCallback<ProductResponse>): void;
  DeleteProduct(
    payload: { id: number },
    cb: GrpcCallback<DeleteProductResponse>
  ): void;
}

export interface OrderClient extends grpc.Client {
  GetAllOrders(
    payload: { status: string },
    cb: GrpcCallback<OrderListResponse>
  ): void;
  GetOrder(payload: { id: string }, cb: GrpcCallback<OrderResponse>): void;
  CreateOrder(payload: object, cb: GrpcCallback<OrderResponse>): void;
  UpdateOrderStatus(
    payload: { id: string; status: string },
    cb: GrpcCallback<OrderResponse>
  ): void;
}
```

---

## 🔒 gRPC Interceptors

### `loggingInterceptor`

```
gRPC Request  → /product.ProductService/GetProduct
gRPC Response ← /product.ProductService/GetProduct [4ms]
gRPC Error    ← /product.ProductService/GetProduct { code: 5 }
```

### `errorInterceptor`

| gRPC Code           | HTTP Status |
| ------------------- | ----------- |
| `NOT_FOUND`         | 404         |
| `INVALID_ARGUMENT`  | 400         |
| `UNAUTHENTICATED`   | 401         |
| `PERMISSION_DENIED` | 403         |
| `ALREADY_EXISTS`    | 409         |
| `UNAVAILABLE`       | 503         |
| `INTERNAL`          | 500         |

---

## 🔄 Full Architecture

```
Client (HTTP REST)
        │
        ▼
┌─────────────────────────────────┐
│        API Gateway :5001        │
│                                 │
│  POST /api/auth/login ──────────┼──► authController (JWT issued)
│                                 │
│  authMiddleware ────────────────┼──► verify JWT token
│  rbacMiddleware ────────────────┼──► check role permission
│                                 │
│  loggingInterceptor ────────────┼──► log every gRPC call
│  errorInterceptor ─────────────┼──► map gRPC codes → HTTP status
│                                 │
│  Typed ProductClient ───────────┼──► gRPC/HTTP2 → Product Service
│  Typed OrderClient ─────────────┼──► gRPC/HTTP2 → Order Service
└─────────────────────────────────┘
         │                │
         ▼                ▼
  ┌──────────┐     ┌──────────┐
  │ Product  │     │  Order   │
  │ Service  │     │ Service  │
  │ :50051   │     │ :50052   │
  │          │     │          │
  │ proto/   │     │ proto/   │
  │ services/│     │ services/│
  │ messages/│     │ messages/│
  └──────────┘     └──────────┘
```

---

## 🔮 Suggested Future Improvements

- [ ] **PostgreSQL** — replace in-memory stores with real databases per service
- [ ] **Refresh tokens** — add token refresh endpoint to extend sessions
- [ ] **Docker** — containerize each service + docker-compose for the full system
- [ ] **TLS** — replace `createInsecure()` with proper TLS certificates in production
- [ ] **gRPC streaming** — real-time order status updates via server-side streaming
- [ ] **Service discovery** — Consul or Kubernetes for dynamic service URLs
- [ ] **CI/CD** — GitHub Actions: lint → build → test → deploy
- [ ] **Tests** — Jest unit tests for handlers + RBAC middleware tests
- [ ] **Rate limiting** — `express-rate-limit` on API Gateway
- [ ] **Audit logs** — log every role-based action (who did what and when)
- [ ] **Distributed tracing** — OpenTelemetry for cross-service request tracing

---

## 📊 Monolith vs Microservices

| Aspect          | Monolith         | Microservices (this app) |
| --------------- | ---------------- | ------------------------ |
| Deployment      | Single unit      | Independent per service  |
| Scaling         | Scale everything | Scale only what's needed |
| Communication   | In-process       | gRPC / HTTP / events     |
| Fault isolation | Poor             | Strong                   |
| Complexity      | Lower            | Higher                   |

---

## 👤 Author

Built as part of the **Backend Development Learning Guide — Phase 3**
Stack: Node.js · TypeScript · gRPC · Protocol Buffers · Express · JWT · RBAC · Microservices
All gRPC clients are fully typed in `src/types/grpc.types.ts` — no `any` in business logic.
