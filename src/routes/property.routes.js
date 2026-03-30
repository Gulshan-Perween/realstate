const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");

const {
  createProperty,
  getProperties,
  getMyListings,
  getDashboardStats,
  getPropertyById,   // make sure this is exported from controller
} = require("../controllers/property.controller");

router.get("/", getProperties);                                           // public
router.get("/my", auth, role("owner"), getMyListings);                   // must be before /:id
router.get("/dashboard-stats", auth, role("owner"), getDashboardStats);  // must be before /:id
router.get("/:id", getPropertyById);                                     // param route — always last

router.post("/", auth, role("owner", "admin"), upload.array("images", 5), createProperty);

module.exports = router;