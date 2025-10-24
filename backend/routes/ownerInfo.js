const express = require('express');
const router = express.Router();
const { OwnerInfo } = require('../models');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/owner-info
// @desc    Get all owner info (active only for public)
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { show_all } = req.query;
    
    let where = {};
    // Only show active entries for public access
    if (!show_all) {
      where.is_active = true;
    }

    const ownerInfo = await OwnerInfo.findAll({
      where,
      order: [['order', 'ASC'], ['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: ownerInfo.length,
      data: ownerInfo
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/owner-info/:id
// @desc    Get single owner info
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const ownerInfo = await OwnerInfo.findByPk(req.params.id);

    if (!ownerInfo) {
      return res.status(404).json({
        success: false,
        message: 'Owner info not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ownerInfo
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/owner-info
// @desc    Create new owner info
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const ownerInfo = await OwnerInfo.create(req.body);

    res.status(201).json({
      success: true,
      data: ownerInfo
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/owner-info/:id
// @desc    Update owner info
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const ownerInfo = await OwnerInfo.findByPk(req.params.id);

    if (!ownerInfo) {
      return res.status(404).json({
        success: false,
        message: 'Owner info not found'
      });
    }

    await ownerInfo.update(req.body);

    res.status(200).json({
      success: true,
      data: ownerInfo
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/owner-info/:id
// @desc    Delete owner info
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const ownerInfo = await OwnerInfo.findByPk(req.params.id);

    if (!ownerInfo) {
      return res.status(404).json({
        success: false,
        message: 'Owner info not found'
      });
    }

    await ownerInfo.destroy();

    res.status(200).json({
      success: true,
      message: 'Owner info deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

