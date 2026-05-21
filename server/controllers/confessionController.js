const Confession = require("../models/Confession");
const Comment = require("../models/Comment");

// Post a new confession (anonymous)
exports.create = async (req, res, next) => {
  try {
    const confession = await Confession.create({ text: req.body.text });
    res.status(201).json(confession);
  } catch (err) { next(err); }
};

// List all (optionally trending first)
exports.list = async (req, res, next) => {
  try {
    const { trending } = req.query;
    let confs;
    if (trending)
      confs = await Confession.find({ isApproved: true }).sort({ likes: -1, createdAt: -1 }).limit(15);
    else
      confs = await Confession.find({ isApproved: true }).sort({ createdAt: -1 }).limit(50);
    res.json(confs);
  } catch (err) { next(err); }
};

// Like/unlike confession (user id from token)
exports.like = async (req, res, next) => {
  try {
    const confession = await Confession.findById(req.params.id);
    if (!confession) return res.status(404).json({ error: "Not found" });
    const idx = confession.likes.indexOf(req.user._id);
    if (idx === -1) {
      confession.likes.push(req.user._id);
    } else {
      confession.likes.splice(idx, 1);
    }
    await confession.save();
    res.json({ likes: confession.likes.length });
  } catch (err) { next(err); }
};

// Add comment
exports.comment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const confession = await Confession.findById(req.params.id);
    if (!confession) return res.status(404).json({ error: "Not found" });
    const comment = await Comment.create({
      postType: "confession",
      postId: confession._id,
      user: req.user._id,
      text
    });
    confession.comments.push(comment._id);
    await confession.save();
    res.status(201).json(comment);
  } catch (err) { next(err); }
};

// Report for moderation
exports.report = async (req, res, next) => {
  try {
    await Confession.findByIdAndUpdate(req.params.id, { isReported: true });
    res.json({ message: "Reported for moderation." });
  } catch (err) { next(err); }
};