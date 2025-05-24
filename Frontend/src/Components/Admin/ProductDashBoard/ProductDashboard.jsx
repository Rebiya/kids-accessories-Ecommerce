import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FiEdit, FiTrash2, FiPlus, FiSearch, FiX, FiUpload,FiChevronDown, 
  FiShoppingBag, FiStar, FiDollarSign 
} from 'react-icons/fi';
import { FaSpinner, FaCloudUploadAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './productDashboard.module.css';

// Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET = 'products';
const CLOUDINARY_CLOUD_NAME = 'dvpyg28pe';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// API base URLs
const PRODUCT_API_URL = 'https://kids-accessories-ecommerce-3.onrender.com/api/product';
const CATEGORY_API_URL = 'https://kids-accessories-ecommerce-3.onrender.com/api/category';

const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm, itemName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.deleteModalOverlay}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className={styles.deleteModal}
          >
            <h3 className={styles.deleteModalTitle}>Confirm Deletion</h3>
            <p className={styles.deleteModalText}>Are you sure you want to delete {itemName}? This action cannot be undone.</p>
            <div className={styles.deleteModalActions}>
              <button
                onClick={onCancel}
                className={styles.deleteModalCancel}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={styles.deleteModalConfirm}
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


const ProductDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxChars = 50;
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Function to truncate text to 50 characters
  const truncateText = (text) => {
    if (!text) return ''; // Handle case where description might be undefined/null
    if (text.length <= maxChars) return text;
    return text.substring(0, maxChars) + '...';
  };

  return (
    <div className={styles.descriptionContainer}>
      <div 
        className={`${styles.descriptionText} ${
          isExpanded ? styles.descriptionFull : styles.descriptionShort
        }`}
      >
        {isExpanded ? description : truncateText(description)}
      </div>
      {description && description.length > maxChars && (
        <button 
          className={styles.seeMoreButton} 
          onClick={toggleExpand}
          type="button" // Add type="button" to prevent form submission if used in a form
        >
          {isExpanded ? 'See less' : 'See more'}
          <FiChevronDown 
            className={`${styles.seeMoreIcon} ${
              isExpanded ? styles.seeMoreIconRotated : ''
            }`} 
            size={14} 
          />
        </button>
      )}
    </div>
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
    <div className={styles.dashboard}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Product Management</h1>
            <p className={styles.subtitle}>Manage your products inventory</p>
          </div>
          
          <div className={styles.controls}>
            <div className={styles.searchContainer}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search products..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className={styles.clearButton}
                >
                  <FiX />
                </button>
              )}
            </div>
            
            <motion.button
              onClick={() => openModal(null)}
              className={styles.addButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus className={styles.addIcon} />
              Add Product
            </motion.button>
          </div>
        </div>

        {/* Product Table */}
        <div className={styles.productsTable}>
          {loading && !products.length ? (
            <div className={styles.loadingContainer}>
              <FaSpinner className={styles.spinner} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className={styles.emptyMessage}>
              {searchTerm ? 'No products match your search' : 'No products found'}
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead className={styles.tableHead}>
                  <tr>
                    <th className={styles.tableHeader}>Product</th>
                    <th className={styles.tableHeader}>Category</th>
                    <th className={styles.tableHeader}>Price</th>
                    <th className={styles.tableHeader}>Rating</th>
                    <th className={styles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody className={styles.tableBody}>
                  {filteredProducts.map((product) => (
                    <motion.tr 
                      key={product.ID} 
                      className={styles.tableRow}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                     <td className={`${styles.tableCell} ${styles.productCell}`}>
  <div className={styles.productInfo}>
    <img
      className={styles.productImage}
      src={product.image || 'https://via.placeholder.com/40'}
      alt={product.title}
    />
    <div className={styles.productDetails}>
      <div className={styles.productTitle}>{product.title}</div>
      <ProductDescription description={product.description} />
    </div>
  </div>
</td>
                      <td className={styles.tableCell}>
                        <div className={styles.categoryName}>{product.category_name}</div>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.priceCell}>
                          <FiDollarSign className={styles.priceIcon} />
                          <span className={styles.priceValue}>
                            {parseFloat(product.price).toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.ratingCell}>
                          <FiStar className={styles.ratingIcon} />
                          <span className={styles.ratingValue}>
                            {product.rating_rate}
                          </span>
                          <span className={styles.ratingCount}>
                            ({product.rating_count})
                          </span>
                        </div>
                      </td>
                      <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                        <div className={styles.actions}>
                          <motion.button
                            onClick={() => openModal(product)}
                            className={styles.editButton}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiEdit />
                          </motion.button>
                          <motion.button
                            onClick={() => confirmDelete(product.ID)}
                            className={styles.deleteButton}
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
              className={styles.modalOverlay}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className={styles.modal}
              >
                <div className={styles.modalHeader}>
                  <div>
                    <h3 className={styles.modalTitle}>
                      {currentItem ? 'Edit Product' : 'Add New Product'}
                    </h3>
                  </div>
                  <button
                    onClick={closeModal}
                    className={styles.closeButton}
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={productFormData.title}
                      onChange={handleInputChange}
                      className={styles.input}
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Description</label>
                    <textarea
                      name="description"
                      value={productFormData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className={`${styles.input} ${styles.textarea}`}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Product Image</label>
                    <div 
                      className={`${styles.uploadContainer} ${
                        dragging ? styles.uploadContainerDragging : ''
                      }`}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('fileInput').click()}
                    >
                      {productFormData.image ? (
                        <div className={styles.previewContainer}>
                          <img 
                            src={productFormData.image} 
                            alt="Preview" 
                            className={styles.previewImage}
                          />
                          <button
                            type="button"
                            className={styles.removeButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              setProductFormData({ ...productFormData, image: '' });
                            }}
                          >
                            <FiX className={styles.removeIcon} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <FaCloudUploadAlt className={styles.uploadIcon} />
                          <p className={styles.uploadText}>
                            {dragging ? 'Drop image here' : 'Drag & drop image or click to browse'}
                          </p>
                          <p className={styles.uploadHint}>
                            Supports JPG, PNG up to 5MB
                          </p>
                        </>
                      )}
                      <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        className={styles.fileInput}
                        onChange={handleFileChange}
                      />
                    </div>
                    {imageUploading && (
                      <div className={styles.uploadingText}>
                        <FaSpinner className={styles.uploadingSpinner} />
                        Uploading image...
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.grid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Price</label>
                      <div className={styles.relative}>
                        <FiDollarSign className={styles.currencyIcon} />
                        <input
                          type="number"
                          step="0.01"
                          name="price"
                          value={productFormData.price}
                          onChange={handleInputChange}
                          className={styles.input}
                          style={{ paddingLeft: '32px' }}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Category</label>
                      <select
                        name="category_name"
                        value={productFormData.category_name}
                        onChange={handleInputChange}
                        className={`${styles.input} ${styles.select}`}
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
                  
                  <div className={styles.grid}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Rating</label>
                      <div className={styles.relative}>
                        <FiStar className={styles.ratingIconInput} />
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          name="rating_rate"
                          value={productFormData.rating_rate}
                          onChange={handleInputChange}
                          className={styles.input}
                          style={{ paddingLeft: '32px' }}
                        />
                      </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Rating Count</label>
                      <input
                        type="number"
                        name="rating_count"
                        value={productFormData.rating_count}
                        onChange={handleInputChange}
                        className={styles.input}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formFooter}>
                    <motion.button
                      type="button"
                      onClick={closeModal}
                      className={styles.cancelButton}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading || imageUploading}
                      className={styles.submitButton}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {loading && <FaSpinner className={styles.submitSpinner} />}
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
    </div>
  );
};

export default ProductDashboard;