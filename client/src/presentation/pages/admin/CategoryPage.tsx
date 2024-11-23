import React, { useState, useEffect } from 'react';
import api from '../../../infrastructure/api/api';
import {
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import Swal from 'sweetalert2';
import Sidebar from '../../components/admin/Sidebar';
import TopNav from '../../components/admin/TopNav';

interface SubCategory {
  name: string;
}

interface Category {
  _id?: string;
  categoryName: string;
  subCategories: SubCategory[];
  createdByAdmin: boolean;
  blocked: boolean; // Add blocked property
}

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [categoryName, setCategoryName] = useState<string>('');
  const [subCategories, setSubCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get<Category[]>('/admin/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      return Swal.fire('Validation Error', 'Category name is required!', 'error');
    }

    try {
      const payload = { categoryName, subCategories };

      const response = editingCategory
        ? await api.put(`/admin/categories/${editingCategory._id}`, payload)
        : await api.post('/admin/categories', payload);

      const updatedCategories = editingCategory
        ? categories.map((category) =>
            category._id === editingCategory._id ? response.data : category
          )
        : [...categories, response.data];

      setCategories(updatedCategories);

      Swal.fire('Success', 'Category saved successfully!', 'success');
      setModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
      Swal.fire('Error', 'Failed to save category. Please try again.', 'error');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.categoryName);
    setSubCategories(category.subCategories.map((sub) => sub.name));
    setModalOpen(true);
  };

  const handleToggleBlockCategory = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: 'Block/Unblock Category?',
        text: 'Are you sure you want to block/unblock this category?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Proceed!',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        const response = await api.patch(`/admin/categories/block/${id}`);
        setCategories(categories.map((category) =>
          category._id === id ? { ...category, blocked: !category.blocked } : category
        ));
        Swal.fire('Success', response.data.message, 'success');
      }
    } catch (error) {
      console.error('Error blocking/unblocking category:', error);
      Swal.fire('Error', 'Failed to block/unblock category. Please try again.', 'error');
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setCategoryName('');
    setSubCategories([]);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
      </aside>

      <main className="flex-1 p-6">
        <TopNav />
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Category Management</h1>

        <Button variant="contained" color="primary" onClick={() => setModalOpen(true)}>
          {editingCategory ? 'Edit Category' : 'Add Category'}
        </Button>

        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth>
          <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Subcategories (comma-separated)"
              value={subCategories.join(', ')}
              onChange={(e) =>
                setSubCategories(e.target.value.split(',').map((sub) => sub.trim()))
              }
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveCategory} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {loading ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : categories.length > 0 ? (
          <table className="w-full border-collapse mt-4">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Category</th>
                <th className="p-3">Subcategories</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="border-t">
                  <td className="p-3">{category.categoryName}</td>
                  <td className="p-3">
                    {category.subCategories.map((sub) => sub.name).join(', ')}
                  </td>
                  <td className="p-3 space-x-2">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditCategory(category)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color={category.blocked ? 'success' : 'warning'}
                      onClick={() => handleToggleBlockCategory(category._id!)}
                    >
                      {category.blocked ? 'Unblock' : 'Block'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No categories available.</p>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
