const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");

const {
  createProperty,
  getProperties,
  getMyListings,
  getDashboardStats,
  getPublicProperties
} = require("../controllers/property.controller");

/**
 * ================= PUBLIC ROUTES
 * Get all properties (for search / home page)
 */
router.get("/", getProperties);

/**
 * ================= OWNER ROUTES
 * Get logged-in owner's listings
 */
router.get("/my", auth, role("owner"), getMyListings);
router.get(
  "/dashboard-stats",
  auth,
  role("owner"),
  getDashboardStats
);

/**
 * ================= CREATE PROPERTY (WITH PHOTOS)
 * Owner & Admin both can create
 * Accepts multiple images
 */
router.post(
  "/",
  auth,
  role("owner", "admin"),
  upload.array("images", 5), // 👈 MAX 5 PHOTOS
  createProperty
);

router.get("/properties", getPublicProperties);


module.exports = router;
