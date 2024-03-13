import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryScreen = () => {
  const [categoryFormData, setCategoryFormData] = useState({
    id: '',
    site_id: '',
    name: '',
  });

  const [categories, setCategories] = useState([]);
  const [sites, setSites] = useState([]);

  const fetchCategories = async () => {
    try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
        const site_response = await axios.get('/api/sites');
        setSites(site_response.data);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post('/api/categories', categoryFormData);
        openCatpopup();
        fetchCategories(); 
        setCategoryFormData({ name: '', site_id: '' }); 
        toast.success('Category added successfully!');
    } catch (error) {
        toast.error('Error adding category');
    }
  };

  const handleUpdateCategory = (category) => {
    setCategoryFormData({
      id: category._id,
      site_id: category.site_id,
      name: category.name,
    });
    openCatpopup();
  };

  const handleUpdateCategoryData = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/categories/${categoryFormData.id}`, {
        site_id: categoryFormData.site_id,
        name: categoryFormData.name,
      });
      fetchCategories();
      closeCatpopup();
      setCategoryFormData({ 
        id: '', 
        site_id: '', 
        name: '' 
      }); 
      toast.success('Category updated successfully!');
    } catch (error) {
      toast.error('Error updating category');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
        const confirmDelete = window.confirm('Are you sure you want to delete this category?');    
        if (confirmDelete) {
          await axios.delete(`/api/categories/${id}`);
          fetchCategories(); 
        }        
        toast.success('Category Deleted successfully!');
    } catch (error) {
        toast.error('Error deleting category');
    }
  }; 

  const openCatpopup = () => {
    const popup = document.getElementById("categorypopup");
    popup.classList.toggle("show");
  };

  const closeCatpopup = () => {
    document.querySelector('.categorypopup').classList.remove('show');
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="relative block md:w-full justify-center px-10 mb-5 items-center bg-white">
        <div className="table-responsive">
          <button className="create-cat-btn" onClick={openCatpopup} >Create Category</button>        
          <table className="mt-4 w-3/4 border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 p-2">Category Name</th>
                <th className="border border-gray-400 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td className="border border-gray-400 p-2">{category.name}</td>
                  <td className="border border-gray-400 p-2">
                    <button onClick={() => handleUpdateCategory(category)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2 focus:outline-none focus:shadow-outline">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteCategory(category._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <section className="categorypopup" id="categorypopup">
        <div className="relative bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
          <button onClick={closeCatpopup} 
            className="close px-5 py-3 mt-2 text-sm text-center bg-white text-gray-800 font-bold text-2xl"> X </button>
          <div>
            <h3 className="font-bold text-2xl">Members Login</h3>
          </div>	  
          <div className="mt-10">
            <form className="bg-white" onSubmit={categoryFormData.id ? handleUpdateCategoryData : handleFormSubmit}>
              <div className="mb-4">
                <label htmlFor="site_id" className="block text-gray-700 text-sm font-bold mb-2">
                  Site:
                </label>
                <select
                  id="site_id"
                  name="site_id"
                  value={categoryFormData.site_id}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, site_id: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required>
                  <option value="">Select a site</option>
                    {sites.map((site) => (
                      <option key={site._id} value={site._id}>
                        {site.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Category Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required/>
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Add Category
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryScreen;
