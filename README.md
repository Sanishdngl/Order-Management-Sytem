# Order Management System — Microservices with gRPC + Protobuf

A microservices-based order management system built with **Node.js**, **TypeScript**, **gRPC**, and **Protocol Buffers**. Three independent services communicate over gRPC using HTTP/2.

---

## 🚀 Tech Stack

| Layer          | Technology                             |
| -------------- | -------------------------------------- |
| Runtime        | Node.js (LTS via nvm)                  |
| Language       | TypeScript                             |
| HTTP Framework | Express.js (API Gateway only)          |
| RPC Framework  | gRPC (`@grpc/grpc-js`)                 |
| Schema         | Protocol Buffers (`.proto` files)      |
| Proto Loader   | `@grpc/proto-loader` (runtime loading) |
| Linting        | ESLint v10 (flat config)               |
| Formatting     | Prettier                               |
| Git Hooks      | Husky + lint-staged                    |

---

## 📁 Project Structure

```
order-system/
├── proto/
│   ├── product.proto               # Product service contract
│   └── order.proto                 # Order service contract
├── services/
│   ├── api-gateway/                # Express HTTP server — port 5001
│   │   └── src/
│   │       ├── clients/
│   │       │   └── grpc.client.ts          # gRPC client connections
│   │       ├── controllers/
│   │       │   ├── product.controller.ts   # HTTP → gRPC (products)
│   │       │   └── order.controller.ts     # HTTP → gRPC (orders)
│   │       ├── interceptors/
│   │       │   ├── logger.interceptor.ts   # Logs all gRPC calls
│   │       │   └── error.interceptor.ts    # Maps gRPC → HTTP errors
│   │       ├── routes/
│   │       │   ├── product.routes.ts
│   │       │   └── order.routes.ts
│   │       └── index.ts
│   ├── product-service/            # gRPC server — port 50051
│   │   └── src/
│   │       ├── data/
│   │       │   └── products.ts             # In-memory product store
│   │       ├── handlers/
│   │       │   └── product.handler.ts      # gRPC method implementations
│   │       └── index.ts
│   └── order-service/              # gRPC server — port 50052
│       └── src/
│           ├── data/
│           │   └── orders.ts               # In-memory order store
│           ├── handlers/
│           │   └── order.handler.ts        # gRPC method implementations
│           └── index.ts
└── package.json                    # Root — runs all services together
```

---

## ⚙️ Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) — Node Version Manager
- Node.js LTS (via nvm)
- Git

> No database or Docker required — data is stored in-memory for simplicity.

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

### 3. Install root dependencies

```bash
npm install
```

### 4. Install dependencies in each service

```bash
cd services/api-gateway && npm install && cd ../..
cd services/product-service && npm install && cd ../..
cd services/order-service && npm install && cd ../..
```

### 5. Configure environment variables

**`services/api-gateway/.env`:**

```env
PORT=5001
PRODUCT_SERVICE_URL=localhost:50051
ORDER_SERVICE_URL=localhost:50052
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

### Run all services together (recommended)

```bash
npm run dev
```

### Run services individually

```bash
# Terminal 1
npm run product   # Product Service on :50051

# Terminal 2
npm run order     # Order Service on :50052

# Terminal 3
npm run gateway   # API Gateway on :5001
```

Expected output:

```
Product Service running on port 50051
Order Service running on port 50052
gRPC clients initialized
API Gateway running on http://localhost:5001
```

---

## 📜 Available Scripts (root)

| Script       | Command           | Description                       |
| ------------ | ----------------- | --------------------------------- |
| All services | `npm run dev`     | Start all 3 services concurrently |
| Gateway only | `npm run gateway` | Start API Gateway                 |
| Product only | `npm run product` | Start Product Service             |
| Order only   | `npm run order`   | Start Order Service               |

---

## 🌐 API Endpoints

All requests go through the **API Gateway** at `http://localhost:5001`.

### Products

| Method | Endpoint                   | Description        |
| ------ | -------------------------- | ------------------ |
| GET    | `/api/products`            | Get all products   |
| GET    | `/api/products?category=X` | Filter by category |
| GET    | `/api/products/:id`        | Get product by ID  |
| POST   | `/api/products`            | Create a product   |
| PUT    | `/api/products/:id`        | Update a product   |
| DELETE | `/api/products/:id`        | Delete a product   |

### Orders

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| GET    | `/api/orders`            | Get all orders      |
| GET    | `/api/orders?status=X`   | Filter by status    |
| GET    | `/api/orders/:id`        | Get order by ID     |
| POST   | `/api/orders`            | Create an order     |
| PATCH  | `/api/orders/:id/status` | Update order status |

### Health Check

| Method | Endpoint  | Description            |
| ------ | --------- | ---------------------- |
| GET    | `/health` | Gateway + service URLs |

---

## 🧪 Example Requests

### Create a product

```bash
curl -X POST http://localhost:5001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AirPods Pro",
    "description": "Wireless earbuds",
    "price": 249.99,
    "stock": 100,
    "category": "Electronics"
  }'
```

### Create an order

```bash
curl -X POST http://localhost:5001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Jane Doe",
    "customer_email": "jane@example.com",
    "items": [
      { "product_id": 1, "quantity": 1, "price": 1999.99 },
      { "product_id": 2, "quantity": 2, "price": 129.99 }
    ]
  }'
```

### Update order status

```bash
curl -X PATCH http://localhost:5001/api/orders/<ORDER_ID>/status \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'
```

Valid statuses: `pending` → `confirmed` → `shipped` → `delivered`

---

## 🔌 gRPC Services

### Product Service (port 50051)

Defined in `proto/product.proto`:

| RPC Method       | Request                                          | Response                |
| ---------------- | ------------------------------------------------ | ----------------------- |
| `GetProduct`     | `{ id }`                                         | `ProductResponse`       |
| `GetAllProducts` | `{ category? }`                                  | `ProductListResponse`   |
| `CreateProduct`  | `{ name, price, stock, category, description? }` | `ProductResponse`       |
| `UpdateProduct`  | `{ id, ...fields }`                              | `ProductResponse`       |
| `DeleteProduct`  | `{ id }`                                         | `DeleteProductResponse` |

### Order Service (port 50052)

Defined in `proto/order.proto`:

| RPC Method          | Request                                      | Response            |
| ------------------- | -------------------------------------------- | ------------------- |
| `GetOrder`          | `{ id }`                                     | `OrderResponse`     |
| `GetAllOrders`      | `{ status? }`                                | `OrderListResponse` |
| `CreateOrder`       | `{ customer_name, customer_email, items[] }` | `OrderResponse`     |
| `UpdateOrderStatus` | `{ id, status }`                             | `OrderResponse`     |

---

## 🔄 Architecture

```
Client (HTTP REST)
        │
        ▼
┌───────────────────────────┐
│     API Gateway :5001     │  Express.js
│                           │
│  loggingInterceptor  ─────┼──► logs every gRPC call
│  errorInterceptor    ─────┼──► maps gRPC errors → HTTP status
│                           │
└──────┬──────────┬─────────┘
       │ gRPC     │ gRPC
       │ HTTP/2   │ HTTP/2
       ▼          ▼
┌──────────┐  ┌──────────┐
│ Product  │  │  Order   │
│ Service  │  │ Service  │
│ :50051   │  │ :50052   │
└──────────┘  └──────────┘
```

---

## 📋 Protobuf Schema

Proto files in `proto/` are the **single source of truth** — both gRPC servers and clients load the same file.

```protobuf
// Example from product.proto
service ProductService {
  rpc GetProduct     (GetProductRequest)     returns (ProductResponse);
  rpc GetAllProducts (GetAllProductsRequest) returns (ProductListResponse);
  rpc CreateProduct  (CreateProductRequest)  returns (ProductResponse);
  rpc UpdateProduct  (UpdateProductRequest)  returns (ProductResponse);
  rpc DeleteProduct  (DeleteProductRequest)  returns (DeleteProductResponse);
}
```

### Protobuf vs JSON

| Feature        | Protobuf            | JSON     |
| -------------- | ------------------- | -------- |
| Format         | Binary              | Text     |
| Size           | ~3-10x smaller      | Larger   |
| Speed          | Much faster         | Slower   |
| Schema         | Required (`.proto`) | Optional |
| Human readable | no                  | yes      |

---

## 🔐 gRPC Interceptors

Interceptors run on every gRPC call from the API Gateway:

### `loggingInterceptor`

Logs all outgoing gRPC requests and incoming responses:

```
gRPC Request  → /product.ProductService/GetProduct
gRPC Response ← /product.ProductService/GetProduct [4ms]
gRPC Error    ← /product.ProductService/GetProduct { code: 5 }
```

### `errorInterceptor`

Maps gRPC status codes to HTTP status codes:

| gRPC Code            | HTTP Status |
| -------------------- | ----------- |
| `NOT_FOUND`          | 404         |
| `INVALID_ARGUMENT`   | 400         |
| `UNAUTHENTICATED`    | 401         |
| `PERMISSION_DENIED`  | 403         |
| `ALREADY_EXISTS`     | 409         |
| `RESOURCE_EXHAUSTED` | 429         |
| `UNAVAILABLE`        | 503         |
| `INTERNAL`           | 500         |

---

## 🔒 Git Hooks (Husky)

On every `git commit`, lint-staged runs automatically:

- Prettier formats all staged `.ts` files across all services

---

## 🔮 Suggested Future Improvements

- [ ] **PostgreSQL** — replace in-memory stores with real databases per service
- [ ] **Docker** — containerize each service + docker-compose for the full system
- [ ] **JWT Auth** — add auth middleware to API Gateway
- [ ] **gRPC streaming** — add server-streaming for real-time order status updates
- [ ] **Service discovery** — use Consul or Kubernetes for dynamic service URLs
- [ ] **TLS** — replace `createInsecure()` with TLS certificates in production
- [ ] **CI/CD** — GitHub Actions pipeline: lint → build → test → deploy
- [ ] **Tests** — Jest unit tests for handlers + integration tests for full flow
- [ ] **Rate limiting** — add `express-rate-limit` to the API Gateway
- [ ] **Distributed tracing** — add OpenTelemetry for cross-service request tracing

---

## 📊 Monolith vs Microservices

| Aspect          | Monolith         | Microservices (this app) |
| --------------- | ---------------- | ------------------------ |
| Deployment      | Single unit      | Independent per service  |
| Scaling         | Scale everything | Scale only what's needed |
| Tech stack      | One stack        | Each service can differ  |
| Communication   | In-process       | gRPC / HTTP / events     |
| Complexity      | Lower            | Higher                   |
| Fault isolation | Poor             | Strong                   |

---

## 👤 Author

Built as part of the **Backend Development Learning Guide — Phase 3**
Stack: Node.js · TypeScript · gRPC · Protocol Buffers · Express · Microservices
