import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import './Category.css';

const API_BASE_URL = 'https://kids-accessories-ecommerce-3.onrender.com/api';

const CategoryDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ category_name: '' });
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/category`);
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      toast.error('Failed to fetch categories: ' + error.message);
      setCategories([]);
      setFilteredCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search term
  useEffect(() => {
    const filtered = categories.filter(category =>
      category.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  // Open modal for adding or editing
  const openModal = (category = null) => {
    setCurrentCategory(category);
    setFormData(category ? { category_name: category.category_name } : { category_name: '' });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
    setFormData({ category_name: '' });
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (currentCategory) {
        // Update category
        const response = await axios.put(`${API_BASE_URL}/category/${currentCategory.ID}`, formData);
        setCategories(prev =>
          prev.map(cat => (cat.ID === currentCategory.ID ? { ...cat, ...response.data } : cat))
        );
        toast.success('Category updated successfully');
      } else {
        // Add new category
        const response = await axios.post(`${API_BASE_URL}/category`, formData);
        setCategories(prev => [...prev, response.data]);
        toast.success('Category added successfully');
      }
      closeModal();
      fetchCategories(); // Refresh categories
    } catch (error) {
      toast.error(`Failed to ${currentCategory ? 'update' : 'add'} category: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Confirm delete
  const confirmDelete = (id) => {
    setCategoryToDelete(id);
    setDeleteModalOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/category/${categoryToDelete}`);
      setCategories(prev => prev.filter(cat => cat.ID !== categoryToDelete));
      setFilteredCategories(prev => prev.filter(cat => cat.ID !== categoryToDelete));
      toast.success('Category deleted successfully');
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      toast.error('Failed to delete category: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-dashboard">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Category Management</h1>
          <p className="dashboard-subtitle">Manage your product categories</p>
        </div>
        
        <div className="controls-container">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search categories..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <motion.button
            onClick={() => openModal()}
            className="add-button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiPlus className="add-icon" />
            Add Category
          </motion.button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="categories-table">
        {loading && !categories.length ? (
          <div className="empty-state">
            <div className="loading-spinner"></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="empty-state">
            {searchTerm ? 'No categories match your search' : 'No categories found'}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Category Name</th>
                  <th className="table-header-cell text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <motion.tr 
                    key={category.ID}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="table-row"
                  >
                    <td className="table-cell category-name">{category.category_name}</td>
                    <td className="table-cell">
                      <div className="action-buttons">
                        <motion.button
                          onClick={() => openModal(category)}
                          className="edit-button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiEdit2 />
                        </motion.button>
                        <motion.button
                          onClick={() => confirmDelete(category.ID)}
                          className="delete-button"
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
            className="modal-overlay"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="modal-content"
            >
              <div className="modal-header">
                <h3 className="modal-title">
                  {currentCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button
                  onClick={closeModal}
                  className="modal-close"
                >
                  <FiX />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-group">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    name="category_name"
                    value={formData.category_name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                    autoFocus
                  />
                </div>
                
                <div className="modal-footer">
                  <motion.button
                    type="button"
                    onClick={closeModal}
                    className="cancel-button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="confirm-button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiCheck className="confirm-icon" />
                        {currentCategory ? 'Update' : 'Create'}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="delete-modal-content"
            >
              <div className="delete-modal-header">
                <div className="delete-icon-container">
                  <FiTrash2 className="delete-icon" />
                </div>
                <div>
                  <h3 className="delete-title">Delete Category</h3>
                  <p className="delete-message">Are you sure you want to delete this category? This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="delete-modal-footer">
                <motion.button
                  onClick={() => setDeleteModalOpen(false)}
                  className="cancel-button delete-cancel-button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleDelete}
                  disabled={loading}
                  className="confirm-button delete-confirm-button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryDashboard;