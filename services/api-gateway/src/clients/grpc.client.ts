import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { loggingInterceptor } from "../interceptors/logger.interceptor";
import { errorInterceptor } from "../interceptors/error.interceptor";

const PRODUCT_PROTO = path.join(__dirname, "../../../../proto/product.proto");
const ORDER_PROTO = path.join(__dirname, "../../../../proto/order.proto");

const loaderOptions: protoLoader.Options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

// Channel options with interceptors attached
const channelOptions: grpc.ChannelOptions = {
  interceptors: [loggingInterceptor, errorInterceptor],
};

// Load product proto
const productPackageDef = protoLoader.loadSync(PRODUCT_PROTO, loaderOptions);
const productProto = grpc.loadPackageDefinition(productPackageDef) as any;

// Load order proto
const orderPackageDef = protoLoader.loadSync(ORDER_PROTO, loaderOptions);
const orderProto = grpc.loadPackageDefinition(orderPackageDef) as any;

// Create clients
export const productClient = new productProto.product.ProductService(
  process.env.PRODUCT_SERVICE_URL || "localhost:50051",
  grpc.credentials.createInsecure(),
  channelOptions
);

export const orderClient = new orderProto.order.OrderService(
  process.env.ORDER_SERVICE_URL || "localhost:50052",
  grpc.credentials.createInsecure(),
  channelOptions
);

console.log("gRPC clients initialized");
