import React, { useState } from 'react';
import { FaPlus, FaTrash, FaLink, FaUpload, FaImage, FaVideo } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = API_URL.replace('/api', ''); // For serving uploaded files

const MediaUpload = ({ existingMedia = { images: [], videos: [] }, onMediaChange }) => {
  const [media, setMedia] = useState(existingMedia);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddImageUrl = () => {
    if (imageUrl && !media.images.includes(imageUrl)) {
      const updated = { ...media, images: [...media.images, imageUrl] };
      setMedia(updated);
      onMediaChange(updated);
      setImageUrl('');
      toast.success('Image URL added');
    } else if (media.images.includes(imageUrl)) {
      toast.warn('This image URL is already added.');
    }
  };

  const handleAddVideoUrl = () => {
    if (videoUrl && !media.videos.includes(videoUrl)) {
      const updated = { ...media, videos: [...media.videos, videoUrl] };
      setMedia(updated);
      onMediaChange(updated);
      setVideoUrl('');
      toast.success('Video URL added');
    } else if (media.videos.includes(videoUrl)) {
      toast.warn('This video URL is already added.');
    }
  };

  const handleFileUpload = async (e, type = 'image') => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('media', file));

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/upload/media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });

      const uploadedFiles = res.data.data;
      const newImages = uploadedFiles.filter(f => f.type === 'image').map(f => f.url);
      const newVideos = uploadedFiles.filter(f => f.type === 'video').map(f => f.url);

      const updated = {
        images: [...media.images, ...newImages],
        videos: [...media.videos, ...newVideos]
      };

      setMedia(updated);
      onMediaChange(updated);
      toast.success(`${uploadedFiles.length} file(s) uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error(error.response?.data?.message || 'Failed to upload files.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = media.images.filter((_, index) => index !== indexToRemove);
    const updated = { ...media, images: updatedImages };
    setMedia(updated);
    onMediaChange(updated);
    toast.info('Image removed');
  };

  const handleRemoveVideo = (indexToRemove) => {
    const updatedVideos = media.videos.filter((_, index) => index !== indexToRemove);
    const updated = { ...media, videos: updatedVideos };
    setMedia(updated);
    onMediaChange(updated);
    toast.info('Video removed');
  };

  return (
    <div className="mb-4 p-4 border-2 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 shadow-sm border-bihar-yellow">
      <label className="block text-bihar-red text-lg font-bold mb-4">
        📸 Images & 🎥 Videos
      </label>

      {/* Image URL Input */}
      <div className="mb-4 bg-white p-3 rounded-lg border border-gray-200">
        <label className="block text-sm font-semibold text-bihar-red mb-2">
          <FaImage className="inline mr-2" />
          Add Image URL
        </label>
        <div className="flex items-center">
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-bihar-yellow bg-white"
            placeholder="Paste image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAddImageUrl}
            className="ml-2 bg-bihar-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center whitespace-nowrap"
          >
            <FaLink className="mr-2" /> Add
          </button>
        </div>
      </div>

      {/* Video URL Input */}
      <div className="mb-4 bg-white p-3 rounded-lg border border-gray-200">
        <label className="block text-sm font-semibold text-bihar-red mb-2">
          <FaVideo className="inline mr-2" />
          Add Video URL
        </label>
        <div className="flex items-center">
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-bihar-yellow bg-white"
            placeholder="Paste video URL (mp4, webm, etc.)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAddVideoUrl}
            className="ml-2 bg-bihar-orange hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center whitespace-nowrap"
          >
            <FaLink className="mr-2" /> Add
          </button>
        </div>
      </div>

      {/* File Upload Input */}
      <div className="mb-4 bg-white p-3 rounded-lg border border-gray-200">
        <label className="block text-sm font-semibold text-bihar-red mb-2">
          <FaUpload className="inline mr-2" />
          Upload Files (Images & Videos)
        </label>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleFileUpload(e)}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-bihar-yellow file:text-white
            hover:file:bg-orange-600 cursor-pointer"
          disabled={loading}
        />
        {loading && <span className="ml-2 text-bihar-orange font-semibold">Uploading...</span>}
        <p className="text-xs text-gray-500 mt-1">
          Upload images (max 10MB each) and videos (max 100MB each)
        </p>
      </div>

      {/* Image Previews */}
      {media.images.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-bold text-bihar-red mb-2">
            📷 Images ({media.images.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {media.images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img.startsWith('/uploads') ? `${BACKEND_URL}${img}` : img}
                  alt={`Preview ${index}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-bihar-yellow transition"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                  title="Remove image"
                >
                  <FaTrash size={12} />
                </button>
                <div className="absolute bottom-1 left-1 bg-bihar-green text-white px-2 py-1 rounded text-xs font-bold">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Previews */}
      {media.videos.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-bihar-red mb-2">
            🎥 Videos ({media.videos.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {media.videos.map((vid, index) => (
              <div key={index} className="relative group bg-black rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-bihar-orange transition">
                <video
                  src={vid.startsWith('/uploads') ? `${BACKEND_URL}${vid}` : vid}
                  className="w-full h-48 object-contain"
                  controls
                />
                <button
                  type="button"
                  onClick={() => handleRemoveVideo(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                  title="Remove video"
                >
                  <FaTrash size={12} />
                </button>
                <div className="absolute bottom-2 left-2 bg-bihar-red text-white px-2 py-1 rounded text-xs font-bold">
                  VIDEO {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-4 p-3 bg-white rounded-lg border border-bihar-yellow">
        <p className="text-sm text-gray-700">
          <strong>Total Media:</strong> {media.images.length} image(s), {media.videos.length} video(s)
        </p>
      </div>
    </div>
  );
};

export default MediaUpload;

