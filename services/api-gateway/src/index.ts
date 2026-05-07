import "dotenv/config";
import express from "express";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import "./clients/grpc.client"; // initialize clients on startup

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// --- Routes ---
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// --- Health Check ---
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
    services: {
      product_service: process.env.PRODUCT_SERVICE_URL || "localhost:50051",
      order_service: process.env.ORDER_SERVICE_URL || "localhost:50052",
    },
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});
