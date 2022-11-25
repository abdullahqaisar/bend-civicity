const Message = require("../models/message.model");

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user;
    const { to, message } = req.body;
    const newMessage = new Message({ from: userId, to, message });
    newMessage = await newMessage.save();
    if (!newMessage) {
      return res.status(500).json({ message: "Message not sent" });
    }
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserMessage = async (req, res) => {
  try {
    const userId = req.user;
    const { to } = req.params;
    const messages = await Message.find({
      $or: [{ from: userId, to }, { from: to, to: userId }],
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
