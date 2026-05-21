const LostAndFound = require("../models/LostAndFound");
const cloudinary = require("../config/cloudinary");

exports.create = async (req, res, next) => {
  try {
    let imgUrl = "";
    if (req.file) {
      const up = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image", folder: "campusconnect/lostfound" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(req.file.buffer);
      });
      imgUrl = up.secure_url;
    }
    const { title, description, contact, status } = req.body;
    const post = await LostAndFound.create({
      title, description, contact, status,
      image: imgUrl,
      postedBy: req.user._id
    });
    res.status(201).json(post);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const items = await LostAndFound.find()
      .populate("postedBy", "name avatar")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const post = await LostAndFound.findById(req.params.id)
      .populate("postedBy", "name avatar");
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (err) { next(err); }
};

exports.markResolved = async (req, res, next) => {
  try {
    const post = await LostAndFound.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Not found" });
    if (!post.postedBy.equals(req.user._id) && !req.user.isAdmin)
      return res.status(403).json({ error: "Not allowed" });
    post.isResolved = true;
    await post.save();
    res.json({ message: "Marked resolved." });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const post = await LostAndFound.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Not found" });
    if (!post.postedBy.equals(req.user._id) && !req.user.isAdmin)
      return res.status(403).json({ error: "Not allowed" });
    await post.remove();
    res.json({ message: "Deleted." });
  } catch (err) { next(err); }
};