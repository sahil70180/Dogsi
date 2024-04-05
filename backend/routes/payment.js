import express from "express"
import { isAuthenticated } from "../middlewares/auth.js";
import { stripeCheckoutSession, stripeWebhook } from "../controllers/paymentControllers.js";
const router = express.Router();

router.route("/payment/checkout_session").post(isAuthenticated, stripeCheckoutSession);
router.route("/payment/webhook").post(stripeWebhook);
export default router;