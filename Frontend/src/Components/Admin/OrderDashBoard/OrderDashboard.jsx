import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FiSearch, FiEye, FiDollarSign, FiCalendar, FiUser, 
  FiPackage, FiChevronDown, FiChevronUp, FiX, FiRefreshCw 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

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
    pending: 'bg-yellow-100 text-yellow-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
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
    // Create users map using user_id format (lowercase)
// After fetching usersResponse
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
    const user = users[order.user_id]
    || {};
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
            <button
              onClick={fetchOrdersAndRelatedData}
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              <FiRefreshCw className="mr-2" />
              Refresh
            </button>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const user = getUserById(order.user_id);
                    const product = getProductById(order.product_id);
                    
                    return (
                      <React.Fragment key={order.id || Math.random().toString(36).substr(2, 9)}>
                        <motion.tr 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleOrderDetails(order.id)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {order.id ? `#${order.id.toString().slice(-6)}` : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <FiUser className="h-5 w-5 text-indigo-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Guest'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email || 'No email'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {product.title || 'Unknown product'}
                            </div>
                            <div className="text-sm text-gray-500">
                              ${product.price || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(order.created_at)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.status || 'pending'}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              disabled={updatingStatus === order.id}
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                statusColors[order.status] || 'bg-gray-100 text-gray-800'
                              } ${updatingStatus === order.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              {statusOptions.map(option => (
                                <option 
                                  key={option.value} 
                                  value={option.value}
                                  className="bg-white text-gray-800"
                                >
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            {updatingStatus === order.id && (
                              <span className="ml-2 text-xs text-gray-500">Updating...</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              <FiDollarSign className="mr-1" />
                              {order.amount || '0.00'}
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
                                  setSelectedOrder({...order, userDetails: user, productDetails: product});
                                }}
                              >
                                <FiEye />
                              </motion.button>
                              {expandedOrder === order.id ? (
                                <FiChevronUp className="text-gray-400" />
                              ) : (
                                <FiChevronDown className="text-gray-400" />
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
                              className="bg-gray-50"
                            >
                              <td colSpan="7" className="px-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                      <FiUser className="mr-2" />
                                      Customer Details
                                    </h3>
                                    <div className="space-y-1 text-sm text-gray-600">
                                      <p><span className="font-medium">Name:</span> {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Guest'}</p>
                                      <p><span className="font-medium">Email:</span> {user.email || 'No email'}</p>
                                      <p><span className="font-medium">Phone:</span> {user.phone_number || 'No phone'}</p>
                                    </div>
                                  </div>

                                  <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                      <FiPackage className="mr-2" />
                                      Order Details
                                    </h3>
                                    <div className="space-y-1 text-sm text-gray-600">
                                      <p><span className="font-medium">Order ID:</span> {order.id}</p>
                                      <p><span className="font-medium">Date:</span> {formatDate(order.created_at)}</p>
                                      <p><span className="font-medium">Status:</span> 
                                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                                          statusColors[order.status] || 'bg-gray-100 text-gray-800'
                                        }`}>
                                          {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                                        </span>
                                      </p>
                                      <p><span className="font-medium">Payment ID:</span> {order.stripe_payment_id || 'N/A'}</p>
                                    </div>
                                  </div>

                                  <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                                      <FiDollarSign className="mr-2" />
                                      Product & Payment
                                    </h3>
                                    <div className="space-y-1 text-sm text-gray-600">
                                      <p><span className="font-medium">Product:</span> {product.title || 'Unknown'}</p>
                                      {product.image && (
                                        <img 
                                          src={product.image} 
                                          alt={product.title} 
                                          className="w-16 h-16 object-cover rounded mt-1"
                                        />
                                      )}
                                      <p><span className="font-medium">Price:</span> ${product.price || 'N/A'}</p>
                                      <p><span className="font-medium">Amount Paid:</span> ${order.amount || '0.00'}</p>
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
                  Order Details (#{selectedOrder.id ? selectedOrder.id.toString().slice(-6) : 'N/A'})
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
                      <p><span className="font-medium">Name:</span> {`${selectedOrder.userDetails?.first_name || ''} ${selectedOrder.userDetails?.last_name || ''}`.trim() || 'Guest'}</p>
                      <p><span className="font-medium">Email:</span> {selectedOrder.userDetails?.email || 'No email'}</p>
                      <p><span className="font-medium">Phone:</span> {selectedOrder.userDetails?.phone_number || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <FiPackage className="mr-2" />
                      Order Information
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Order ID:</span> {selectedOrder.id}</p>
                      <p><span className="font-medium">Date:</span> {formatDate(selectedOrder.created_at)}</p>
                      <p><span className="font-medium">Status:</span> 
                        <select
                          value={selectedOrder.status || 'pending'}
                          onChange={(e) => {
                            updateOrderStatus(selectedOrder.id, e.target.value);
                            setSelectedOrder(prev => ({...prev, status: e.target.value}));
                          }}
                          disabled={updatingStatus === selectedOrder.id}
                          className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            statusColors[selectedOrder.status] || 'bg-gray-100 text-gray-800'
                          } ${updatingStatus === selectedOrder.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {statusOptions.map(option => (
                            <option 
                              key={option.value} 
                              value={option.value}
                              className="bg-white text-gray-800"
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <FiDollarSign className="mr-2" />
                      Product & Payment
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Product:</span> {selectedOrder.productDetails?.title || 'Unknown'}</p>
                      {selectedOrder.productDetails?.image && (
                        <img 
                          src={selectedOrder.productDetails.image} 
                          alt={selectedOrder.productDetails.title} 
                          className="w-16 h-16 object-cover rounded mt-1"
                        />
                      )}
                      <p><span className="font-medium">Price:</span> ${selectedOrder.productDetails?.price || 'N/A'}</p>
                      <p><span className="font-medium">Amount Paid:</span> ${selectedOrder.amount || '0.00'}</p>
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