import axios from 'axios';
import { toast } from 'react-toastify';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Configure axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product Service
export const ProductService = {
  // Get all products
  async getAllProducts() {
    try {
      const response = await api.get('/product');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      toast.info(response.data.message || 'No products found');
      return [];
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
      return [];
    }
  },

  // Get single product by ID
  async getProductById(id) {
    try {
      const response = await api.get(`/product/${id}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      toast.warning(response.data.message || 'Product not found');
      return null;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      toast.error('Failed to fetch product');
      return null;
    }
  },

  // Create new product
  async createProduct(productData) {
    try {
      const response = await api.post('/product', productData);
      if (response.data.success && response.data.data) {
        toast.success(response.data.message || 'Product created successfully');
        return response.data.data;
      }
      toast.warning(response.data.message || 'Failed to create product');
      return null;
    } catch (error) {
      console.error('Error creating product:', error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || 'Failed to create product');
      } else {
        toast.error('Failed to create product');
      }
      return null;
    }
  },

  // Update existing product
  async updateProduct(id, productData) {
    try {
      const response = await api.put(`/product/${id}`, productData);
      if (response.data.success && response.data.data) {
        toast.success(response.data.message || 'Product updated successfully');
        return response.data.data;
      }
      toast.warning(response.data.message || 'Failed to update product');
      return null;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || 'Failed to update product');
      } else {
        toast.error('Failed to update product');
      }
      return null;
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      const response = await api.delete(`/product/${id}`);
      if (response.data.success) {
        toast.success(response.data.message || 'Product deleted successfully');
        return true;
      }
      toast.warning(response.data.message || 'Failed to delete product');
      return false;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || 'Failed to delete product');
      } else {
        toast.error('Failed to delete product');
      }
      return false;
    }
},

// Get products by category
async getProductsByCategory(categoryName) {
  try {
    const response = await api.get(`/products/category/${categoryName}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    toast.info(response.data.message || 'No products in this category');
    return [];
  } catch (error) {
    console.error(`Error fetching products for ${categoryName}:`, error);
    toast.error('Failed to fetch category products');
    return [];
  }
},
  // Search products
  async searchProducts(query) {
    try {
      const response = await api.get(`/products/search?q=${query}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      toast.info(response.data.message || 'No matching products found');
      return [];
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('Failed to search products');
      return [];
    }
  }
};
