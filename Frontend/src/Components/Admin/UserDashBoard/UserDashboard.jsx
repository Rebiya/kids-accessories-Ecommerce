import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiX, FiUser, FiLock, FiMail, FiPhone } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './UserDashboard.module.css';

const API_BASE_URL = 'http://localhost:3000/api';

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [roles, setRoles] = useState([
    { id: 1, name: 'User' },
    { id: 2, name: 'Moderator' },
    { id: 3, name: 'Admin' }
  ]);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    role_id: 1,
    password: ''
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/users`);
      setUsers(response.data.users || response.data);
    } catch (error) {
      toast.error('Failed to fetch users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (user = null) => {
    setCurrentUser(user);
    setFormData({
      first_name: user ? user.first_name : '',
      last_name: user ? user.last_name : '',
      email: user ? user.email : '',
      phone_number: user ? user.phone_number : '',
      role_id: user ? user.role_id : 1,
      password: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      role_id: 1,
      password: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let response;

      if (currentUser) {
        response = await axios.put(
          `${API_BASE_URL}/users/${currentUser.uuid}`,
          formData
        );
        toast.success('User updated successfully');
      } else {
        response = await axios.post(
          `${API_BASE_URL}/users`,
          formData
        );
        toast.success('User created successfully');
      }

      if (response.status === 200 || response.status === 201) {
        fetchUsers();
        closeModal();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/users/${userToDelete}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user: ' + error.message);
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone_number && user.phone_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown';
  };

  const getRoleClass = (roleId) => {
    switch (roleId) {
      case 1: return styles.roleUser;
      case 2: return styles.roleModerator;
      case 3: return styles.roleAdmin;
      default: return styles.roleDefault;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className={styles.dashboardContent}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>User Management</h1>
            <p className={styles.subtitle}>Manage system users and permissions</p>
          </div>
          
          <div className={styles.headerControls}>
            <div className={styles.searchContainer}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search users..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <motion.button
              onClick={() => openModal()}
              className={styles.addButton}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiPlus className={styles.buttonIcon} />
              Add User
            </motion.button>
          </div>
        </div>

        <div className={styles.tableContainer}>
          {loading && !users.length ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className={styles.emptyState}>
              {searchTerm ? 'No users match your search' : 'No users found'}
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.usersTable}>
                <thead className={styles.tableHeader}>
                  <tr>
                    <th className={styles.tableHeaderCell}>User</th>
                    <th className={styles.tableHeaderCell}>Contact</th>
                    <th className={styles.tableHeaderCell}>Role</th>
                    <th className={styles.tableHeaderCellActions}>Actions</th>
                  </tr>
                </thead>
                <tbody className={styles.tableBody}>
                  {filteredUsers.map((user) => (
                    <motion.tr 
                      key={user.uuid}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={styles.tableRow}
                    >
                      <td className={styles.tableCell}>
                        <div className={styles.userCell}>
                          <div className={styles.userAvatar}>
                            <FiUser className={styles.userIcon} />
                          </div>
                          <div className={styles.userInfo}>
                            <div className={styles.userName}>
                              {user.first_name} {user.last_name}
                            </div>
                            <div className={styles.userEmail}>
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.contactEmail}>
                          {user.email}
                        </div>
                        <div className={styles.contactPhone}>
                          {user.phone_number || 'N/A'}
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <span className={`${styles.roleBadge} ${getRoleClass(user.role_id)}`}>
                          {getRoleName(user.role_id)}
                        </span>
                      </td>
                      <td className={styles.tableCellActions}>
                        <div className={styles.actionsContainer}>
                          <motion.button
                            onClick={() => openModal(user)}
                            className={styles.editButton}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiEdit />
                          </motion.button>
                          <motion.button
                            onClick={() => confirmDelete(user.uuid)}
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
      </div>

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
                <h3 className={styles.modalTitle}>
                  {currentUser ? 'Edit User' : 'Add New User'}
                </h3>
                <button
                  onClick={closeModal}
                  className={styles.modalCloseButton}
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className={styles.modalForm}>
                <div className={styles.formGrid}>
                  <div>
                    <label className={styles.formLabel}>First Name</label>
                    <div className={styles.inputContainer}>
                      <div className={styles.inputIcon}>
                        <FiUser className={styles.icon} />
                      </div>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className={styles.formLabel}>Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={styles.formLabel}>Email</label>
                  <div className={styles.inputContainer}>
                    <div className={styles.inputIcon}>
                      <FiMail className={styles.icon} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={styles.formLabel}>Phone Number</label>
                  <div className={styles.inputContainer}>
                    <div className={styles.inputIcon}>
                      <FiPhone className={styles.icon} />
                    </div>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div>
                  <label className={styles.formLabel}>Role</label>
                  <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleInputChange}
                    className={styles.formSelect}
                  >
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>

                {!currentUser && (
                  <div>
                    <label className={styles.formLabel}>Password</label>
                    <div className={styles.inputContainer}>
                      <div className={styles.inputIcon}>
                        <FiLock className={styles.icon} />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className={styles.formFooter}>
                  <motion.button
                    type="button"
                    onClick={closeModal}
                    className={styles.cancelButton}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className={styles.submitButton}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <svg className={styles.buttonSpinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        {currentUser ? 'Update User' : 'Create User'}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteModalOpen && (
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
              className={styles.deleteModal}
            >
              <div className={styles.deleteModalContent}>
                <div className={styles.deleteModalHeader}>
                  <div className={styles.deleteIconContainer}>
                    <FiTrash2 className={styles.deleteIcon} />
                  </div>
                  <div>
                    <h3 className={styles.deleteModalTitle}>Delete User</h3>
                    <p className={styles.deleteModalText}>Are you sure you want to delete this user? This action cannot be undone.</p>
                  </div>
                </div>
                
                <div className={styles.deleteModalFooter}>
                  <motion.button
                    onClick={() => setDeleteModalOpen(false)}
                    className={styles.deleteCancelButton}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleDelete}
                    disabled={loading}
                    className={styles.deleteConfirmButton}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;