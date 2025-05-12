import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  const queryClient = useQueryClient();

  // Mock data functions - replace with real API calls
  const fetchProducts = async () => {
    // In a real app, this would be an API call
    return [
      { id: '1', name: 'Product 1', description: 'Description 1', price: 19.99, stock: 100, category: { id: '1', name: 'Category 1' } },
      { id: '2', name: 'Product 2', description: 'Description 2', price: 29.99, stock: 50, category: { id: '2', name: 'Category 2' } }
    ];
  };

  const fetchCategories = async () => {
    return [
      { id: '1', name: 'Category 1', description: 'Category desc 1', productCount: 5 },
      { id: '2', name: 'Category 2', description: 'Category desc 2', productCount: 3 }
    ];
  };

  const fetchUsers = async () => {
    return [
      { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      { id: '2', name: 'Manager User', email: 'manager@example.com', role: 'manager' }
    ];
  };

  // Fetch data
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  // Mutations
  const productMutation = useMutation({
    mutationFn: async (product) => {
      // In a real app, this would be an API call
      console.log('Saving product:', product);
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showNotification('Product saved successfully', 'success');
      setIsModalOpen(false);
    },
    onError: () => showNotification('Failed to save product', 'error')
  });

  const categoryMutation = useMutation({
    mutationFn: async (category) => {
      console.log('Saving category:', category);
      return category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showNotification('Category saved successfully', 'success');
      setIsModalOpen(false);
    },
    onError: () => showNotification('Failed to save category', 'error')
  });

  const userMutation = useMutation({
    mutationFn: async (user) => {
      console.log('Saving user:', user);
      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showNotification('User saved successfully', 'success');
      setIsModalOpen(false);
    },
    onError: () => showNotification('Failed to save user', 'error')
  });

  const deleteItem = async (type, id) => {
    try {
      console.log(`Deleting ${type} with id:`, id);
      // In a real app, this would be an API call
      queryClient.invalidateQueries({ queryKey: [type] });
      showNotification(`${type.slice(0, -1)} deleted successfully`, 'success');
    } catch (error) {
      showNotification(`Failed to delete ${type.slice(0, -1)}`, 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (data) => {
    if (activeTab === 'products') {
      productMutation.mutate(data);
    } else if (activeTab === 'categories') {
      categoryMutation.mutate(data);
    } else if (activeTab === 'users') {
      userMutation.mutate(data);
    }
  };

  const filteredData = () => {
    const data = activeTab === 'products' 
      ? products 
      : activeTab === 'categories' 
        ? categories 
        : users;
    
    return data?.filter((item) => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];
  };

  const getColumns = () => {
    const baseColumns = [
      { header: 'Name', accessor: 'name' },
      { header: 'Description', accessor: 'description' },
      { header: 'Actions', accessor: 'actions', isAction: true }
    ];

    if (activeTab === 'products') {
      return [
        { header: 'ID', accessor: 'id' },
        ...baseColumns,
        { header: 'Price', accessor: 'price', isCurrency: true },
        { header: 'Stock', accessor: 'stock' },
        { header: 'Category', accessor: 'category.name' }
      ];
    } else if (activeTab === 'categories') {
      return [
        { header: 'ID', accessor: 'id' },
        ...baseColumns,
        { header: 'Product Count', accessor: 'productCount' }
      ];
    } else if (activeTab === 'users') {
      return [
        { header: 'ID', accessor: 'id' },
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Role', accessor: 'role' },
        { header: 'Actions', accessor: 'actions', isAction: true }
      ];
    }
    return baseColumns;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="p-4">
          {['dashboard', 'products', 'categories', 'users'].map((tab) => (
            <button
              key={tab}
              className={`w-full text-left px-4 py-2 rounded-md mb-1 ${activeTab === tab 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {notification.message}
            <button 
              onClick={() => setNotification(null)}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">
            {activeTab === 'dashboard' ? 'Admin Dashboard' : activeTab}
          </h1>
          
          {activeTab !== 'dashboard' && (
            <div className="flex items-center gap-4 w-full md:w-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Add New
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          {activeTab === 'dashboard' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stats Cards */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Products</p>
                    <p className="text-2xl font-semibold">{products?.length || 0}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    P
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Categories</p>
                    <p className="text-2xl font-semibold">{categories?.length || 0}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    C
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Users</p>
                    <p className="text-2xl font-semibold">{users?.length || 0}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                    U
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {getColumns().map((column) => (
                      <th
                        key={column.accessor}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData().map((item) => (
                    <tr key={item.id}>
                      {getColumns().map((column) => (
                        <td key={`${item.id}-${column.accessor}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {column.isAction ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteItem(activeTab, item.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          ) : column.isCurrency ? (
                            `$${item[column.accessor]}`
                          ) : column.accessor.includes('.') ? (
                            // Handle nested properties like category.name
                            column.accessor.split('.').reduce((obj, key) => obj?.[key], item)
                          ) : (
                            item[column.accessor]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {currentItem?.id ? 'Edit' : 'Create'} {activeTab.slice(0, -1)}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  &times;
                </button>
              </div>
              
              <div className="p-4">
                {activeTab === 'products' ? (
                  <ProductForm 
                    initialValues={currentItem}
                    categories={categories || []}
                    onSubmit={handleSubmit}
                    isLoading={productMutation.isLoading}
                    onCancel={() => setIsModalOpen(false)}
                  />
                ) : activeTab === 'categories' ? (
                  <CategoryForm 
                    initialValues={currentItem}
                    onSubmit={handleSubmit}
                    isLoading={categoryMutation.isLoading}
                    onCancel={() => setIsModalOpen(false)}
                  />
                ) : (
                  <UserForm 
                    initialValues={currentItem}
                    onSubmit={handleSubmit}
                    isLoading={userMutation.isLoading}
                    onCancel={() => setIsModalOpen(false)}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Form Components
const ProductForm = ({ initialValues, onSubmit, isLoading, onCancel, categories }) => {
  const [formData, setFormData] = useState(initialValues || {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          name="stock"
          type="number"
          min="0"
          value={formData.stock}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

const CategoryForm = ({ initialValues, onSubmit, isLoading, onCancel }) => {
  const [formData, setFormData] = useState(initialValues || {
    name: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Category Name</label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

const UserForm = ({ initialValues, onSubmit, isLoading, onCancel }) => {
  const [formData, setFormData] = useState(initialValues || {
    name: '',
    email: '',
    role: 'staff'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          required
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      {!initialValues?.id && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            required={!initialValues?.id}
          />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default AdminDashboard;