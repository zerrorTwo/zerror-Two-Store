import express from "express";
import { dashboardController } from "../../controllers/dashboard.controller.js";
import { authentication, authorization } from '../../auth/auth.util.js'
const router = express.Router();

router.use(authentication);
router.use(authorization);

router.get('/chart', dashboardController.getChartData);
router.get('/stats', dashboardController.getStats);
router.get('/product-distribution', dashboardController.getDistribution);

export default router;
