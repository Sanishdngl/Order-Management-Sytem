import { Router } from "express";
import {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
} from "../controllers/order.controller";

const router = Router();

router.get("/", getAllOrders);
router.get("/:id", getOrder);
router.post("/", createOrder);
router.patch("/:id/status", updateOrderStatus);

export default router;
