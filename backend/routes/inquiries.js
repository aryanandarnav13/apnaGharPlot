const express = require('express');
const router = express.Router();
const { Inquiry, User, Plot } = require('../models');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/inquiries
// @desc    Get all inquiries (admin) or user's inquiries
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    let inquiries;

    if (req.user.role === 'admin') {
      // Admin can see all inquiries
      inquiries = await Inquiry.findAll({
        include: [
          { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
          { model: Plot, as: 'plot', attributes: ['id', 'plot_number', 'location', 'size', 'price'] }
        ],
        order: [['created_at', 'DESC']]
      });
    } else {
      // Regular users can only see their own inquiries
      inquiries = await Inquiry.findAll({
        where: { user_id: req.user.id },
        include: [
          { model: Plot, as: 'plot', attributes: ['id', 'plot_number', 'location', 'size', 'price'] }
        ],
        order: [['created_at', 'DESC']]
      });
    }

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/inquiries/:id
// @desc    Get single inquiry
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
        { model: Plot, as: 'plot' }
      ]
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Check if user owns this inquiry or is admin
    if (inquiry.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this inquiry'
      });
    }

    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/inquiries
// @desc    Create new inquiry
// @access  Public (no auth required)
router.post('/', async (req, res, next) => {
  try {
    const { plot_id, name, phone, email, message } = req.body;

    // Validate required fields (only name and phone)
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone are required'
      });
    }

    // Check if plot exists
    const plot = await Plot.findByPk(plot_id);
    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found'
      });
    }

    // Create inquiry (no user_id required, email optional)
    const inquiry = await Inquiry.create({
      user_id: null, // No user login required
      plot_id,
      name,
      phone,
      email: email || null, // Email is optional
      message: message || null,
      status: 'inquired'
    });

    // Fetch complete inquiry with relations
    const completeInquiry = await Inquiry.findByPk(inquiry.id, {
      include: [
        { model: Plot, as: 'plot', attributes: ['id', 'plot_number', 'location', 'size', 'price'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: completeInquiry
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/inquiries/:id
// @desc    Update inquiry (admin only for status change)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByPk(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    const oldStatus = inquiry.status;
    await inquiry.update(req.body);

    // Update plot status based on inquiry status
    if (req.body.status && req.body.status !== oldStatus) {
      const plot = await Plot.findByPk(inquiry.plot_id);
      
      if (req.body.status === 'booked') {
        // When inquiry is marked as booked, update plot status
        await plot.update({ status: 'booked' });
      } else if (req.body.status === 'closed' && oldStatus === 'booked') {
        // If inquiry was booked and is now closed, check if we should make plot available
        // Only if the deal fell through (you can add more logic here)
        const hasOtherBookedInquiries = await Inquiry.count({
          where: {
            plot_id: inquiry.plot_id,
            status: 'booked',
            id: { [Op.ne]: inquiry.id }
          }
        });
        
        if (!hasOtherBookedInquiries) {
          await plot.update({ status: 'available' });
        }
      }
    }

    const updatedInquiry = await Inquiry.findByPk(inquiry.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] },
        { model: Plot, as: 'plot' }
      ]
    });

    res.status(200).json({
      success: true,
      data: updatedInquiry
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/inquiries/:id
// @desc    Delete inquiry
// @access  Private (Own inquiry or Admin)
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByPk(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Check authorization
    if (inquiry.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this inquiry'
      });
    }

    await inquiry.destroy();

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/inquiries/stats/dashboard
// @desc    Get inquiry statistics for admin dashboard
// @access  Private/Admin
router.get('/stats/dashboard', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { Op } = require('sequelize');
    
    const totalInquiries = await Inquiry.count();
    const inquiredCount = await Inquiry.count({ where: { status: 'inquired' } });
    const inProgressCount = await Inquiry.count({ where: { status: 'in_progress' } });
    const bookedCount = await Inquiry.count({ where: { status: 'booked' } });
    const closedCount = await Inquiry.count({ where: { status: 'closed' } });
    const cancelledCount = await Inquiry.count({ where: { status: 'cancelled' } });
    
    const totalPlots = await Plot.count();
    const availablePlots = await Plot.count({ where: { status: 'available' } });
    const soldPlots = await Plot.count({ where: { status: 'sold' } });
    const bookedPlots = await Plot.count({ where: { status: 'booked' } });

    res.status(200).json({
      success: true,
      data: {
        inquiries: {
          total: totalInquiries,
          inquired: inquiredCount,
          in_progress: inProgressCount,
          booked: bookedCount,
          closed: closedCount,
          cancelled: cancelledCount
        },
        plots: {
          total: totalPlots,
          available: availablePlots,
          booked: bookedPlots,
          sold: soldPlots
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

