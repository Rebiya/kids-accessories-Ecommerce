import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FiSearch, FiEye, FiDollarSign, FiCalendar, FiUser, 
  FiPackage, FiChevronDown, FiChevronUp, FiX, FiRefreshCw 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './orderDashboard.module.css';

const API_BASE_URL = 'http://localhost:3000/api';

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // Status colors and options
  const statusColors = {
    pending: styles.statusPending,
    delivered: styles.statusDelivered,
    cancelled: styles.statusCancelled
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Fetch all orders, users, and products
  const fetchOrdersAndRelatedData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const ordersResponse = await axios.get(`${API_BASE_URL}/order`);
      const ordersData = ordersResponse.data || [];
      
      // Get unique user IDs from orders
      const userIds = [...new Set(ordersData.map(order => order.user_id))];
      
      // Get unique product IDs from orders
      const productIds = [...new Set(ordersData.map(order => order.product_id))];
      
      // Fetch user data for all unique user IDs
      const usersResponse = await Promise.all(
        userIds.map(userId => 
          axios.get(`${API_BASE_URL}/users/${userId}`)
            .then(res => {
              console.log("User response:", res.data); // Debug log
              return res.data.user; // Access nested user object
            })
            .catch(error => {
              console.error(`Failed to fetch user ${userId}:`, error);
              return null;
            })
        )
      );
      
      // Fetch product data for all unique product IDs
      const productsResponse = await Promise.all(
        productIds.map(productId => 
          axios.get(`${API_BASE_URL}/product/${productId}`)
            .then(res => res.data.data) // Access nested data object
            .catch(error => {
              console.error(`Failed to fetch product ${productId}:`, error);
              return null;
            })
        )
      );
      
      // Create users map
      const usersMap = {};
      usersResponse.forEach(user => {
        if (user) {
          usersMap[user.ID.toLowerCase()] = user;  // normalize to lowercase
        }
      });
      
      // Create products map
      const productsMap = {};
      productsResponse.forEach(product => {
        if (product) {
          productsMap[product.ID] = product;
        }
      });
      
      setOrders(ordersData);
      setUsers(usersMap);
      setProducts(productsMap);
    } catch (error) {
      toast.error('Failed to fetch data: ' + error.message);
      setOrders([]);
      setUsers({});
      setProducts({});
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      const response = await axios.put(`${API_BASE_URL}/order/${orderId}/status`, {
        status: newStatus
      });
      
      if (response.data) {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success(`Order status updated to ${newStatus}`);
      }
    } catch (error) {
      toast.error(`Failed to update status: ${error.response?.data?.error || error.message}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  useEffect(() => {
    fetchOrdersAndRelatedData();
  }, []);

  // Filter orders based on search term
  const filteredOrders = orders.filter(order => {
    const orderId = order?.id?.toString().toLowerCase() || '';
    const user = users[order.user_id] || {};
    const userEmail = user?.email?.toLowerCase() || '';
    const userName = `${user?.first_name || ''} ${user?.last_name || ''}`.toLowerCase();
    const status = order?.status?.toLowerCase() || '';
    const product = products[order.product_id] || {};
    const productTitle = product?.title?.toLowerCase() || '';
    const searchTermLower = searchTerm.toLowerCase();

    return (
      orderId.includes(searchTermLower) ||
      userEmail.includes(searchTermLower) ||
      userName.includes(searchTermLower) ||
      status.includes(searchTermLower) ||
      productTitle.includes(searchTermLower)
    );
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return 'Invalid date';
    }
  };

  // Get user by ID
  const getUserById = (userId) => {
    if (!userId) {
      return {
        ID: userId,
        email: 'Unknown user',
        phone_number: 'N/A',
        first_name: 'Unknown',
        last_name: 'User'
      };
    }
    const user = users[userId.toLowerCase()];
    if (user) {
      return {
        ID: user.ID,
        email: user.email,
        phone_number: user.phone_number,
        first_name: user.first_name,
        last_name: user.last_name
      };
    }
    return {
      ID: userId,
      email: 'Unknown user',
      phone_number: 'N/A',
      first_name: 'Unknown',
      last_name: 'User'
    };
  };

  // Get product by ID
  const getProductById = (productId) => {
    const product = products[productId];
    return product ? {
      ID: product.ID,
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.image
    } : {
      ID: productId,
      title: 'Unknown product',
      price: 'N/A'
    };
  };

  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className={styles.dashboard}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Order Management</h1>
            <p className={styles.subtitle}>View and manage customer orders</p>
          </div>
          
          <div className={styles.controls}>
            <div className={styles.searchContainer}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search orders..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchOrdersAndRelatedData}
              className={styles.refreshButton}
            >
              <FiRefreshCw className={styles.refreshIcon} />
              Refresh
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className={styles.ordersTable}>
          {loading && !orders.length ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className={styles.emptyMessage}>
              {searchTerm ? 'No orders match your search' : 'No orders found'}
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead className={styles.tableHead}>
                  <tr>
                    <th className={styles.tableHeader}>Order ID</th>
                    <th className={styles.tableHeader}>Customer</th>
                    <th className={styles.tableHeader}>Product</th>
                    <th className={styles.tableHeader}>Date</th>
                    <th className={styles.tableHeader}>Status</th>
                    <th className={styles.tableHeader}>Amount</th>
                    <th className={styles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody className={styles.tableBody}>
                  {filteredOrders.map((order) => {
                    const user = getUserById(order.user_id);
                    const product = getProductById(order.product_id);
                    
                    return (
                      <React.Fragment key={order.id || Math.random().toString(36).substr(2, 9)}>
                        <motion.tr 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className={styles.tableRow}
                          onClick={() => toggleOrderDetails(order.id)}
                        >
                          <td className={styles.tableCell}>
                            <div className={styles.orderId}>
                              {order.id ? `#${order.id.toString().slice(-6)}` : 'N/A'}
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.customerCell}>
                              <div className={styles.avatar}>
                                <FiUser className={styles.avatarIcon} />
                              </div>
                              <div className={styles.customerInfo}>
                                <div className={styles.customerName}>
                                  {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Guest'}
                                </div>
                                <div className={styles.customerEmail}>
                                  {user.email || 'No email'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.productName}>
                              {product.title || 'Unknown product'}
                            </div>
                            <div className={styles.productPrice}>
                              ${product.price || 'N/A'}
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.orderDate}>
                              {formatDate(order.created_at)}
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <select
                              value={order.status || 'pending'}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              disabled={updatingStatus === order.id}
                              className={`${styles.statusSelect} ${statusColors[order.status] || ''} ${
                                updatingStatus === order.id ? styles.disabled : ''
                              }`}
                            >
                              {statusOptions.map(option => (
                                <option 
                                  key={option.value} 
                                  value={option.value}
                                >
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            {updatingStatus === order.id && (
                              <span className={styles.updatingText}>Updating...</span>
                            )}
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.amount}>
                              <FiDollarSign className={styles.amountIcon} />
                              {order.amount || '0.00'}
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.actions}>
                              <motion.button
                                className={styles.viewButton}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrder({...order, userDetails: user, productDetails: product});
                                }}
                              >
                                <FiEye />
                              </motion.button>
                              {expandedOrder === order.id ? (
                                <FiChevronUp className={styles.chevron} />
                              ) : (
                                <FiChevronDown className={styles.chevron} />
                              )}
                            </div>
                          </td>
                        </motion.tr>

                        {/* Expanded Order Details */}
                        <AnimatePresence>
                          {expandedOrder === order.id && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className={styles.expandedRow}
                            >
                              <td colSpan="7" className={styles.expandedContent}>
                                <div className={styles.detailsGrid}>
                                  <div className={styles.detailCard}>
                                    <h3 className={styles.detailTitle}>
                                      <FiUser className={styles.detailIcon} />
                                      Customer Details
                                    </h3>
                                    <div className={styles.detailList}>
                                      <p className={styles.detailItem}><span className={styles.detailLabel}>Name:</span> {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Guest'}</p>
                                      <p className={styles.detailItem}><span className={styles.detailLabel}>Email:</span> {user.email || 'No email'}</p>
                                      <p className={styles.detailItem}><span className={styles.detailLabel}>Phone:</span> {user.phone_number || 'No phone'}</p>
                                    </div>
                                  </div>

                                  <div className={styles.detailCard}>
                                    <h3 className={styles.detailTitle}>
                                      <FiPackage className={styles.detailIcon} />
                                      Order Details
                                    </h3>
                                    <div className={styles.detailList}>
                                      <p className={styles.detailItem}><span className={styles.detailLabel}>Order ID:</span> {order.id}</p>
                                      <p className={styles.detailItem}><span className={styles.detailLabel}>Date:</span> {formatDate(order.created_at)}</p>
                                      <p className={styles.detailItem}><span className={styles.detailLabel}>Status:</span> 
                                        <span className={`${styles.statusBadge} ${statusColors[order.status] || ''}`}>
                                          {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                                        </span>
                                      </p>
                                      <p className={styles.detailItem}><span className={styles.detailLabel}>Payment ID:</span> {order.stripe_payment_id || 'N/A'}</p>
                                    </div>
                                  </div>

                                  <div className={styles.detailCard}>
                                    <h3 className={styles.detailTitle}>
                                      <FiDollarSign className={styles.detailIcon} />
                                      Product & Payment
                                    </h3>
                                    <div className={styles.detailList}>
                                      <p className={styles.detailItem}><span className={styles.detailLabel}>Product:</span> {product.title || 'Unknown'}</p>
                                      {product.image && (
                                        <img 
                                          src={product.image} 
                                          alt={product.title} 
                                          className={styles.productImage}
                                        />
                                      )}
                                      <p className={styles.detailItem}><span className={styles.detailLabel}>Price:</span> ${product.price || 'N/A'}</p>
                                      <p className={styles.detailItem}><span className={styles.detailLabel}>Amount Paid:</span> ${order.amount || '0.00'}</p>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
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
                  Order Details (#{selectedOrder.id ? selectedOrder.id.toString().slice(-6) : 'N/A'})
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className={styles.closeButton}
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <div className={styles.modalBody}>
                <div className={styles.modalGrid}>
                  <div className={styles.modalCard}>
                    <h4 className={styles.detailTitle}>
                      <FiUser className={styles.detailIcon} />
                      Customer Information
                    </h4>
                    <div className={styles.detailList}>
                      <p className={styles.detailItem}><span className={styles.detailLabel}>Name:</span> {`${selectedOrder.userDetails?.first_name || ''} ${selectedOrder.userDetails?.last_name || ''}`.trim() || 'Guest'}</p>
                      <p className={styles.detailItem}><span className={styles.detailLabel}>Email:</span> {selectedOrder.userDetails?.email || 'No email'}</p>
                      <p className={styles.detailItem}><span className={styles.detailLabel}>Phone:</span> {selectedOrder.userDetails?.phone_number || 'N/A'}</p>
                    </div>
                  </div>

                  <div className={styles.modalCard}>
                    <h4 className={styles.detailTitle}>
                      <FiPackage className={styles.detailIcon} />
                      Order Information
                    </h4>
                    <div className={styles.detailList}>
                      <p className={styles.detailItem}><span className={styles.detailLabel}>Order ID:</span> {selectedOrder.id}</p>
                      <p className={styles.detailItem}><span className={styles.detailLabel}>Date:</span> {formatDate(selectedOrder.created_at)}</p>
                      <p className={styles.detailItem}><span className={styles.detailLabel}>Status:</span> 
                        <select
                          value={selectedOrder.status || 'pending'}
                          onChange={(e) => {
                            updateOrderStatus(selectedOrder.id, e.target.value);
                            setSelectedOrder(prev => ({...prev, status: e.target.value}));
                          }}
                          disabled={updatingStatus === selectedOrder.id}
                          className={`${styles.statusSelect} ${statusColors[selectedOrder.status] || ''} ${
                            updatingStatus === selectedOrder.id ? styles.disabled : ''
                          }`}
                        >
                          {statusOptions.map(option => (
                            <option 
                              key={option.value} 
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </p>
                    </div>
                  </div>

                  <div className={styles.modalCard}>
                    <h4 className={styles.detailTitle}>
                      <FiDollarSign className={styles.detailIcon} />
                      Product & Payment
                    </h4>
                    <div className={styles.detailList}>
                      <p className={styles.detailItem}><span className={styles.detailLabel}>Product:</span> {selectedOrder.productDetails?.title || 'Unknown'}</p>
                      {selectedOrder.productDetails?.image && (
                        <img 
                          src={selectedOrder.productDetails.image} 
                          alt={selectedOrder.productDetails.title} 
                          className={styles.productImage}
                        />
                      )}
                      <p className={styles.detailItem}><span className={styles.detailLabel}>Price:</span> ${selectedOrder.productDetails?.price || 'N/A'}</p>
                      <p className={styles.detailItem}><span className={styles.detailLabel}>Amount Paid:</span> ${selectedOrder.amount || '0.00'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderDashboard;