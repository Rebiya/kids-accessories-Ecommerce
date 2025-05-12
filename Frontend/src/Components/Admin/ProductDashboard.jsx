// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { FiEdit, FiTrash2, FiPlus, FiSearch, FiX, FiUpload, FiLogOut, FiUsers, FiTag, FiShoppingBag, FiStar, FiDollarSign } from 'react-icons/fi';
// import { FaSpinner, FaCloudUploadAlt, FaChartLine, FaBoxOpen } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Tab } from '@headlessui/react';

// // Cloudinary configuration
//  const CLOUDINARY_UPLOAD_PRESET = 'products';
//  const CLOUDINARY_CLOUD_NAME = 'dvpyg28pe'
// const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// // API base URLs
// const PRODUCT_API_URL = 'http://localhost:3000/api/product';
// const CATEGORY_API_URL = 'http://localhost:3000/api/category';
// const USER_API_URL = 'http://localhost:3000/api/users';

// const WelcomePage = ({ onEnterDashboard }) => {
//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6"
//     >
//       <motion.div
//         initial={{ y: -50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.2 }}
//         className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8 max-w-2xl w-full"
//       >
//         <div className="flex justify-center mb-6">
//           <div className="bg-yellow-500 text-gray-900 rounded-full p-4">
//             <FaBoxOpen className="text-3xl" />
//           </div>
//         </div>
//         <h1 className="text-3xl font-bold text-center text-yellow-400 mb-4">Welcome to Admin Dashboard</h1>
//         <p className="text-lg text-gray-300 text-center mb-8">
//           Manage your products, categories, and users all in one place. Get started by exploring the dashboard.
//         </p>
//         <div className="flex justify-center">
//           <motion.button
//             onClick={onEnterDashboard}
//             className="flex items-center px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-medium rounded-lg transition-colors"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <FaChartLine className="mr-2" />
//             Enter Dashboard
//           </motion.button>
//         </div>
//       </motion.div>
//       <motion.div
//         initial={{ y: 50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.4 }}
//         className="mt-8 text-gray-400 text-center"
//       >
//         <p>You're logged in as Administrator</p>
//       </motion.div>
//     </motion.div>
//   );
// };

// const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm, itemName }) => {
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//         >
//           <motion.div 
//             initial={{ scale: 0.9, y: 20 }}
//             animate={{ scale: 1, y: 0 }}
//             exit={{ scale: 0.9, y: 20 }}
//             className="bg-gray-800 text-white p-6 rounded-xl shadow-lg max-w-md w-full border border-yellow-500"
//           >
//             <h3 className="text-lg font-semibold mb-2 text-yellow-400">Confirm Deletion</h3>
//             <p className="text-gray-300 mb-6">Are you sure you want to delete {itemName}? This action cannot be undone.</p>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={onCancel}
//                 className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={onConfirm}
//                 className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
//               >
//                 Delete
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// const ProductDashboard = () => {
//   const [activeTab, setActiveTab] = useState('products');
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentItem, setCurrentItem] = useState(null);
//   const [imageUploading, setImageUploading] = useState(false);
//   const [isWelcomePage, setIsWelcomePage] = useState(true);
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
//   const [dragging, setDragging] = useState(false);
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState(null);
//   const [itemTypeToDelete, setItemTypeToDelete] = useState('');

//   // Form data states
//   const [productFormData, setProductFormData] = useState({
//     title: '',
//     description: '',
//     image: '',
//     price: '',
//     category_name: '',
//     rating_rate: '',
//     rating_count: ''
//   });

//   const [categoryFormData, setCategoryFormData] = useState({
//     category_name: ''
//   });

//   const [userFormData, setUserFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     phone_number: '',
//     role_id: 1,
//     password: ''
//   });

//   // Fetch data functions
//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(PRODUCT_API_URL);
//       if (response.data.success) {
//         setProducts(response.data.data);
//       } else {
//         toast.error(response.data.message || 'Failed to fetch products');
//       }
//     } catch (error) {
//       toast.error('Error fetching products: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(CATEGORY_API_URL);
//       setCategories(response.data);
//     } catch (error) {
//       toast.error('Error fetching categories: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(USER_API_URL);
//       setUsers(response.data.users);
//     } catch (error) {
//       toast.error('Error fetching users: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!isWelcomePage) {
//       fetchDataBasedOnTab();
//     }
//   }, [activeTab, isWelcomePage]);

//   const fetchDataBasedOnTab = () => {
//     switch (activeTab) {
//       case 'products':
//         fetchProducts();
//         break;
//       case 'categories':
//         fetchCategories();
//         break;
//       case 'users':
//         fetchUsers();
//         break;
//       default:
//         fetchProducts();
//     }
//   };

//   // Image upload handling
//   const handleImageUpload = async (file) => {
//     if (!file) return;

//     setImageUploading(true);
    
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

//     try {
//       const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       setProductFormData(prev => ({
//         ...prev,
//         image: response.data.secure_url
//       }));
//       toast.success('Image uploaded successfully!');
//     } catch (error) {
//       toast.error('Failed to upload image: ' + error.message);
//     } finally {
//       setImageUploading(false);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       handleImageUpload(file);
//     }
//   };

//   // Drag and drop handlers
//   const handleDragEnter = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragging(false);
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragging(false);
    
//     const file = e.dataTransfer.files[0];
//     if (file && file.type.match('image.*')) {
//       handleImageUpload(file);
//     } else {
//       toast.error('Please upload an image file');
//     }
//   };

//   // Modal and form handlers
//   const openModal = (item = null, type) => {
//     setCurrentItem(item);
    
//     if (type === 'product') {
//       setProductFormData(item ? {
//         title: item.title,
//         description: item.description,
//         image: item.image,
//         price: item.price,
//         category_name: item.category_name,
//         rating_rate: item.rating_rate,
//         rating_count: item.rating_count
//       } : {
//         title: '',
//         description: '',
//         image: '',
//         price: '',
//         category_name: '',
//         rating_rate: '',
//         rating_count: ''
//       });
//     } else if (type === 'category') {
//       setCategoryFormData(item ? {
//         category_name: item.category_name
//       } : {
//         category_name: ''
//       });
//     } else if (type === 'user') {
//       setUserFormData(item ? {
//         first_name: item.first_name,
//         last_name: item.last_name,
//         email: item.email,
//         phone_number: item.phone_number,
//         role_id: item.role_id,
//         password: ''
//       } : {
//         first_name: '',
//         last_name: '',
//         email: '',
//         phone_number: '',
//         role_id: 1,
//         password: ''
//       });
//     }
    
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleInputChange = (e, formType) => {
//     const { name, value } = e.target;
    
//     if (formType === 'product') {
//       setProductFormData({
//         ...productFormData,
//         [name]: value
//       });
//     } else if (formType === 'category') {
//       setCategoryFormData({
//         ...categoryFormData,
//         [name]: value
//       });
//     } else if (formType === 'user') {
//       setUserFormData({
//         ...userFormData,
//         [name]: value
//       });
//     }
//   };

//   const handleSubmit = async (e, type) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       let response;
      
//       if (type === 'product') {
//         if (currentItem) {
//           response = await axios.put(
//             `${PRODUCT_API_URL}/${currentItem.ID}`,
//             productFormData
//           );
//         } else {
//           response = await axios.post(PRODUCT_API_URL, productFormData);
//         }
//       } else if (type === 'category') {
//         if (currentItem) {
//           response = await axios.put(
//             `${CATEGORY_API_URL}/${currentItem.ID}`,
//             categoryFormData
//           );
//         } else {
//           response = await axios.post(CATEGORY_API_URL, categoryFormData);
//         }
//       } else if (type === 'user') {
//         if (currentItem) {
//           response = await axios.put(
//             `${USER_API_URL}/${currentItem.ID}`,
//             userFormData
//           );
//         } else {
//           response = await axios.post(USER_API_URL, userFormData);
//         }
//       }

//       if (response.status === 200 || response.status === 201) {
//         toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} ${currentItem ? 'updated' : 'created'} successfully`);
//         fetchDataBasedOnTab();
//         closeModal();
//       } else {
//         toast.error(response.data.message || `Failed to ${currentItem ? 'update' : 'create'} ${type}`);
//       }
//     } catch (error) {
//       toast.error('Error: ' + error.response?.data?.message || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmDelete = (id, type) => {
//     setItemToDelete(id);
//     setItemTypeToDelete(type);
//     setDeleteModalOpen(true);
//   };

//   const handleDelete = async () => {
//     try {
//       setLoading(true);
//       let response;
//       let apiUrl;
      
//       switch (itemTypeToDelete) {
//         case 'product':
//           apiUrl = PRODUCT_API_URL;
//           break;
//         case 'category':
//           apiUrl = CATEGORY_API_URL;
//           break;
//         case 'user':
//           apiUrl = USER_API_URL;
//           break;
//         default:
//           apiUrl = PRODUCT_API_URL;
//       }

//       response = await axios.delete(`${apiUrl}/${itemToDelete}`);

//       if (response.data.success || response.status === 200) {
//         toast.success(`${itemTypeToDelete.charAt(0).toUpperCase() + itemTypeToDelete.slice(1)} deleted successfully`);
//         fetchDataBasedOnTab();
//       } else {
//         toast.error(response.data.message || `Failed to delete ${itemTypeToDelete}`);
//       }
//     } catch (error) {
//       toast.error('Error: ' + error.message);
//     } finally {
//       setLoading(false);
//       setDeleteModalOpen(false);
//     }
//   };

//   // Filter data based on search term
//   const filteredProducts = products.filter((product) =>
//     product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.category_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredCategories = categories.filter((category) =>
//     category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredUsers = users.filter((user) =>
//     user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const enterDashboard = () => {
//     setIsWelcomePage(false);
//   };

//   if (isWelcomePage) {
//     return <WelcomePage onEnterDashboard={enterDashboard} />;
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-900 text-gray-100">
//       <ToastContainer position="top-right" autoClose={3000} />
      
//       {/* Sidebar */}
//       <motion.div 
//         initial={{ x: -300 }}
//         animate={{ x: 0 }}
//         transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//         className={`bg-gray-800 border-r border-gray-700 h-full fixed ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
//       >
//         <div className="p-4 flex items-center justify-between border-b border-gray-700">
//           {!isSidebarCollapsed && (
//             <h2 className="text-xl font-bold text-yellow-400">Admin Panel</h2>
//           )}
//           <button 
//             onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
//             className="text-gray-400 hover:text-white"
//           >
//             {isSidebarCollapsed ? (
//               <FiPlus className="transform rotate-45 text-xl" />
//             ) : (
//               <FiX className="text-xl" />
//             )}
//           </button>
//         </div>
        
//         <nav className="p-4">
//           <ul className="space-y-2">
//             <li>
//               <button
//                 onClick={() => setActiveTab('products')}
//                 className={`w-full flex items-center p-3 rounded-lg transition-colors ${
//                   activeTab === 'products'
//                     ? 'bg-yellow-500 text-gray-900 font-bold'
//                     : 'bg-gray-700 hover:bg-gray-600 text-white'
//                 }`}
//               >
//                 <FiShoppingBag className="text-lg" />
//                 {!isSidebarCollapsed && <span className="ml-3">Products</span>}
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => setActiveTab('categories')}
//                 className={`w-full flex items-center p-3 rounded-lg transition-colors ${
//                   activeTab === 'categories'
//                     ? 'bg-yellow-500 text-gray-900 font-bold'
//                     : 'bg-gray-700 hover:bg-gray-600 text-white'
//                 }`}
//               >
//                 <FiTag className="text-lg" />
//                 {!isSidebarCollapsed && <span className="ml-3">Categories</span>}
//               </button>
//             </li>
//             <li>
//               <button
//                 onClick={() => setActiveTab('users')}
//                 className={`w-full flex items-center p-3 rounded-lg transition-colors ${
//                   activeTab === 'users'
//                     ? 'bg-yellow-500 text-gray-900 font-bold'
//                     : 'bg-gray-700 hover:bg-gray-600 text-white'
//                 }`}
//               >
//                 <FiUsers className="text-lg" />
//                 {!isSidebarCollapsed && <span className="ml-3">Users</span>}
//               </button>
//             </li>
//           </ul>
//         </nav>
        
//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
//           <button className="w-full flex items-center p-3 text-gray-300 hover:text-white rounded-lg transition-colors">
//             <FiLogOut />
//             {!isSidebarCollapsed && <span className="ml-3">Logout</span>}
//           </button>
//         </div>
//       </motion.div>

//       {/* Main Content */}
//       <div className={`flex-1 ml-${isSidebarCollapsed ? '20' : '64'}`}>
//         <div className="p-6">
//           {/* Header */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//             <div>
//               <h1 className="text-2xl font-bold text-yellow-400 mb-1">
//                 {activeTab === 'products' && 'Product Management'}
//                 {activeTab === 'categories' && 'Category Management'}
//                 {activeTab === 'users' && 'User Management'}
//               </h1>
//               <p className="text-gray-400">
//                 {activeTab === 'products' && 'Manage your products inventory'}
//                 {activeTab === 'categories' && 'Manage product categories'}
//                 {activeTab === 'users' && 'Manage system users'}
//               </p>
//             </div>
            
//             <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
//               <div className="relative flex-1 md:w-64">
//                 <FiSearch className="absolute left-3 top-3 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder={
//                     activeTab === 'products' ? 'Search products...' :
//                     activeTab === 'categories' ? 'Search categories...' :
//                     'Search users...'
//                   }
//                   className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm('')}
//                     className="absolute right-3 top-3 text-gray-400 hover:text-white"
//                   >
//                     <FiX />
//                   </button>
//                 )}
//               </div>
              
//               <motion.button
//                 onClick={() => openModal(null, activeTab)}
//                 className="flex items-center justify-center px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <FiPlus className="mr-2" />
//                 {activeTab === 'products' && 'Add Product'}
//                 {activeTab === 'categories' && 'Add Category'}
//                 {activeTab === 'users' && 'Add User'}
//               </motion.button>
//             </div>
//           </div>

//           {/* Products Tab */}
//           {activeTab === 'products' && (
//             <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
//               {loading && !products.length ? (
//                 <div className="flex justify-center items-center p-12">
//                   <FaSpinner className="animate-spin text-yellow-500 text-2xl" />
//                 </div>
//               ) : filteredProducts.length === 0 ? (
//                 <div className="p-8 text-center text-gray-400">
//                   {searchTerm ? 'No products match your search' : 'No products found'}
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-700">
//                     <thead className="bg-gray-700">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Product</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Category</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Price</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Rating</th>
//                         <th className="px-6 py-3 text-right text-xs font-medium text-yellow-400 uppercase tracking-wider">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-gray-800 divide-y divide-gray-700">
//                       {filteredProducts.map((product) => (
//                         <motion.tr 
//                           key={product.ID} 
//                           className="hover:bg-gray-700 transition-colors"
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ duration: 0.3 }}
//                         >
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <div className="flex-shrink-0 h-10 w-10">
//                                 <img
//                                   className="h-10 w-10 rounded object-cover"
//                                   src={product.image || 'https://via.placeholder.com/40'}
//                                   alt={product.title}
//                                 />
//                               </div>
//                               <div className="ml-4">
//                                 <div className="text-sm font-medium text-white">{product.title}</div>
//                                 <div className="text-sm text-gray-300 line-clamp-1">{product.description}</div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="text-sm text-white">{product.category_name}</div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <FiDollarSign className="text-yellow-500 mr-1" />
//                               <span className="text-sm font-medium text-white">
//                                 {parseFloat(product.price).toFixed(2)}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <FiStar className="text-yellow-500 mr-1" />
//                               <span className="text-sm font-medium text-white mr-1">
//                                 {product.rating_rate}
//                               </span>
//                               <span className="text-xs text-gray-400">
//                                 ({product.rating_count} reviews)
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                             <div className="flex justify-end space-x-3">
//                               <motion.button
//                                 onClick={() => openModal(product, 'product')}
//                                 className="text-blue-400 hover:text-blue-300"
//                                 whileHover={{ scale: 1.1 }}
//                                 whileTap={{ scale: 0.9 }}
//                               >
//                                 <FiEdit />
//                               </motion.button>
//                               <motion.button
//                                 onClick={() => confirmDelete(product.ID, 'product')}
//                                 className="text-red-400 hover:text-red-300"
//                                 whileHover={{ scale: 1.1 }}
//                                 whileTap={{ scale: 0.9 }}
//                               >
//                                 <FiTrash2 />
//                               </motion.button>
//                             </div>
//                           </td>
//                         </motion.tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Categories Tab */}
//           {activeTab === 'categories' && (
//             <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
//               {loading && !categories.length ? (
//                 <div className="flex justify-center items-center p-12">
//                   <FaSpinner className="animate-spin text-yellow-500 text-2xl" />
//                 </div>
//               ) : filteredCategories.length === 0 ? (
//                 <div className="p-8 text-center text-gray-400">
//                   {searchTerm ? 'No categories match your search' : 'No categories found'}
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-700">
//                     <thead className="bg-gray-700">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Category Name</th>
//                         <th className="px-6 py-3 text-right text-xs font-medium text-yellow-400 uppercase tracking-wider">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-gray-800 divide-y divide-gray-700">
//                       {filteredCategories.map((category) => (
//                         <motion.tr 
//                           key={category.ID} 
//                           className="hover:bg-gray-700 transition-colors"
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ duration: 0.3 }}
//                         >
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="text-sm font-medium text-white">{category.category_name}</div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                             <div className="flex justify-end space-x-3">
//                               <motion.button
//                                 onClick={() => openModal(category, 'category')}
//                                 className="text-blue-400 hover:text-blue-300"
//                                 whileHover={{ scale: 1.1 }}
//                                 whileTap={{ scale: 0.9 }}
//                               >
//                                 <FiEdit />
//                               </motion.button>
//                               <motion.button
//                                 onClick={() => confirmDelete(category.ID, 'category')}
//                                 className="text-red-400 hover:text-red-300"
//                                 whileHover={{ scale: 1.1 }}
//                                 whileTap={{ scale: 0.9 }}
//                               >
//                                 <FiTrash2 />
//                               </motion.button>
//                             </div>
//                           </td>
//                         </motion.tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Users Tab */}
//           {activeTab === 'users' && (
//             <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
//               {loading && !users.length ? (
//                 <div className="flex justify-center items-center p-12">
//                   <FaSpinner className="animate-spin text-yellow-500 text-2xl" />
//                 </div>
//               ) : filteredUsers.length === 0 ? (
//                 <div className="p-8 text-center text-gray-400">
//                   {searchTerm ? 'No users match your search' : 'No users found'}
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-700">
//                     <thead className="bg-gray-700">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">User</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Email</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Phone</th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Role</th>
//                         <th className="px-6 py-3 text-right text-xs font-medium text-yellow-400 uppercase tracking-wider">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-gray-800 divide-y divide-gray-700">
//                       {filteredUsers.map((user) => (
//                         <motion.tr 
//                           key={user.ID} 
//                           className="hover:bg-gray-700 transition-colors"
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ duration: 0.3 }}
//                         >
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-900 flex items-center justify-center">
//                                 <span className="text-white font-medium">
//                                   {user.first_name.charAt(0)}{user.last_name.charAt(0)}
//                                 </span>
//                               </div>
//                               <div className="ml-4">
//                                 <div className="text-sm font-medium text-white">
//                                   {user.first_name} {user.last_name}
//                                 </div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="text-sm text-gray-300">{user.email}</div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="text-sm text-gray-300">{user.phone_number || 'N/A'}</div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`px-2 py-1 rounded-full text-xs ${
//                               user.role_id === 1 ? 'bg-green-600' :
//                               user.role_id === 2 ? 'bg-blue-600' :
//                               'bg-purple-600'
//                             }`}>
//                               {user.role_id === 1 ? 'User' : user.role_id === 2 ? 'Moderator' : 'Admin'}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                             <div className="flex justify-end space-x-3">
//                               <motion.button
//                                 onClick={() => openModal(user, 'user')}
//                                 className="text-blue-400 hover:text-blue-300"
//                                 whileHover={{ scale: 1.1 }}
//                                 whileTap={{ scale: 0.9 }}
//                               >
//                                 <FiEdit />
//                               </motion.button>
//                               <motion.button
//                                 onClick={() => confirmDelete(user.ID, 'user')}
//                                 className="text-red-400 hover:text-red-300"
//                                 whileHover={{ scale: 1.1 }}
//                                 whileTap={{ scale: 0.9 }}
//                               >
//                                 <FiTrash2 />
//                               </motion.button>
//                             </div>
//                           </td>
//                         </motion.tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Add/Edit Modal */}
//       <AnimatePresence>
//         {isModalOpen && (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
//           >
//             <motion.div 
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto"
//             >
//               <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-lg font-semibold text-yellow-400">
//                     {currentItem ? 'Edit ' : 'Add New '}
//                     {activeTab === 'products' && 'Product'}
//                     {activeTab === 'categories' && 'Category'}
//                     {activeTab === 'users' && 'User'}
//                   </h3>
//                   <button
//                     onClick={closeModal}
//                     className="text-gray-400 hover:text-white"
//                   >
//                     <FiX size={24} />
//                   </button>
//                 </div>
//               </div>
              
//               {/* Product Form */}
//               {activeTab === 'products' && (
//                 <form onSubmit={(e) => handleSubmit(e, 'product')} className="p-6">
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
//                       <input
//                         type="text"
//                         name="title"
//                         value={productFormData.title}
//                         onChange={(e) => handleInputChange(e, 'product')}
//                         className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
//                         required
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
//                       <textarea
//                         name="description"
//                         value={productFormData.description}
//                         onChange={(e) => handleInputChange(e, 'product')}
//                         rows={3}
//                         className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-1">Product Image</label>
//                       <div 
//                         className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
//                           dragging ? 'border-yellow-500 bg-gray-700' : 'border-gray-600 hover:border-yellow-500'
//                         }`}
//                         onDragEnter={handleDragEnter}
//                         onDragLeave={handleDragLeave}
//                         onDragOver={handleDragOver}
//                         onDrop={handleDrop}
//                         onClick={() => document.getElementById('fileInput').click()}
//                       >
//                         {productFormData.image ? (
//                           <div className="relative">
//                             <img 
//                               src={productFormData.image} 
//                               alt="Preview" 
//                               className="w-full h-40 object-contain rounded mb-2"
//                             />
//                             <button
//                               type="button"
//                               className="absolute top-2 right-2 bg-gray-800 p-1 rounded-full hover:bg-gray-700"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setProductFormData({ ...productFormData, image: '' });
//                               }}
//                             >
//                               <FiX className="text-red-500" />
//                             </button>
//                           </div>
//                         ) : (
//                           <>
//                             <FaCloudUploadAlt className="mx-auto text-4xl text-yellow-500 mb-2" />
//                             <p className="text-gray-300 mb-1">
//                               {dragging ? 'Drop image here' : 'Drag & drop image or click to browse'}
//                             </p>
//                             <p className="text-xs text-gray-400">
//                               Supports JPG, PNG up to 5MB
//                             </p>
//                           </>
//                         )}
//                         <input
//                           id="fileInput"
//                           type="file"
//                           accept="image/*"
//                           className="hidden"
//                           onChange={handleFileChange}
//                         />
//                       </div>
//                       {imageUploading && (
//                         <div className="flex items-center mt-2 text-gray-400">
//                           <FaSpinner className="animate-spin mr-2" />
//                           Uploading image...
//                         </div>
//                       )}
//                     </div>
                    
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
//                         <div className="relative">
//                           <span className="absolute left-3 top-2 text-gray-400">$</span>
//                           <input
//                             type="number"
//                             step="0.01"
//                             name="price"
//                             value={productFormData.price}
//                             onChange={(e) => handleInputChange(e, 'product')}
//                             className="w-full pl-8 p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
//                             required
//                           />
//                         </div>
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
//                         <input
//                           type="text"
//                           name="category_name"
//                           value={productFormData.category_name}
//                           onChange={(e) => handleInputChange(e, 'product')}
//                           className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
//                           required
//                         />
//                       </div>
//                     </div>
                    
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-300 mb-1">Rating</label>
//                         <div className="relative">
//                           <span className="absolute left-3 top-2 text-gray-400">
//                             <FiStar className="text-yellow-500" />
//                           </span>
//                           <input
//                             type="number"
//                             step="0.1"
//                             min="0"
//                             max="5"
//                             name="rating_rate"
//                             value={productFormData.rating_rate}
//                             onChange={(e) => handleInputChange(e, 'product')}
//                             className="w-full pl-8 p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
//                           />
//                         </div>
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-300 mb-1">Rating Count</label>
//                         <input
//                           type="number"
//                           name="rating_count"
//                           value={productFormData.rating_count}
//                           onChange={(e) => handleInputChange(e, 'product')}
//                           className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
//                         />
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-700">
//                     <motion.button
//                       type="button"
//                       onClick={closeModal}
//                       className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       Cancel
//                     </motion.button>
//                     <motion.button
//                       type="submit"
//                       disabled={loading || imageUploading}
//                       className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded transition-colors flex items-center"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       {loading && <FaSpinner className="animate-spin mr-2" />}
//                       {currentItem ? 'Update Product' : 'Add Product'}
//                     </motion.button>
//                   </div>
//                 </form>
//               )}

//               {/* Category Form */}
//               {activeTab === 'categories' && (
//                 <form onSubmit={(e) => handleSubmit(e, 'category')} className="p-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-1">Category Name</label>
//                     <input
//                       type="text"
//                       name="category_name"
//                       value={categoryFormData.category_name}
//                       onChange={(e) => handleInputChange(e, 'category')}
//                       className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
//                       required
//                     />
//                   </div>
                  
//                   <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-700">
//                     <motion.button
//                       type="button"
//                       onClick={closeModal}
//                       className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       Cancel
//                     </motion.button>
//                     <motion.button
//                       type="submit"
//                       disabled={loading}
//                       className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded transition-colors flex items-center"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       {loading && <FaSpinner className="animate-spin mr-2" />}
//                       {currentItem ? 'Update Category' : 'Add Category'}
//                     </motion.button>
//                   </div>
//                 </form>
//               )}

//               {/* User Form */}
//               {activeTab === 'users' && (
//                 <form onSubmit={(e) => handleSubmit(e, 'user')} className="p-6">
//                   <div className="grid grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
//                       <input
//                         type="text"
//                         name="first_name"
//                         value={userFormData.first_name}
//                         onChange={(e) => handleInputChange(e, 'user')}
//                         className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
//                         required
//                       />
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
//                       <input
//                         type="text"
//                         name="last_name"
//                         value={userFormData.last_name}
//                         onChange={(e) => handleInputChange(e, 'user')}
//                         className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
//                         required
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={userFormData.email}
//                       onChange={(e) => handleInputChange(e, 'user')}
//                       className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
//                       required
//                     />
//                   </div>
                  
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
//                     <input
//                       type="tel"
//                       name="phone_number"
//                       value={userFormData.phone_number}
//                       onChange={(e) => handleInputChange(e, 'user')}
//                       className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
//                     />
//                   </div>
                  
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
//                     <select
//                       name="role_id"
//                       value={userFormData.role_id}
//                       onChange={(e) => handleInputChange(e, 'user')}
//                       className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
//                     >
//                       <option value="1">User</option>
//                       <option value="2">Moderator</option>
//                       <option value="3">Admin</option>
//                     </select>
//                   </div>
                  
//                   {!currentItem && (
//                     <div className="mb-4">
//                       <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
//                       <input
//                         type="password"
//                         name="password"
//                         value={userFormData.password}
//                         onChange={(e) => handleInputChange(e, 'user')}
//                         className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
//                         required={!currentItem}
//                       />
//                     </div>
//                   )}
                  
//                   <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-700">
//                     <motion.button
//                       type="button"
//                       onClick={closeModal}
//                       className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       Cancel
//                     </motion.button>
//                     <motion.button
//                       type="submit"
//                       disabled={loading}
//                       className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded transition-colors flex items-center"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       {loading && <FaSpinner className="animate-spin mr-2" />}
//                       {currentItem ? 'Update User' : 'Add User'}
//                     </motion.button>
//                   </div>
//                 </form>
//               )}
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmationModal
//         isOpen={deleteModalOpen}
//         onCancel={() => setDeleteModalOpen(false)}
//         onConfirm={handleDelete}
//         itemName={
//           itemTypeToDelete === 'product' ? 'this product' :
//           itemTypeToDelete === 'category' ? 'this category' :
//           'this user'
//         }
//       />
//     </div>
//   );
// };

// export default ProductDashboard;


import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiX, FiUpload, FiLogOut, FiUsers, FiTag, FiShoppingBag, FiStar, FiDollarSign } from 'react-icons/fi';
import { FaSpinner, FaCloudUploadAlt, FaChartLine, FaBoxOpen } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab } from '@headlessui/react';

// Cloudinary configuration
const CLOUDINARY_UPLOAD_PRESET = 'products';
const CLOUDINARY_CLOUD_NAME = 'dvpyg28pe'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// API base URLs
const PRODUCT_API_URL = 'http://localhost:3000/api/product';
const CATEGORY_API_URL = 'http://localhost:3000/api/category';
const USER_API_URL = 'http://localhost:3000/api/users';

// ... (Keep all the existing components like WelcomePage, DeleteConfirmationModal, etc.)
const WelcomePage = ({ onEnterDashboard }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8 max-w-2xl w-full"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-500 text-gray-900 rounded-full p-4">
            <FaBoxOpen className="text-3xl" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-yellow-400 mb-4">Welcome to Admin Dashboard</h1>
        <p className="text-lg text-gray-300 text-center mb-8">
          Manage your products, categories, and users all in one place. Get started by exploring the dashboard.
        </p>
        <div className="flex justify-center">
          <motion.button
            onClick={onEnterDashboard}
            className="flex items-center px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-medium rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaChartLine className="mr-2" />
            Enter Dashboard
          </motion.button>
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-gray-400 text-center"
      >
        <p>You're logged in as Administrator</p>
      </motion.div>
    </motion.div>
  );
};

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
            className="bg-gray-800 text-white p-6 rounded-xl shadow-lg max-w-md w-full border border-yellow-500"
          >
            <h3 className="text-lg font-semibold mb-2 text-yellow-400">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete {itemName}? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
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
  // ... (Keep all the existing state declarations)

  const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [isWelcomePage, setIsWelcomePage] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemTypeToDelete, setItemTypeToDelete] = useState('');
  
    // Form data states
    const [productFormData, setProductFormData] = useState({
      title: '',
      description: '',
      image: '',
      price: '',
      category_name: '',
      rating_rate: '',
      rating_count: ''
    });
  
    const [categoryFormData, setCategoryFormData] = useState({
      category_name: ''
    });
  
    const [userFormData, setUserFormData] = useState({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      role_id: 1,
      password: ''
    });
  
    // Fetch data functions
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
        setLoading(true);
        const response = await axios.get(CATEGORY_API_URL);
        setCategories(response.data);
      } catch (error) {
        toast.error('Error fetching categories: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(USER_API_URL);
        setUsers(response.data.users);
      } catch (error) {
        toast.error('Error fetching users: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
  
  // Fetch categories when component mounts
  useEffect(() => {
    if (!isWelcomePage) {
      fetchDataBasedOnTab();
    }
  }, [activeTab, isWelcomePage]);

  // ... (Keep all the existing functions until the product form in the modal)
  const fetchDataBasedOnTab = () => {
    switch (activeTab) {
      case 'products':
        fetchProducts();
        break;
      case 'categories':
        fetchCategories();
        break;
      case 'users':
        fetchUsers();
        break;
      default:
        fetchProducts();
    }
  };

  // Image upload handling
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

  // Drag and drop handlers
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

  // Modal and form handlers
  const openModal = (item = null, type) => {
    setCurrentItem(item);
    
    if (type === 'product') {
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
    } else if (type === 'category') {
      setCategoryFormData(item ? {
        category_name: item.category_name
      } : {
        category_name: ''
      });
    } else if (type === 'user') {
      setUserFormData(item ? {
        first_name: item.first_name,
        last_name: item.last_name,
        email: item.email,
        phone_number: item.phone_number,
        role_id: item.role_id,
        password: ''
      } : {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        role_id: 1,
        password: ''
      });
    }
    
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    
    if (formType === 'product') {
      setProductFormData({
        ...productFormData,
        [name]: value
      });
    } else if (formType === 'category') {
      setCategoryFormData({
        ...categoryFormData,
        [name]: value
      });
    } else if (formType === 'user') {
      setUserFormData({
        ...userFormData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    try {
      setLoading(true);
      let response;
      
      if (type === 'product') {
        if (currentItem) {
          response = await axios.put(
            `${PRODUCT_API_URL}/${currentItem.ID}`,
            productFormData
          );
        } else {
          response = await axios.post(PRODUCT_API_URL, productFormData);
        }
      } else if (type === 'category') {
        if (currentItem) {
          response = await axios.put(
            `${CATEGORY_API_URL}/${currentItem.ID}`,
            categoryFormData
          );
        } else {
          response = await axios.post(CATEGORY_API_URL, categoryFormData);
        }
      } else if (type === 'user') {
        if (currentItem) {
          response = await axios.put(
            `${USER_API_URL}/${currentItem.ID}`,
            userFormData
          );
        } else {
          response = await axios.post(USER_API_URL, userFormData);
        }
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} ${currentItem ? 'updated' : 'created'} successfully`);
        fetchDataBasedOnTab();
        closeModal();
      } else {
        toast.error(response.data.message || `Failed to ${currentItem ? 'update' : 'create'} ${type}`);
      }
    } catch (error) {
      toast.error('Error: ' + error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id, type) => {
    setItemToDelete(id);
    setItemTypeToDelete(type);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      let response;
      let apiUrl;
      
      switch (itemTypeToDelete) {
        case 'product':
          apiUrl = PRODUCT_API_URL;
          break;
        case 'category':
          apiUrl = CATEGORY_API_URL;
          break;
        case 'user':
          apiUrl = USER_API_URL;
          break;
        default:
          apiUrl = PRODUCT_API_URL;
      }

      response = await axios.delete(`${apiUrl}/${itemToDelete}`);

      if (response.data.success || response.status === 200) {
        toast.success(`${itemTypeToDelete.charAt(0).toUpperCase() + itemTypeToDelete.slice(1)} deleted successfully`);
        fetchDataBasedOnTab();
      } else {
        toast.error(response.data.message || `Failed to delete ${itemTypeToDelete}`);
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    } finally {
      setLoading(false);
      setDeleteModalOpen(false);
    }
  };

  // Filter data based on search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategories = categories.filter((category) =>
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter((user) =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enterDashboard = () => {
    setIsWelcomePage(false);
  };

  if (isWelcomePage) {
    return <WelcomePage onEnterDashboard={enterDashboard} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`bg-gray-800 border-r border-gray-700 h-full fixed ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {!isSidebarCollapsed && (
            <h2 className="text-xl font-bold text-yellow-400">Admin Panel</h2>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-gray-400 hover:text-white"
          >
            {isSidebarCollapsed ? (
              <FiPlus className="transform rotate-45 text-xl" />
            ) : (
              <FiX className="text-xl" />
            )}
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === 'products'
                    ? 'bg-yellow-500 text-gray-900 font-bold'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                <FiShoppingBag className="text-lg" />
                {!isSidebarCollapsed && <span className="ml-3">Products</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === 'categories'
                    ? 'bg-yellow-500 text-gray-900 font-bold'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                <FiTag className="text-lg" />
                {!isSidebarCollapsed && <span className="ml-3">Categories</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === 'users'
                    ? 'bg-yellow-500 text-gray-900 font-bold'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                <FiUsers className="text-lg" />
                {!isSidebarCollapsed && <span className="ml-3">Users</span>}
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <button className="w-full flex items-center p-3 text-gray-300 hover:text-white rounded-lg transition-colors">
            <FiLogOut />
            {!isSidebarCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`flex-1 ml-${isSidebarCollapsed ? '20' : '64'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-yellow-400 mb-1">
                {activeTab === 'products' && 'Product Management'}
                {activeTab === 'categories' && 'Category Management'}
                {activeTab === 'users' && 'User Management'}
              </h1>
              <p className="text-gray-400">
                {activeTab === 'products' && 'Manage your products inventory'}
                {activeTab === 'categories' && 'Manage product categories'}
                {activeTab === 'users' && 'Manage system users'}
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder={
                    activeTab === 'products' ? 'Search products...' :
                    activeTab === 'categories' ? 'Search categories...' :
                    'Search users...'
                  }
                  className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    <FiX />
                  </button>
                )}
              </div>
              
              <motion.button
                onClick={() => openModal(null, activeTab)}
                className="flex items-center justify-center px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPlus className="mr-2" />
                {activeTab === 'products' && 'Add Product'}
                {activeTab === 'categories' && 'Add Category'}
                {activeTab === 'users' && 'Add User'}
              </motion.button>
            </div>
          </div>

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              {loading && !products.length ? (
                <div className="flex justify-center items-center p-12">
                  <FaSpinner className="animate-spin text-yellow-500 text-2xl" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  {searchTerm ? 'No products match your search' : 'No products found'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Rating</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-yellow-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {filteredProducts.map((product) => (
                        <motion.tr 
                          key={product.ID} 
                          className="hover:bg-gray-700 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded object-cover"
                                  src={product.image || 'https://via.placeholder.com/40'}
                                  alt={product.title}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">{product.title}</div>
                                <div className="text-sm text-gray-300 line-clamp-1">{product.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">{product.category_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FiDollarSign className="text-yellow-500 mr-1" />
                              <span className="text-sm font-medium text-white">
                                {parseFloat(product.price).toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FiStar className="text-yellow-500 mr-1" />
                              <span className="text-sm font-medium text-white mr-1">
                                {product.rating_rate}
                              </span>
                              <span className="text-xs text-gray-400">
                                ({product.rating_count} reviews)
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <motion.button
                                onClick={() => openModal(product, 'product')}
                                className="text-blue-400 hover:text-blue-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiEdit />
                              </motion.button>
                              <motion.button
                                onClick={() => confirmDelete(product.ID, 'product')}
                                className="text-red-400 hover:text-red-300"
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
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              {loading && !categories.length ? (
                <div className="flex justify-center items-center p-12">
                  <FaSpinner className="animate-spin text-yellow-500 text-2xl" />
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  {searchTerm ? 'No categories match your search' : 'No categories found'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Category Name</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-yellow-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {filteredCategories.map((category) => (
                        <motion.tr 
                          key={category.ID} 
                          className="hover:bg-gray-700 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">{category.category_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <motion.button
                                onClick={() => openModal(category, 'category')}
                                className="text-blue-400 hover:text-blue-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiEdit />
                              </motion.button>
                              <motion.button
                                onClick={() => confirmDelete(category.ID, 'category')}
                                className="text-red-400 hover:text-red-300"
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
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              {loading && !users.length ? (
                <div className="flex justify-center items-center p-12">
                  <FaSpinner className="animate-spin text-yellow-500 text-2xl" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  {searchTerm ? 'No users match your search' : 'No users found'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-yellow-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {filteredUsers.map((user) => (
                        <motion.tr 
                          key={user.ID} 
                          className="hover:bg-gray-700 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-900 flex items-center justify-center">
                                <span className="text-white font-medium">
                                  {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">
                                  {user.first_name} {user.last_name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">{user.phone_number || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.role_id === 1 ? 'bg-green-600' :
                              user.role_id === 2 ? 'bg-blue-600' :
                              'bg-purple-600'
                            }`}>
                              {user.role_id === 1 ? 'User' : user.role_id === 2 ? 'Moderator' : 'Admin'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <motion.button
                                onClick={() => openModal(user, 'user')}
                                className="text-blue-400 hover:text-blue-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiEdit />
                              </motion.button>
                              <motion.button
                                onClick={() => confirmDelete(user.ID, 'user')}
                                className="text-red-400 hover:text-red-300"
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
          )}
        </div>
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
              className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-yellow-400">
                    {currentItem ? 'Edit ' : 'Add New '}
                    {activeTab === 'products' && 'Product'}
                    {activeTab === 'categories' && 'Category'}
                    {activeTab === 'users' && 'User'}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-white"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>
  {/* Product Form */}
  {activeTab === 'products' && (
    <form onSubmit={(e) => handleSubmit(e, 'product')} className="p-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={productFormData.title}
            onChange={(e) => handleInputChange(e, 'product')}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea
            name="description"
            value={productFormData.description}
            onChange={(e) => handleInputChange(e, 'product')}
            rows={3}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Product Image</label>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragging ? 'border-yellow-500 bg-gray-700' : 'border-gray-600 hover:border-yellow-500'
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
                  className="absolute top-2 right-2 bg-gray-800 p-1 rounded-full hover:bg-gray-700"
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
                <FaCloudUploadAlt className="mx-auto text-4xl text-yellow-500 mb-2" />
                <p className="text-gray-300 mb-1">
                  {dragging ? 'Drop image here' : 'Drag & drop image or click to browse'}
                </p>
                <p className="text-xs text-gray-400">
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
            <div className="flex items-center mt-2 text-gray-400">
              <FaSpinner className="animate-spin mr-2" />
              Uploading image...
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">$</span>
              <input
                type="number"
                step="0.01"
                name="price"
                value={productFormData.price}
                onChange={(e) => handleInputChange(e, 'product')}
                className="w-full pl-8 p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            <select
              name="category_name"
              value={productFormData.category_name}
              onChange={(e) => handleInputChange(e, 'product')}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
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
            <label className="block text-sm font-medium text-gray-300 mb-1">Rating</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">
                <FiStar className="text-yellow-500" />
              </span>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="rating_rate"
                value={productFormData.rating_rate}
                onChange={(e) => handleInputChange(e, 'product')}
                className="w-full pl-8 p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Rating Count</label>
            <input
              type="number"
              name="rating_count"
              value={productFormData.rating_count}
              onChange={(e) => handleInputChange(e, 'product')}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-700">
        <motion.button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          disabled={loading || imageUploading}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded transition-colors flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading && <FaSpinner className="animate-spin mr-2" />}
          {currentItem ? 'Update Product' : 'Add Product'}
        </motion.button>
      </div>
    </form>
  )}

  // ... (Keep all the remaining code the same)
  //  {/* Category Form */}
           {activeTab === 'categories' && (
                <form onSubmit={(e) => handleSubmit(e, 'category')} className="p-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Category Name</label>
                    <input
                      type="text"
                      name="category_name"
                      value={categoryFormData.category_name}
                      onChange={(e) => handleInputChange(e, 'category')}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-700">
                    <motion.button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded transition-colors flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {loading && <FaSpinner className="animate-spin mr-2" />}
                      {currentItem ? 'Update Category' : 'Add Category'}
                    </motion.button>
                  </div>
                </form>
              )}

               {/* User Form */}
              {activeTab === 'users' && (
                <form onSubmit={(e) => handleSubmit(e, 'user')} className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={userFormData.first_name}
                        onChange={(e) => handleInputChange(e, 'user')}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={userFormData.last_name}
                        onChange={(e) => handleInputChange(e, 'user')}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={userFormData.email}
                      onChange={(e) => handleInputChange(e, 'user')}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={userFormData.phone_number}
                      onChange={(e) => handleInputChange(e, 'user')}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                    <select
                      name="role_id"
                      value={userFormData.role_id}
                      onChange={(e) => handleInputChange(e, 'user')}
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                    >
                      <option value="1">User</option>
                      <option value="2">Moderator</option>
                      <option value="3">Admin</option>
                    </select>
                  </div>
                  
                  {!currentItem && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={userFormData.password}
                        onChange={(e) => handleInputChange(e, 'user')}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                        required={!currentItem}
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-700">
                    <motion.button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded transition-colors flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {loading && <FaSpinner className="animate-spin mr-2" />}
                      {currentItem ? 'Update User' : 'Add User'}
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName={
          itemTypeToDelete === 'product' ? 'this product' :
          itemTypeToDelete === 'category' ? 'this category' :
          'this user'
        }
      />
    </div>
  );
};

export default ProductDashboard;