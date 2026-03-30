// const Property = require('../models/Property.model');

// exports.createProperty = async (req, res) => {
//   const property = await Property.create({
//     ...req.body,
//     owner: req.user._id
//   });
//   res.json(property);
// };

// exports.getProperties = async (req, res) => {
//   const query = {};
//   if (req.query.city) query.city = req.query.city;
//   if (req.query.purpose) query.purpose = req.query.purpose;

//   const properties = await Property.find(query);
//   res.json(properties);
// };

const Property = require("../models/Property.model");

/**
 * ================= CREATE PROPERTY (OWNER)
 */
// exports.createProperty = async (req, res) => {
//   try {
//     const property = await Property.create({
//       ...req.body,
//       owner: req.user._id, // 👈 logged-in owner
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Property created successfully",
//       property,
//     });
//   } catch (error) {
//     console.error("CREATE PROPERTY ERROR:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create property",
//     });
//   }
// };
exports.createProperty = async (req, res) => {
  try {
    const images = req.files?.map((file) => file.path);

    const property = await Property.create({
      ...req.body,
      images,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Property added successfully",
      property,
    });
  } catch (error) {
    console.error("CREATE PROPERTY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add property",
    });
  }
};

/**
 * ================= GET ALL PROPERTIES (PUBLIC / FILTER)
 * For users / homepage / search
 */
exports.getProperties = async (req, res) => {
  try {
    console.log("🔍 DB state:", require("mongoose").connection.readyState);
    // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting

    const query = { isVerified: true };
    if (req.query.city) query.city = req.query.city;
    if (req.query.purpose) query.purpose = req.query.purpose;

    const properties = await Property.find(query).populate("owner", "name email");

    res.status(200).json({ success: true, properties });
  } catch (error) {
    console.error("GET PROPERTIES ERROR:", error.message); // ← check Vercel logs for exact error
    res.status(500).json({ success: false, message: "Failed to fetch properties" });
  }
};

/**
 * ================= GET OWNER LISTINGS (DASHBOARD)
 * GET /api/properties/my
 */
exports.getMyListings = async (req, res) => {
  try {
    const properties = await Property.find({
      owner: req.user._id, // 👈 ONLY logged-in owner
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      properties,
    });
  } catch (error) {
    console.error("GET MY LISTINGS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your listings",
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const totalListings = await Property.countDocuments({ owner: ownerId });

    const activeProperties = await Property.countDocuments({
      owner: ownerId,
      status: "available",
    });

    const soldOrRented = await Property.countDocuments({
      owner: ownerId,
      status: { $ne: "available" },
    });

    // 🔮 Future: inquiries table se aayega
    const newInquiries = 0;

    res.json({
      success: true,
      data: {
        totalListings,
        activeProperties,
        soldOrRented,
        newInquiries,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};

exports.getPublicProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      isVerified: true   // 🔥 THIS is correct field
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      properties
    });
  } catch (err) {
    console.error("FETCH PROPERTIES ERROR", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// property.controller.js — add this
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("owner", "name email");

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.status(200).json({ success: true, property });
  } catch (error) {
    console.error("GET PROPERTY BY ID ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch property" });
  }
};