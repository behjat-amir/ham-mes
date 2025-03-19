const { User, ApiKey } = require('../models');

// Update user status (active/inactive)
const updateUserStatus = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const { mobile, is_active } = req.body;
    
    if (typeof is_active !== 'boolean') {
      return res.status(400).json({ error: 'is_active must be a boolean' });
    }
    
    const user = await User.findOneAndUpdate(
      { mobile }, 
      { is_active }, 
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (err) {
    console.error('Update user status error:', err);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};

// Update API key status (active/inactive)
const updateApiKeyStatus = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'دسترسی غیرمجاز: تنها ادمین می‌تواند این عملیات را انجام دهد' });
  }

  try {
    const { key, is_active } = req.body;
    
    if (typeof is_active !== 'boolean') {
      return res.status(400).json({ error: 'وضعیت is_active باید بولین باشد' });
    }
    
    const apiKeyDoc = await ApiKey.findOneAndUpdate(
      { key }, 
      { is_active }, 
      { new: true }
    );
    
    if (!apiKeyDoc) {
      return res.status(404).json({ error: 'API Key مورد نظر یافت نشد' });
    }
    
    res.json({ success: true, apiKey: apiKeyDoc });
  } catch (err) {
    console.error('Update API key status error:', err);
    res.status(500).json({ error: 'Failed to update API key status' });
  }
};

module.exports = {
  updateUserStatus,
  updateApiKeyStatus
}; 