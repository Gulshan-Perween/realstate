const Property = require("../models/Property.model");
const User = require("../models/User.model");

/* ================== DASHBOARD STATS ================== */
exports.getAdminStats = async (req, res) => {
  const totalProperties = await Property.countDocuments();
  const verified = await Property.countDocuments({ isVerified: true });
  const pending = await Property.countDocuments({ isVerified: false });
  const featured = await Property.countDocuments({ isFeatured: true });
  const users = await User.countDocuments({ role: "user" });
  const owners = await User.countDocuments({ role: "owner" });

  res.json({
    success: true,
    stats: {
      totalProperties,
      verified,
      pending,
      featured,
      users,
      owners,
    },
  });
};

/* ================== VERIFY PROPERTIES ================== */
exports.getPendingProperties = async (req, res) => {
  const properties = await Property.find({ isVerified: false })
    .populate("owner", "name email");
  res.json({ success: true, properties });
};

exports.verifyProperty = async (req, res) => {
  const { status, reason } = req.body;

  const property = await Property.findById(req.params.id);
  if (!property)
    return res.status(404).json({ message: "Property not found" });

  if (status === "approved") {
    property.isVerified = true;
    property.status = "available";
    property.rejectionReason = null;
  }

  if (status === "rejected") {
    property.isVerified = false;
    property.status = "rejected";
    property.rejectionReason = reason;
  }

  await property.save();

  res.json({ success: true });
};


/* ================== FEATURE PROPERTY ================== */
exports.toggleFeatured = async (req, res) => {
  const property = await Property.findById(req.params.id);
  property.isFeatured = !property.isFeatured;
  await property.save();

  res.json({ success: true, isFeatured: property.isFeatured }); 
};

/* ================== MANAGE USERS ================== */
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, users });
};

exports.getAllVerifiedListings = async(req, res) => {
    try{
        const listings = await Property.find({isVerified: true});
        res.json({success: true, listings});
    }catch(err){
        console.log(err);
    }
}