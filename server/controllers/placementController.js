const PlacementPost = require("../models/PlacementPost");
const Comment = require("../models/Comment");

exports.create = async (req, res, next) => {
  try {
    const { title, body, company, tags } = req.body;
    const post = await PlacementPost.create({
      title, body, company,
      tags: (tags || "").split(",").map(s => s.trim()).filter(Boolean),
      creator: req.user._id
    });
    res.status(201).json(post);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    let filter = {};
    if (req.query.company) filter.company = req.query.company;
    if (req.query.q) filter.title = { $regex: req.query.q, $options: 'i' };
    const posts = await PlacementPost.find(filter)
      .populate("creator", "name avatar")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const post = await PlacementPost.findById(req.params.id)
      .populate("creator", "name avatar")
      .populate({
        path: "comments",
        populate: { path: "user", select: "name avatar" }
      });
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json(post);
  } catch (err) { next(err); }
};

exports.comment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const post = await PlacementPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Not found" });

    const comment = await Comment.create({
      postType: "placement",
      postId: post._id,
      user: req.user._id,
      text
    });
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const post = await PlacementPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Not found" });
    if (!post.creator.equals(req.user._id) && !req.user.isAdmin)
      return res.status(403).json({ error: "Not allowed" });
    await post.remove();
    res.json({ message: "Deleted." });
  } catch (err) { next(err); }
};