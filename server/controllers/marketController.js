const Listing = require('../models/MarketplaceListing');
const cloudinary = require('../config/cloudinary');

exports.create = async (req, res, next) => {
  try {
    let imgUrls = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const upload = cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "campusconnect/market" },
            (err, result) => (err ? reject(err) : resolve(result))
          );
          upload.end(file.buffer);
        });
        imgUrls.push(uploadResult.secure_url);
      }
    }
    const listing = await Listing.create({
      ...req.body,
      images: imgUrls,
      seller: req.user._id
    });
    res.status(201).json(listing);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  const { q, category } = req.query;
  let filter = {};
  if (category) filter.category = category;
  if (q) filter.title = { $regex: q, $options: 'i' };
  try {
    const items = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .populate('seller', 'name avatar email');
    res.json(items);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const item = await Listing.findById(req.params.id)
      .populate('seller', 'name avatar email');
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const item = await Listing.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    if (!item.seller.equals(req.user._id) && !req.user.isAdmin)
      return res.status(403).json({ error: 'Not allowed' });
    await item.remove();
    res.json({ message: 'Deleted.' });
  } catch (err) { next(err); }
};

exports.markSold = async (req, res, next) => {
  try {
    const item = await Listing.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    if (!item.seller.equals(req.user._id) && !req.user.isAdmin)
      return res.status(403).json({ error: 'Not allowed' });
    item.isSold = true;
    await item.save();
    res.json({ message: 'Marked as sold.' });
  } catch (err) { next(err); }
};