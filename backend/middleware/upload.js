const multer = require('multer');
const path = require('path');

// Use memory storage for Cloudinary upload
// Files will be stored in memory as Buffer objects
const storage = multer.memoryStorage();

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// File filter for videos
const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|avi|mov|wmv|webm|mkv/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /video/.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only video files are allowed (mp4, avi, mov, wmv, webm, mkv)'));
  }
};

// File filter for both images and videos
const mediaFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedVideoTypes = /mp4|avi|mov|wmv|webm|mkv/;
  const extname = path.extname(file.originalname).toLowerCase();
  
  const isImage = allowedImageTypes.test(extname) && /image/.test(file.mimetype);
  const isVideo = allowedVideoTypes.test(extname) && /video/.test(file.mimetype);

  if (isImage || isVideo) {
    return cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'));
  }
};

// Create multer upload instances
const uploadImages = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for images
  },
  fileFilter: imageFilter
});

const uploadVideos = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos
  },
  fileFilter: videoFilter
});

const uploadMedia = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for media
  },
  fileFilter: mediaFilter
});

module.exports = {
  uploadImages,
  uploadVideos,
  uploadMedia,
  upload: uploadImages // default export for backward compatibility
};

