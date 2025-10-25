const express = require('express');
const router = express.Router();
const { uploadImages, uploadVideos, uploadMedia } = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');

// Helper function to check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME && 
         process.env.CLOUDINARY_API_KEY && 
         process.env.CLOUDINARY_API_SECRET;
};

// @route   POST /api/upload/single
// @desc    Upload single image
// @access  Private/Admin
router.post('/single', protect, authorize('admin'), (req, res) => {
  uploadImages.single('image')(req, res, async (err) => {
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

      // Check if Cloudinary is configured
      if (!isCloudinaryConfigured()) {
        return res.status(500).json({
          success: false,
          message: 'Image upload service not configured. Please add Cloudinary credentials to environment variables.'
        });
      }

      // Upload to Cloudinary using buffer
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'apnaghar-plots',
            resource_type: 'image'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          filename: result.public_id,
          url: result.secure_url,
          fullUrl: result.secure_url
        }
      });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error uploading image to cloud'
      });
    }
  });
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple images
// @access  Private/Admin
router.post('/multiple', protect, authorize('admin'), (req, res) => {
  uploadImages.array('images', 10)(req, res, async (err) => {
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

      // Check if Cloudinary is configured
      if (!isCloudinaryConfigured()) {
        return res.status(500).json({
          success: false,
          message: 'Image upload service not configured. Please add Cloudinary credentials to environment variables.'
        });
      }

      // Upload all files to Cloudinary
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'apnaghar-plots',
              resource_type: 'image'
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(file.buffer);
        });
      });

      const results = await Promise.all(uploadPromises);

      const images = results.map(result => ({
        filename: result.public_id,
        url: result.secure_url,
        fullUrl: result.secure_url
      }));

      res.status(200).json({
        success: true,
        message: `${req.files.length} images uploaded successfully`,
        data: images
      });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error uploading images to cloud'
      });
    }
  });
});

// @route   POST /api/upload/media
// @desc    Upload multiple media files (images and videos)
// @access  Private/Admin
router.post('/media', protect, authorize('admin'), (req, res) => {
  uploadMedia.array('media', 20)(req, res, async (err) => {
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

      // Check if Cloudinary is configured
      if (!isCloudinaryConfigured()) {
        return res.status(500).json({
          success: false,
          message: 'Image upload service not configured. Please add Cloudinary credentials to environment variables.'
        });
      }

      // Upload all files to Cloudinary
      const uploadPromises = req.files.map(file => {
        const resourceType = file.mimetype.startsWith('image') ? 'image' : 'video';
        
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'apnaghar-plots',
              resource_type: resourceType
            },
            (error, result) => {
              if (error) reject(error);
              else resolve({ ...result, type: resourceType });
            }
          );
          uploadStream.end(file.buffer);
        });
      });

      const results = await Promise.all(uploadPromises);

      const media = results.map(result => ({
        filename: result.public_id,
        url: result.secure_url,
        fullUrl: result.secure_url,
        type: result.type,
        size: result.bytes
      }));

      res.status(200).json({
        success: true,
        message: `${req.files.length} files uploaded successfully`,
        data: media
      });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error uploading files to cloud'
      });
    }
  });
});

module.exports = router;

