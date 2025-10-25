import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUpload, FaLink, FaTimes, FaImage } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Inline SVG fallback image (no external dependencies)
const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbnZhbGlkIFVSTDwvdGV4dD48L3N2Zz4=';

const ImageUpload = ({ onImagesChange, existingImages = [], multiple = false, label = "Images" }) => {
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'upload'
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState(
    Array.isArray(existingImages) ? existingImages : existingImages ? [existingImages] : []
  );

  const handleUrlAdd = () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }

    const newImages = multiple ? [...images, imageUrl.trim()] : [imageUrl.trim()];
    setImages(newImages);
    onImagesChange(multiple ? newImages : newImages[0]);
    setImageUrl('');
    toast.success('Image URL added');
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      if (multiple) {
        // Upload multiple files
        Array.from(files).forEach(file => {
          formData.append('images', file);
        });

        const response = await axios.post(`${API_URL}/upload/multiple`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });

        const uploadedUrls = response.data.data.map(img => img.fullUrl);
        const newImages = [...images, ...uploadedUrls];
        setImages(newImages);
        onImagesChange(newImages);
        toast.success(`${files.length} images uploaded successfully`);
      } else {
        // Upload single file
        formData.append('image', files[0]);

        const response = await axios.post(`${API_URL}/upload/single`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        });

        const uploadedUrl = response.data.data.fullUrl;
        setImages([uploadedUrl]);
        onImagesChange(uploadedUrl);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset file input
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(multiple ? newImages : newImages[0] || '');
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {multiple && '(Multiple)'}
      </label>

      {/* Method Selector */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setUploadMethod('url')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
            uploadMethod === 'url'
              ? 'border-primary bg-primary text-white'
              : 'border-gray-300 hover:border-primary'
          }`}
        >
          <FaLink />
          URL
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod('upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
            uploadMethod === 'upload'
              ? 'border-primary bg-primary text-white'
              : 'border-gray-300 hover:border-primary'
          }`}
        >
          <FaUpload />
          Upload
        </button>
      </div>

      {/* URL Input */}
      {uploadMethod === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlAdd())}
          />
          <button
            type="button"
            onClick={handleUrlAdd}
            className="btn-primary py-2 px-6"
          >
            Add
          </button>
        </div>
      )}

      {/* File Upload */}
      {uploadMethod === 'upload' && (
        <div>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-primary transition bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FaUpload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP (MAX. 5MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple={multiple}
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
          {uploading && (
            <p className="text-center text-sm text-gray-500 mt-2">Uploading...</p>
          )}
        </div>
      )}

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">
            {multiple ? `Selected Images (${images.length})` : 'Selected Image'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = FALLBACK_IMAGE;
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        {multiple 
          ? 'You can add multiple images using URLs or file upload'
          : 'Add one image using URL or file upload'}
      </p>
    </div>
  );
};

export default ImageUpload;

