const { Message, ApiKey } = require('../models');

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { recipient, content } = req.body;
    await Message.create({ sender: req.sender, recipient, content });
    res.json({ success: true });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get user messages with pagination
const getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find({ recipient: req.user.mobile })
        .sort('-timestamp')
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Message.countDocuments({ recipient: req.user.mobile })
    ]);

    const enrichedMessages = await Promise.all(
      messages.map(async msg => {
        const apiKey = await ApiKey.findOne({ senderName: msg.sender });
        const imagePath = apiKey?.image || null;
        
        return {
          ...msg,
          senderImage: imagePath ? `${process.env.CORS_ORIGIN}${imagePath}` : null
        };
      })
    );

    res.json({
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      data: enrichedMessages
    });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};

module.exports = {
  sendMessage,
  getMessages
}; 