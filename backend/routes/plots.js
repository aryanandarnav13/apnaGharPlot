const express = require('express');
const router = express.Router();
const { Plot } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const { Op } = require('sequelize');

// @route   GET /api/plots
// @desc    Get all plots with filters
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { status, min_price, max_price, size, location } = req.query;
    
    let where = {};
    
    if (status) where.status = status;
    if (size) where.size = size;
    if (location) where.location = { [Op.like]: `%${location}%` };
    
    // Price range filter
    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = min_price;
      if (max_price) where.price[Op.lte] = max_price;
    }

    const plots = await Plot.findAll({
      where,
      order: [['plot_number', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: plots.length,
      data: plots
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/plots/:id
// @desc    Get single plot
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const plot = await Plot.findByPk(req.params.id);

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found'
      });
    }

    res.status(200).json({
      success: true,
      data: plot
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/plots
// @desc    Create new plot
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    // Convert empty strings to null for contact fields
    const plotData = {
      ...req.body,
      contact_phone: req.body.contact_phone?.trim() || null,
      contact_email: req.body.contact_email?.trim() || null,
      contact_whatsapp: req.body.contact_whatsapp?.trim() || null
    };
    
    const plot = await Plot.create(plotData);

    res.status(201).json({
      success: true,
      data: plot
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/plots/:id
// @desc    Update plot
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const plot = await Plot.findByPk(req.params.id);

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found'
      });
    }

    // Convert empty strings to null for contact fields
    const plotData = {
      ...req.body,
      contact_phone: req.body.contact_phone?.trim() || null,
      contact_email: req.body.contact_email?.trim() || null,
      contact_whatsapp: req.body.contact_whatsapp?.trim() || null
    };

    await plot.update(plotData);

    res.status(200).json({
      success: true,
      data: plot
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/plots/:id
// @desc    Delete plot
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const plot = await Plot.findByPk(req.params.id);

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found'
      });
    }

    await plot.destroy();

    res.status(200).json({
      success: true,
      message: 'Plot deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

