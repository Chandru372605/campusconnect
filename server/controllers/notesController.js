const Note = require('../models/Note');
const cloudinary = require('../config/cloudinary');

exports.upload = async (req, res, next) => {
  try {
    let fileUrl = '';
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload_stream(
        { resource_type: "raw", folder: "campusconnect/notes" },
        (error, result) => {
          if (error) return next(error);
          fileUrl = result.secure_url;
          createNote();
        }
      );
      uploaded.end(req.file.buffer);

      // Helper for async call after cloudinary upload
      const createNote = async () => {
        const note = await Note.create({
          ...req.body,
          fileUrl,
          uploader: req.user._id
        });
        res.status(201).json(note);
      };
    } else {
      return res.status(400).json({ error: 'File is required!' });
    }
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  // Filters: subject/branch/semester/search/title
  const { q, subject, branch, semester } = req.query;
  let filter = {};
  if (subject) filter.subject = subject;
  if (branch) filter.branch = branch;
  if (semester) filter.semester = semester;
  if (q) filter.title = { $regex: q, $options: 'i' };

  try {
    const notes = await Note.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(req.query.limit) || 50)
      .populate('uploader', 'name email avatar');
    res.json(notes);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('uploader', 'name email avatar');
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Not found' });
    if (!note.uploader.equals(req.user._id) && !req.user.isAdmin)
      return res.status(403).json({ error: 'Not allowed' });
    await note.remove();
    res.json({ message: 'Note deleted' });
  } catch (err) { next(err); }
};

exports.upvote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Not found' });
    const already = note.upvotes.includes(req.user._id);
    if (already) {
      note.upvotes.pull(req.user._id);
    } else {
      note.upvotes.push(req.user._id);
    }
    await note.save();
    res.json({ upvotes: note.upvotes.length });
  } catch (err) { next(err); }
};

exports.recent = async (req, res, next) => {
  try {
    const notes = await Note.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('uploader', 'name avatar');
    res.json(notes);
  } catch (err) { next(err); }
};