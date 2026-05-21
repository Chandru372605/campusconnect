const router = require("express").Router();
const { protect } = require("../middleware/auth");
const Chat = require("../models/Chat");

router.get("/:productId/:sellerId", protect, async (req, res) => {
  // Find chat between buyer and seller for product
  const { productId, sellerId } = req.params;
  // For demo: get chat with both users and product
  let chat = await Chat.findOne({
    users: { $all: [req.user._id, sellerId] },
    product: productId
  });
  if (!chat) chat = await Chat.create({ users: [req.user._id, sellerId], product: productId, messages: [] });
  res.json(chat);
});

router.post("/:productId/:sellerId", protect, async (req, res) => {
  const { productId, sellerId } = req.params;
  let chat = await Chat.findOne({
    users: { $all: [req.user._id, sellerId] },
    product: productId
  });
  if (!chat) chat = await Chat.create({ users: [req.user._id, sellerId], product: productId, messages: [] });
  chat.messages.push({ sender: req.user._id, content: req.body.content });
  await chat.save();
  res.json({ success: true });
});

module.exports = router;