import express  from "express";
import cookieParser from "cookie-parser";
import { canUserReview, createProductReview, deleteProduct, deleteReview, getAdminProducts, getProdcuts, getProductDetails, getProductReviews, newProduct, updateProduct } from "../controllers/productController.js";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
router.use(cookieParser());

router.route("/products").get(getProdcuts);
router.route("/products/:id").get(getProductDetails);
router.route("/admin/products").get(isAuthenticated, authorizeRoles("admin"), getAdminProducts);
router.route("/admin/product/new").post(isAuthenticated, authorizeRoles("admin"),  newProduct)
router.route("/admin/products/:id").put( isAuthenticated, authorizeRoles("admin"), updateProduct);
router.route("/admin/products/:id").delete(isAuthenticated, authorizeRoles("admin"), deleteProduct);
router.route("/reviews").put(isAuthenticated, createProductReview);
router.route("/reviews").get(isAuthenticated, getProductReviews);
router.route("/admin/reviews").delete(isAuthenticated, authorizeRoles("admin"), deleteReview);
router.route("/can_review").get(isAuthenticated, canUserReview);
export default router;