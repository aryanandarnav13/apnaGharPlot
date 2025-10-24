const express = require('express');
const router = express.Router();
const { HouseDesign, Plot } = require('../models');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/house-designs
// @desc    Get all house designs (optionally filter by plot_id)
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { plot_id } = req.query;
    
    let where = {};
    if (plot_id) where.plot_id = plot_id;

    const houseDesigns = await HouseDesign.findAll({
      where,
      include: [{ model: Plot, as: 'plot', attributes: ['id', 'plot_number', 'location'] }],
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: houseDesigns.length,
      data: houseDesigns
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/house-designs/:id
// @desc    Get single house design
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const houseDesign = await HouseDesign.findByPk(req.params.id, {
      include: [{ model: Plot, as: 'plot', attributes: ['id', 'plot_number', 'location'] }]
    });

    if (!houseDesign) {
      return res.status(404).json({
        success: false,
        message: 'House design not found'
      });
    }

    res.status(200).json({
      success: true,
      data: houseDesign
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/house-designs
// @desc    Create new house design
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const houseDesign = await HouseDesign.create(req.body);

    res.status(201).json({
      success: true,
      data: houseDesign
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/house-designs/:id
// @desc    Update house design
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const houseDesign = await HouseDesign.findByPk(req.params.id);

    if (!houseDesign) {
      return res.status(404).json({
        success: false,
        message: 'House design not found'
      });
    }

    await houseDesign.update(req.body);

    res.status(200).json({
      success: true,
      data: houseDesign
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/house-designs/:id
// @desc    Delete house design
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const houseDesign = await HouseDesign.findByPk(req.params.id);

    if (!houseDesign) {
      return res.status(404).json({
        success: false,
        message: 'House design not found'
      });
    }

    await houseDesign.destroy();

    res.status(200).json({
      success: true,
      message: 'House design deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

