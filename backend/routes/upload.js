const express = require('express');
const router = express.Router();
const { uploadImages, uploadVideos, uploadMedia } = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');
const path = require('path');

// @route   POST /api/upload/single
// @desc    Upload single image
// @access  Private/Admin
router.post('/single', protect, authorize('admin'), (req, res) => {
  uploadImages.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Error uploading image'
      });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          filename: req.file.filename,
          url: imageUrl,
          fullUrl: `${req.protocol}://${req.get('host')}${imageUrl}`
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error uploading image'
      });
    }
  });
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple images
// @access  Private/Admin
router.post('/multiple', protect, authorize('admin'), (req, res) => {
  uploadImages.array('images', 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Error uploading images'
      });
    }
    
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const images = req.files.map(file => ({
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        fullUrl: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
      }));

      res.status(200).json({
        success: true,
        message: `${req.files.length} images uploaded successfully`,
        data: images
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error uploading images'
      });
    }
  });
});

// @route   POST /api/upload/media
// @desc    Upload multiple media files (images and videos)
// @access  Private/Admin
router.post('/media', protect, authorize('admin'), (req, res) => {
  uploadMedia.array('media', 20)(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Error uploading files'
      });
    }
    
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded'
        });
      }

      const media = req.files.map(file => ({
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        fullUrl: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
        type: file.mimetype.startsWith('image') ? 'image' : 'video',
        size: file.size
      }));

      res.status(200).json({
        success: true,
        message: `${req.files.length} files uploaded successfully`,
        data: media
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error uploading files'
      });
    }
  });
});

module.exports = router;

