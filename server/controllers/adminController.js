const User = require("../models/User");
const Confession = require("../models/Confession");
const Report = require("../models/Report");

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').limit(50);
    res.json(users);
  } catch (err) { next(err); }
};

// Return confessions flagged for moderation
exports.reportedConfessions = async (req, res, next) => {
  try {
    const confs = await Confession.find({ isReported: true }).sort({ createdAt: -1 });
    res.json(confs);
  } catch (err) { next(err); }
};

exports.approveConfession = async (req, res, next) => {
  try {
    await Confession.findByIdAndUpdate(req.params.id, { isApproved: true, isReported: false });
    res.json({ message: "Approved." });
  } catch (err) { next(err); }
};

exports.deleteConfession = async (req, res, next) => {
  try {
    await Confession.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted." });
  } catch (err) { next(err); }
};

exports.analytics = async (req, res, next) => {
  try {
    const [users, confs, notes] = await Promise.all([
      User.countDocuments(),
      Confession.countDocuments(),
      // Add further collections as needed (Notes, Marketplace, etc.)
    ]);
    res.json({
      users,
      confessions: confs,
      // notes
    });
  } catch (err) { next(err); }
};

exports.listReports = async (req, res, next) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) { next(err); }
};