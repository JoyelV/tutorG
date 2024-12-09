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
  Pagination,
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
  status: boolean;
}

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Adjust items per page as needed

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

    const invalidCategoryChars = /[*\d]/;
    if (invalidCategoryChars.test(categoryName)) {
      return Swal.fire(
        'Validation Error',
        'Category name contains invalid characters!',
        'error'
      );
    }

    if (subCategories.length === 0) {
      return Swal.fire('Validation Error', 'At least one subcategory is required!', 'error');
    }

    const invalidSubcategoryChars = /[*\d]/;
    const uniqueSubCategories = new Set(subCategories);

    for (const sub of uniqueSubCategories) {
      if (!sub.trim()) {
        return Swal.fire('Validation Error', 'Subcategory name cannot be empty!', 'error');
      }
      if (invalidSubcategoryChars.test(sub)) {
        return Swal.fire(
          'Validation Error',
          `Subcategory "${sub}" contains invalid characters!`,
          'error'
        );
      }
      if (sub.length < 3) {
        return Swal.fire(
          'Validation Error',
          `Subcategory "${sub}" must be at least 3 characters long!`,
          'error'
        );
      }
    }

    try {
      const payload = { categoryName, subCategories: Array.from(uniqueSubCategories) };
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

  const resetForm = () => {
    setEditingCategory(null);
    setCategoryName('');
    setSubCategories([]);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page on new search
  };

  const filteredCategories = categories.filter((category) =>
    category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        const updatedCategory = response.data;

        setCategories(categories.map((category) =>
          category._id === id ? { ...category, status: !category.status } : category
        ));

        Swal.fire('Success', updatedCategory.message, 'success');
      }
    } catch (error) {
      console.error('Error blocking/unblocking category:', error);
      Swal.fire('Error', 'Failed to block/unblock category. Please try again.', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Sidebar />
      </aside>

      <main className="flex-1 p-6">
        <TopNav />
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Category Management</h1>

        <TextField
          label="Search Categories"
          value={searchQuery}
          onChange={handleSearch}
          fullWidth
          margin="normal"
          variant="outlined"
        />

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
        ) : paginatedCategories.length > 0 ? (
          <>
            <table className="w-full border-collapse mt-4">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-3">Category</th>
                  <th className="p-3">Subcategories</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.map((category) => (
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
                      <button
                        onClick={() => handleToggleBlockCategory(category._id!)}
                        className={`px-4 py-2 rounded ${category.status ? 'bg-green-500' : 'bg-red-500'
                          } text-white`}
                      >
                        {category.status ? 'Unblock' : 'Blocked'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
              />
            </div>

          </>
        ) : (
          <p>No categories available.</p>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
