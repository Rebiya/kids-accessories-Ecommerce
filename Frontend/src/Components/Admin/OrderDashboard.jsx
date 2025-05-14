import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSearch, FiEye, FiDollarSign, FiCalendar, FiUser, FiPackage, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'http://localhost:3000/api';

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({}); // Store users by ID
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Status colors
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  // Fetch all orders and associated users
  const fetchOrdersAndUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const ordersResponse = await axios.get(`${API_BASE_URL}/order`);
      const ordersData = ordersResponse.data || [];
      
      // Get unique user IDs from orders
      const userIds = [...new Set(ordersData.map(order => order.user_id))];
      
      // Fetch user data for all unique user IDs
      const usersResponse = await Promise.all(
        userIds.map(userId => 
          axios.get(`${API_BASE_URL}/users/${userId}`)
            .then(res => res.data)
            .catch(error => {
              console.error(`Failed to fetch user ${userId}:`, error);
              return null;
            })
        )
      );
      
      // Create users map
      const usersMap = {};
      usersResponse.forEach(user => {
        if (user) {
          usersMap[user.ID] = user;
        }
      });
      
      setOrders(ordersData);
      setUsers(usersMap);
    } catch (error) {
      toast.error('Failed to fetch data: ' + error.message);
      setOrders([]);
      setUsers({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndUsers();
  }, []);

  // Filter orders based on search term with safety checks
  const filteredOrders = orders.filter(order => {
    const orderId = order?.ID?.toString().toLowerCase() || '';
    const user = users[order.user_id] || {};
    const userEmail = user?.email?.toLowerCase() || '';
    const status = order?.status?.toLowerCase() || '';
    const searchTermLower = searchTerm.toLowerCase();

    return (
      orderId.includes(searchTermLower) ||
      userEmail.includes(searchTermLower) ||
      status.includes(searchTermLower)
    );
  });

  // Format date with safety check
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return 'Invalid date';
    }
  };

  // Calculate total price with safety checks
  const calculateTotal = (items) => {
    if (!Array.isArray(items)) return '0.00';
    return items.reduce((sum, item) => {
      const price = parseFloat(item?.price) || 0;
      const quantity = parseInt(item?.quantity) || 0;
      return sum + (price * quantity);
    }, 0).toFixed(2);
  };

  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Get user by ID
  const getUserById = (userId) => {
    return users[userId] || {
      ID: userId,
      email: 'Unknown user',
      phone_number: 'N/A'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
            <p className="text-gray-600 mt-2">View and manage customer orders</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading && !orders.length ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'No orders match your search' : 'No orders found'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const user = getUserById(order.user_id);
                    return (
                      <React.Fragment key={order.ID || Math.random().toString(36).substr(2, 9)}>
                        <motion.tr 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleOrderDetails(order.ID)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {order.ID ? `#${order.ID.toString().slice(-6)}` : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <FiUser className="h-5 w-5 text-indigo-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.email.split('@')[0] || 'Guest'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email || 'No email'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(order.order_date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              statusColors[order.status] || 'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              <FiDollarSign className="mr-1" />
                              {calculateTotal(order.items || [])}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end items-center">
                              <motion.button
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrder({...order, userDetails: user});
                                }}
                              >
                                <FiEye />
                              </motion.button>
                              {expandedOrder === order.ID ? (
                                <FiChevronUp className="text-gray-400" />
                              ) : (
                                <FiChevronDown className="text-gray-400" />
                              )}
                            </div>
                          </td>
                        </motion.tr>

                        {/* Expanded Order Details */}
                        <AnimatePresence>
                          {expandedOrder === order.ID && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="bg-gray-50"
                            >
                              <td colSpan="6" className="px-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                      <FiUser className="mr-2" />
                                      Customer Details
                                    </h3>
                                    <div className="space-y-1 text-sm text-gray-600">
                                      <p>{user.email || 'Guest'}</p>
                                      <p>{user.phone_number || 'No phone'}</p>
                                      {order.shippingAddress && (
                                        <>
                                          <p>{order.shippingAddress.street || 'N/A'}</p>
                                          <p>{order.shippingAddress.city || 'N/A'}, {order.shippingAddress.postalCode || 'N/A'}</p>
                                          <p>{order.shippingAddress.country || 'N/A'}</p>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* ... rest of the expanded details remains the same ... */}
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
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-lg font-semibold text-gray-800">
                  Order Details (#{selectedOrder.ID ? selectedOrder.ID.toString().slice(-6) : 'N/A'})
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <FiUser className="mr-2" />
                      Customer Information
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Email:</span> {selectedOrder.userDetails?.email || 'Guest'}</p>
                      <p><span className="font-medium">Phone:</span> {selectedOrder.userDetails?.phone_number || 'N/A'}</p>
                    </div>
                  </div>

                  {/* ... rest of the modal remains similar with adjustments for the new data structure ... */}
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