import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BACKEND_URL } from "../constans";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CMSScreen = () => {
  const [cmsData, setCmsData] = useState([]);
  const [cmsFormData, setCmsFormData] = useState({
    id: '',
    cms_title: '',
    cms_key:'',
    cms_content:'',
    seo_title:'',
    seo_description: '',
    seo_keywords:'',
    status:'',
  });

  useEffect(() => {
    const fetchCms = async () => {
      try {
          const response = await axios.get(`${ BACKEND_URL }api/cmsdata`);
          setCmsData(response.data);
      } catch (error) {
          console.error('Error fetching cms:', error);
      }
    };
    fetchCms();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post(`${ BACKEND_URL }api/cmsdata`, cmsFormData);
        closeCmspopup();
        fetchCms(); 
        setCmsFormData({      
          cms_title: '', 
          cms_key:'', 
          cms_content:'', 
          seo_title:'', 
          seo_description: '', 
          seo_keywords:'',
          status:'' 
        });
        toast.success('CMS added successfully!');
    } catch (error) {
        toast.error('Error adding cms');
    }
  };

  const handleUpdateCms = (cms) => {
    setCmsFormData(prevState => ({
        ...prevState,
        id: cms._id,
        cms_title: cms.cms_title,
        cms_content: cms.cms_content,
        cms_key: cms.cms_key,
        seo_title: cms.seo_title,
        seo_description: cms.seo_description,
        seo_keywords: cms.seo_keywords,
        status: cms.status,
    }));
    openCmspopup();
};
  const handleUpdateCmsData = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${ BACKEND_URL }api/cmsdata/${cmsFormData.id}`, {
        cms_title: cmsFormData.cms_title,
        cms_key: cmsFormData.cms_key,
        cms_content:cmsFormData.cms_content,
        seo_title: cmsFormData.seo_title,
        seo_description: cmsFormData.seo_description,
        seo_keywords: cmsFormData.seo_keywords,
        status: cmsFormData.status,
      });
      fetchCms();
      closeCmspopup();
      setCmsFormData({      
        cms_title: '', 
        cms_key:'', 
        cms_content:'', 
        seo_title:'', 
        seo_description: '', 
        seo_keywords:'',
        status:'' 
      });
      toast.success('CMS updated successfully!');
    } catch (error) {
      toast.error('Error updating cms');
    }
  };

  const handleDeleteCms = async (id) => {
    try {
        const confirmDelete = window.confirm('Are you sure you want to delete this category?');    
        if (confirmDelete) {
          await axios.delete(`${ BACKEND_URL }api/cmsdata/${id}`);
          fetchCms(); 
        }        
        toast.success('CMS Deleted successfully!');
    } catch (error) {
        toast.error('Error deleting cms');
    }
  };  

  const openCmspopup = () => {
    const popup = document.getElementById("categorypopup");
    popup.classList.toggle("show");
  };

  const closeCmspopup = () => {
    document.querySelector('.categorypopup').classList.remove('show');    
  };

  const handleDropdownChange = (e) => {
    setCmsFormData({ ...cmsFormData, status: e.target.value });
  };

  return (
    <div>
      <div className="relative block w-3/4 px-10 mb-5 mt-5 text-right">        
        <button className="text-white font-raleway px-3 py-1.5 text-sm bg-green-500 mt-5 rounded inline-block" onClick={openCmspopup}>
          Create CMS
        </button> 
      </div>
      <div className="relative block md:w-full justify-center px-10 mb-5 mt-5 items-center">
        <div className="table-responsive">
          <table className="mt-4 w-3/4 text-left">
            <thead>
              <tr>
                <th className="font-lato text-gray-600 text-sm p-2 font-semibold">CMS Title</th>
                <th className="font-lato text-gray-600 text-sm p-2 font-semibold">CMS Key</th>
                <th className="font-lato text-gray-600 text-sm p-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cmsData.map((cms) => (
                <tr key={cms._id}>
                  <td className="font-lato text-gray-600 text-sm p-2">{cms.cms_title}</td>
                  <td className="font-lato text-gray-600 text-sm p-2">{cms.cms_key}</td>
                  <td className="font-lato text-gray-600 text-sm p-2">
                    <button
                      onClick={() => handleUpdateCms(cms)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2 focus:outline-none focus:shadow-outline">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCms(cms._id)}
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
          <button onClick={closeCmspopup} 
            className="close px-5 py-3 mt-2 text-sm text-center bg-white text-gray-800 font-bold text-2xl"> X </button>
          <div>
            <h3 className="font-bold text-2xl">Add CMS</h3>
          </div>	  
          <div className="mt-10">
            <form className="bg-white" onSubmit={cmsFormData._id ? handleUpdateCmsData : handleFormSubmit}>
              
              <div className="mb-4">
                <label htmlFor="cms_title" className="block text-gray-700 text-sm font-bold mb-2">
                  CMS title:
                </label>
                <input
                  type="text"
                  id="cms_title"
                  name="cms_title"
                  value={cmsFormData.cms_title}
                  onChange={(e) => setCmsFormData({ ...cmsFormData, cms_title:  e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required/>
              </div>
              <div className="mb-4">
                <label htmlFor="cms_key" className="block text-gray-700 text-sm font-bold mb-2">
                  CMS Content:
                </label>
                <ReactQuill
                  id="cms_content"
                  name="cms_content"
                  theme="snow"
                  value={cmsFormData.cms_content}
                  onChange={(content) => setCmsFormData({ ...cmsFormData, cms_content: content })}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cms_key" className="block text-gray-700 text-sm font-bold mb-2">
                  CMS Key:
                </label>
                <input
                  type="text"
                  id="cms_key"
                  name="cms_key"
                  value={cmsFormData.cms_key}
                  onChange={(e) => setCmsFormData({ ...cmsFormData, cms_key:  e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required/>
              </div>
              <div className="mb-4">
                <label htmlFor="cms_key" className="block text-gray-700 text-sm font-bold mb-2">
                  SEO Title:
                </label>
                <input
                  type="text"
                  id="seo_title"
                  name="seo_title"
                  value={cmsFormData.seo_title}
                  onChange={(e) => setCmsFormData({ ...cmsFormData, seo_title: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required/>
              </div>
              <div className="mb-4">
                <label htmlFor="seo_description" className="block text-gray-700 text-sm font-bold mb-2">
                  SEO Description:
                </label>
                <input
                  type="text"
                  id="seo_description"
                  name="seo_description"
                  value={cmsFormData.seo_description}
                  onChange={(e) => setCmsFormData({ ...cmsFormData, seo_description: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required/>
              </div>
              <div className="mb-4">
                <label htmlFor="seo_keywords" className="block text-gray-700 text-sm font-bold mb-2">
                  SEO Keywords:
                </label>
                <input
                  type="text"
                  id="seo_keywords"
                  name="seo_keywords"
                  value={cmsFormData.seo_keywords}
                  onChange={(e) => setCmsFormData({ ...cmsFormData, seo_keywords: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required/>
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
                  Status:
                </label>
                <select
                  id="status"
                  name="status"
                  value={cmsFormData.status}
                  onChange={handleDropdownChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  required>
                  <option value="1">Enabled</option>
                  <option value="0">Disabled</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                {cmsFormData.id ? 'Update CMS' : 'Add CMS'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CMSScreen;