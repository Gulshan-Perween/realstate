const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

const {
  getAdminStats,
  getPendingProperties,
  verifyProperty,
  toggleFeatured,
  getAllUsers,
  getAllVerifiedListings,
} = require("../controllers/admin.controller");

// DASHBOARD
router.get("/stats", auth, role("admin"), getAdminStats);

// PROPERTY VERIFICATION
router.get("/properties/pending", auth, role("admin"), getPendingProperties);
router.get("/properties/verify", getAllVerifiedListings);
router.patch("/properties/verify/:id", auth, role("admin"), verifyProperty);

//New Added

// FEATURE PROPERTY
router.patch("/properties/feature/:id", auth, role("admin"), toggleFeatured);

// USERS
router.get("/users", auth, role("admin"), getAllUsers);

module.exports = router;
