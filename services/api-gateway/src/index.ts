import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';
import './clients/grpc.client';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    services: {
      product_service: process.env.PRODUCT_SERVICE_URL || 'localhost:50051',
      order_service: process.env.ORDER_SERVICE_URL || 'localhost:50052',
    },
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
  console.log(`📄 API Docs at http://localhost:${PORT}/api-docs`);
});
