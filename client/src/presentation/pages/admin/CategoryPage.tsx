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
  Box,
  Typography,
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
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/categories', {
          params: {
            page: currentPage,
            limit: itemsPerPage,
          },
        });
        const data = response.data;
        setCategories(data.categories);
        setFilteredCategories(data.categories);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage); 
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [currentPage]); 

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(
        categories.filter((category) =>
          category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, categories]);  

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      return Swal.fire('Validation Error', 'Category name is required!', 'error');
    }

    const invalidCategoryChars = /[*\d]/;
    if (invalidCategoryChars.test(categoryName)) {
      return Swal.fire('Validation Error', 'Category name contains invalid characters!', 'error');
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
    setCurrentPage(1);
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
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category._id === id
              ? { ...category, status: !category.status }  
              : category
          )
        );
  
        const response = await api.patch(`/admin/categories/block/${id}`);
  
        if (response.status === 200) {
          Swal.fire(
            response.data.status
              ? 'Category Unblocked'
              : 'Category Blocked',
            '',
            'success'
          );
        }
      }
    } catch (error) {
      console.error('Error updating category status:', error);
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === id
            ? { ...category, status: !category.status }  
            : category
        )
      );
      Swal.fire('Error', 'Failed to update category status', 'error');
    }
  };
  

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        <TopNav />
        <div className="pt-16 p-6 overflow-y-auto h-full">
          {loading ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height="100vh"
              bgcolor="#f9f9f9"
            >
              <CircularProgress color="primary" size={50} />
              <Typography variant="h6" color="textSecondary" mt={2}>
                Loading, please wait...
              </Typography>
            </Box>
          ) : (
            <>
              {/* Search and Table */}
              <div className="pt-10 p-2 overflow-y-auto h-full">
                <div className="mb-4 flex justify-between items-center">
                  <h1 className="text-2xl font-bold">CATEGORY MANAGEMENT</h1>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search Categories"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                <table className="w-full border-collapse border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category Name
                      </th>
                      <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subcategories
                      </th>
                      <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 border border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => (
                      <tr key={category._id} className="border-t">
                        <td className="px-6 py-3">{category.categoryName}</td>
                        <td className="px-6 py-3">
                          {category.subCategories.map((sub) => sub.name).join(', ')}
                        </td>
                        <td className="px-6 py-3">
                          {category.status ? 'False' : 'True'}
                        </td>
                        <td className="px-6 py-3 flex space-x-2">
                          <button
                            onClick={() => handleToggleBlockCategory(category._id!)}
                            className={`px-4 py-2 rounded ${category.status
                              ? 'bg-red-500 hover:bg-red-700'
                              : 'bg-green-500 hover:bg-green-700'
                              } text-white`}
                          >
                            {category.status ? 'Blocked' : 'Unblock'}
                          </button>
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-between items-center mt-4">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setModalOpen(true)}
                  >
                    Add Category
                  </Button>
                </div>
              </div>

              {/* Modal for Add/Edit Category */}
              <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
                <DialogContent>
                  <div className="space-y-4">
                    <TextField
                      label="Category Name"
                      variant="outlined"
                      fullWidth
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                    />
                    <TextField
                      label="Subcategories"
                      variant="outlined"
                      fullWidth
                      value={subCategories.join(', ')}
                      onChange={(e) => setSubCategories(e.target.value.split(','))}
                    />
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setModalOpen(false)} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCategory} color="primary">
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
