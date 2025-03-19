const fs = require('fs');
const path = require('path');
const { SystemInfo, Banner } = require('../models');

// Add new system info
const addSystemInfo = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(403).json({ error: 'دسترسی غیرمجاز' });
    }

    const { name, website, category, color } = req.body;
    
    if (!name || !website || !category || !req.file) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'فیلدهای الزامی را تکمیل کنید' });
    }

    const imagePath = `/download/${req.file.filename}`;

    const newSystem = await SystemInfo.create({
      name,
      website,
      icon: imagePath,
      category,
      color: color || '#000000',
      is_active: true
    });

    res.status(201).json(newSystem);
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error('Add system info error:', err);
    res.status(500).json({ error: 'خطا در ثبت اطلاعات سامانه' });
  }
};

// Get all system info (grouped by category)
const getSystemInfo = async (req, res) => {
  try {
    const systems = await SystemInfo.find({ is_active: true })
      .sort({ createdAt: 1 })
      .lean();

    const groupedSystems = systems.reduce((acc, system) => {
      const category = system.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      
      acc[category].push({
        ...system,
        icon: `${req.protocol}://${req.get('host')}${system.icon}`,
      });
      
      return acc;
    }, {});

    const categories = Object.keys(groupedSystems);
    categories.sort((a, b) => {
      const oldestA = groupedSystems[a][0].createdAt;
      const oldestB = groupedSystems[b][0].createdAt;
      return oldestA - oldestB;
    });

    const result = categories.map(category => ({
      systemName: category,
      items: groupedSystems[category]
    }));

    res.json(result);
  } catch (err) {
    console.error('Get system info error:', err);
    res.status(500).json({ error: 'خطا در دریافت اطلاعات سامانه‌ها' });
  }
};

// Update system status (active/inactive)
const updateSystemStatus = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'دسترسی غیرمجاز' });
    }

    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({ error: 'وضعیت is_active باید بولین باشد' });
    }

    const updatedSystem = await SystemInfo.findByIdAndUpdate(
      id,
      { is_active },
      { new: true }
    );

    if (!updatedSystem) {
      return res.status(404).json({ error: 'سامانه مورد نظر یافت نشد' });
    }

    res.json({ success: true, system: updatedSystem });
  } catch (err) {
    console.error('Update system status error:', err);
    res.status(500).json({ error: 'خطا در به‌روزرسانی وضعیت سامانه' });
  }
};

// Update system info
const updateSystemInfo = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'دسترسی غیرمجاز' });
    }

    const { id } = req.params;
    const { name, website, icon } = req.body;

    if (!name && !website && !icon) {
      return res.status(400).json({ error: 'حداقل یک فیلد برای به‌روزرسانی الزامی است' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (website) updateData.website = website;
    if (icon) updateData.icon = icon;

    const updatedSystem = await SystemInfo.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedSystem) {
      return res.status(404).json({ error: 'سامانه مورد نظر یافت نشد' });
    }

    res.json({ success: true, system: updatedSystem });
  } catch (err) {
    console.error('Update system info error:', err);
    res.status(500).json({ error: 'خطا در به‌روزرسانی اطلاعات سامانه' });
  }
};

// Add a new banner
const addBanner = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(403).json({ error: 'دسترسی غیرمجاز' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'آپلود تصویر الزامی است' });
    }

    const imageUrl = `/download/${req.file.filename}`;
    const newBanner = await Banner.create({ imageUrl });

    res.status(201).json({
      id: newBanner._id,
      imageUrl: `${process.env.CORS_ORIGIN}${imageUrl}`
    });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error('Add banner error:', err);
    res.status(500).json({ error: 'خطا در ایجاد بنر' });
  }
};

// Delete a banner
const deleteBanner = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'دسترسی غیرمجاز' });
    }

    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ error: 'بنر مورد نظر یافت نشد' });
    }

    // Delete the file from the filesystem
    const filename = banner.imageUrl.split('/').pop();
    const filePath = path.join(__dirname, '../../uploads', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Delete banner error:', err);
    res.status(500).json({ error: 'خطا در حذف بنر' });
  }
};

// Get all banners
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort('-createdAt');
    const result = banners.map(banner => ({
      id: banner._id,
      imageUrl: `${process.env.CORS_ORIGIN}${banner.imageUrl}`
    }));
    res.json(result);
  } catch (err) {
    console.error('Get banners error:', err);
    res.status(500).json({ error: 'خطا در دریافت لیست بنرها' });
  }
};

module.exports = {
  addSystemInfo,
  getSystemInfo,
  updateSystemStatus,
  updateSystemInfo,
  addBanner,
  deleteBanner,
  getBanners
}; 