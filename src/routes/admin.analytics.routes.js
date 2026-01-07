const router = require("express").Router();
const analytics = require("../controllers/admin.analytics.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

router.use(auth, role("admin"));

router.get("/summary", analytics.analyticsSummary);
router.get("/property-status", analytics.propertyStatus);
router.get("/monthly-growth", analytics.monthlyGrowth);
router.get("/user-roles", analytics.userRoles);
router.get("/city-wise", analytics.cityWiseProperties);

router.get("/export/city/csv", analytics.exportCityCSV);
router.get("/export/city/pdf", analytics.exportCityPDF);

module.exports = router;
