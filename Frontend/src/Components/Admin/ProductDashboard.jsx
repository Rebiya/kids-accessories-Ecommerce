import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FiEdit, FiTrash2, FiPlus, FiSearch, FiX, FiUpload, 
  FiShoppingBag, FiStar, FiDollarSign 
} from 'react-icons/fi';
import { FaSpinner, FaCloudUploadAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET = 'products';
const CLOUDINARY_CLOUD_NAME = 'dvpyg28pe';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// API base URLs
const PRODUCT_API_URL = 'http://localhost:3000/api/product';
const CATEGORY_API_URL = 'http://localhost:3000/api/category';

const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm, itemName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full border border-gray-200"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete {itemName}? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [productFormData, setProductFormData] = useState({
    title: '',
    description: '',
    image: '',
    price: '',
    category_name: '',
    rating_rate: '',
    rating_count: ''
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(PRODUCT_API_URL);
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      toast.error('Error fetching products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORY_API_URL);
      setCategories(response.data);
    } catch (error) {
      toast.error('Error fetching categories: ' + error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleImageUpload = async (file) => {
    if (!file) return;

    setImageUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setProductFormData(prev => ({
        ...prev,
        image: response.data.secure_url
      }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image: ' + error.message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
      handleImageUpload(file);
    } else {
      toast.error('Please upload an image file');
    }
  };

  const openModal = (item = null) => {
    setCurrentItem(item);
    setProductFormData(item ? {
      title: item.title,
      description: item.description,
      image: item.image,
      price: item.price,
      category_name: item.category_name,
      rating_rate: item.rating_rate,
      rating_count: item.rating_count
    } : {
      title: '',
      description: '',
      image: '',
      price: '',
      category_name: '',
      rating_rate: '',
      rating_count: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData({
      ...productFormData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let response;
      
      if (currentItem) {
        response = await axios.put(
          `${PRODUCT_API_URL}/${currentItem.ID}`,
          productFormData
        );
      } else {
        response = await axios.post(PRODUCT_API_URL, productFormData);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(`Product ${currentItem ? 'updated' : 'created'} successfully`);
        fetchProducts();
        closeModal();
      } else {
        toast.error(response.data.message || `Failed to ${currentItem ? 'update' : 'create'} product`);
      }
    } catch (error) {
      toast.error('Error: ' + error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`${PRODUCT_API_URL}/${itemToDelete}`);

      if (response.data.success || response.status === 200) {
        toast.success('Product deleted successfully');
        fetchProducts();
      } else {
        toast.error(response.data.message || 'Failed to delete product');
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Product Management</h1>
          <p className="text-gray-600">Manage your products inventory</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-10 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>
          
          <motion.button
            onClick={() => openModal(null)}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus className="mr-2" />
            Add Product
          </motion.button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {loading && !products.length ? (
          <div className="flex justify-center items-center p-12">
            <FaSpinner className="animate-spin text-blue-500 text-2xl" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'No products match your search' : 'No products found'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <motion.tr 
                    key={product.ID} 
                    className="hover:bg-gray-50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-4 py-4 max-w-xs">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded object-cover"
                            src={product.image || 'https://via.placeholder.com/40'}
                            alt={product.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 truncate">{product.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 truncate">{product.category_name}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiDollarSign className="text-blue-500 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {parseFloat(product.price).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiStar className="text-yellow-500 mr-1" />
                        <span className="text-sm font-medium text-gray-900 mr-1">
                          {product.rating_rate}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({product.rating_count})
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          onClick={() => openModal(product)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiEdit />
                        </motion.button>
                        <motion.button
                          onClick={() => confirmDelete(product.ID)}
                          className="text-red-600 hover:text-red-800 p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiTrash2 />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {currentItem ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={productFormData.title}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={productFormData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
                      }`}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('fileInput').click()}
                    >
                      {productFormData.image ? (
                        <div className="relative">
                          <img 
                            src={productFormData.image} 
                            alt="Preview" 
                            className="w-full h-40 object-contain rounded mb-2"
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 bg-white p-1 rounded-full hover:bg-gray-100 shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProductFormData({ ...productFormData, image: '' });
                            }}
                          >
                            <FiX className="text-red-500" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <FaCloudUploadAlt className="mx-auto text-4xl text-blue-500 mb-2" />
                          <p className="text-gray-600 mb-1">
                            {dragging ? 'Drop image here' : 'Drag & drop image or click to browse'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Supports JPG, PNG up to 5MB
                          </p>
                        </>
                      )}
                      <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                    {imageUploading && (
                      <div className="flex items-center mt-2 text-gray-500">
                        <FaSpinner className="animate-spin mr-2" />
                        Uploading image...
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                          type="number"
                          step="0.01"
                          name="price"
                          value={productFormData.price}
                          onChange={handleInputChange}
                          className="w-full pl-8 p-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        name="category_name"
                        value={productFormData.category_name}
                        onChange={handleInputChange}
                        className="w-full p-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.ID} value={category.category_name}>
                            {category.category_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">
                          <FiStar className="text-yellow-500" />
                        </span>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          name="rating_rate"
                          value={productFormData.rating_rate}
                          onChange={handleInputChange}
                          className="w-full pl-8 p-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating Count</label>
                      <input
                        type="number"
                        name="rating_count"
                        value={productFormData.rating_count}
                        onChange={handleInputChange}
                        className="w-full p-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <motion.button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={loading || imageUploading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loading && <FaSpinner className="animate-spin mr-2" />}
                    {currentItem ? 'Update Product' : 'Add Product'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName="this product"
      />
    </div>
  );
};

export default ProductDashboard;