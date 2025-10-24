const express = require('express');
const router = express.Router();
const { Settings } = require('../models');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/settings
// @desc    Get all settings (public - for default language)
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const settings = await Settings.findAll();
    
    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    res.json({
      success: true,
      data: settingsObj
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/settings/:key
// @desc    Get specific setting by key
// @access  Public
router.get('/:key', async (req, res, next) => {
  try {
    const setting = await Settings.findOne({
      where: { key: req.params.key }
    });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    res.json({
      success: true,
      data: {
        key: setting.key,
        value: setting.value
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/settings/:key
// @desc    Update or create a setting
// @access  Private/Admin
router.put('/:key', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { value, description } = req.body;

    if (!value) {
      return res.status(400).json({
        success: false,
        message: 'Value is required'
      });
    }

    // Find or create setting
    let setting = await Settings.findOne({
      where: { key: req.params.key }
    });

    if (setting) {
      // Update existing
      setting.value = value;
      if (description) setting.description = description;
      await setting.save();
    } else {
      // Create new
      setting = await Settings.create({
        key: req.params.key,
        value,
        description
      });
    }

    res.json({
      success: true,
      message: 'Setting updated successfully',
      data: setting
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

