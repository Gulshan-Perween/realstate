const User = require("../models/User.model");
const Property = require("../models/Property.model");
const { exportCSV } = require("../utils/csvExport");
const { exportPDF } = require("../utils/pdfExport");

/* ================= HELPERS ================= */

const getDateRange = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

/* ================= SUMMARY ================= */
/**
 * GET /api/admin/analytics/summary?days=30
 */
exports.analyticsSummary = async (req, res) => {
  try {
    const days = Number(req.query.days) || 30;
    const fromDate = getDateRange(days);

    const totalUsers = await User.countDocuments({
      createdAt: { $gte: fromDate },
    });

    const totalProperties = await Property.countDocuments({
      createdAt: { $gte: fromDate },
    });

    const soldRented = await Property.countDocuments({
      status: { $in: ["sold", "rented"] },
      createdAt: { $gte: fromDate },
    });

    res.json({ totalUsers, totalProperties, soldRented });
  } catch (error) {
    console.error("ANALYTICS SUMMARY ERROR:", error);
    res.status(500).json({ message: "Analytics summary failed" });
  }
};

/* ================= PROPERTY STATUS ================= */
/**
 * Uses isVerified (NOT schema change)
 * GET /api/admin/analytics/property-status?days=30
 */
exports.propertyStatus = async (req, res) => {
  try {
    const days = Number(req.query.days) || 30;
    const fromDate = getDateRange(days);

    const approved = await Property.countDocuments({
      isVerified: true,
      createdAt: { $gte: fromDate },
    });

    const pending = await Property.countDocuments({
      isVerified: false,
      createdAt: { $gte: fromDate },
    });

    res.json({
      approved,
      pending,
      rejected: 0, // future-ready
    });
  } catch (error) {
    console.error("PROPERTY STATUS ERROR:", error);
    res.status(500).json({ message: "Property status failed" });
  }
};

/* ================= MONTHLY GROWTH ================= */
/**
 * GET /api/admin/analytics/monthly-growth
 */
exports.monthlyGrowth = async (req, res) => {
  try {
    const result = await Property.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const labels = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const data = Array(12).fill(0);
    result.forEach(r => {
      data[r._id - 1] = r.count;
    });

    res.json({ labels, data });
  } catch (error) {
    console.error("MONTHLY GROWTH ERROR:", error);
    res.status(500).json({ message: "Monthly growth failed" });
  }
};

/* ================= USER ROLES ================= */
/**
 * GET /api/admin/analytics/user-roles
 */
exports.userRoles = async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    const response = { users: 0, owners: 0, agents: 0 };

    result.forEach(r => {
      if (r._id === "user") response.users = r.count;
      if (r._id === "owner") response.owners = r.count;
      if (r._id === "agent") response.agents = r.count;
    });

    res.json(response);
  } catch (error) {
    console.error("USER ROLES ERROR:", error);
    res.status(500).json({ message: "User roles failed" });
  }
};

/* ================= CITY WISE ================= */
/**
 * GET /api/admin/analytics/city-wise
 */
exports.cityWiseProperties = async (req, res) => {
  try {
    const result = await Property.aggregate([
      {
        $group: {
          _id: "$city",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json(result);
  } catch (error) {
    console.error("CITY WISE ERROR:", error);
    res.status(500).json({ message: "City-wise analytics failed" });
  }
};

/* ================= EXPORT CSV ================= */

exports.exportCityCSV = async (req, res) => {
  try {
    const data = await Property.aggregate([
      {
        $group: {
          _id: "$city",
          count: { $sum: 1 },
        },
      },
    ]);

    exportCSV(res, data, "city-wise-properties");
  } catch (error) {
    console.error("CSV EXPORT ERROR:", error);
    res.status(500).json({ message: "CSV export failed" });
  }
};

/* ================= EXPORT PDF ================= */

exports.exportCityPDF = async (req, res) => {
  try {
    const data = await Property.aggregate([
      {
        $group: {
          _id: "$city",
          count: { $sum: 1 },
        },
      },
    ]);

    exportPDF(res, "City Wise Properties", data);
  } catch (error) {
    console.error("PDF EXPORT ERROR:", error);
    res.status(500).json({ message: "PDF export failed" });
  }
};
