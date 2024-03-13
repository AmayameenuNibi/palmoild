import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import default_img from '../images/default.jpg';

const CompanyScreen = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [currentPage, setCurrentPage] = useState(0); // Default page to 0
    const [itemsPerPage] = useState(10); // Number of items per page
    const [formData, setFormData] = useState({
        user_id: '', 
        company: '',
        category_id: '', 
        country_id: '', 
        website: '',
        mobile: '',
        profile: '',
        title: '',
        logo:'',
        site_id: '', 
        address: '',
        description: '',
        status: 'true', 
        facebook_url: '',
        twitter_url: '',
        linkedin_url: '',
        insta_url: '',
        brochure_url: '',
        featured: 'false', 
    });
    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);
    const [sites, setSites] = useState([]);

    useEffect(() => {
        if (userInfo && userInfo._id) {
            setFormData(prevFormData => ({
                ...prevFormData,
                user_id: userInfo._id
            }));   
        }
    }, [userInfo]);    

    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
        try {
            const categoriesResponse = await axios.get('/api/categories');
            setCategories(categoriesResponse.data);

            const countriesResponse = await axios.get('/api/countries');
            setCountries(countriesResponse.data);

            const sitesResponse = await axios.get('/api/sites');
            setSites(sitesResponse.data);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const [companies, setCompanies] = useState([]);
    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get('/api/companies');
            setCompanies(response.data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const handleDropdownChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }
            await axios.post('/api/companies', formDataToSend);
            closeCompanyPopup();
            fetchCompanies();   
            formdatavalue();
        } catch (error) {
            console.error('Error adding company:', error);
        }
    };
    
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevFormData) => {
            const formDataCopy = { ...prevFormData };
            formDataCopy.logo = file; // Set the logo field to the File object
            return formDataCopy;
        });
    };
         
    const handleDeleteCompany = async (id) => {
        try {
            const confirmDelete = window.confirm('Are you sure you want to delete this company?');
            if (confirmDelete) {
                await axios.delete(`/api/companies/${id}`);
                fetchCompanies(); 
            }
        } catch (error) {
            console.error('Error deleting company:', error);
        }
    };

    const openCompanyPopup = () => {
        formdatavalue();
        const popup = document.getElementById('companypopup');
        popup.classList.toggle('show');
    };

    const closeCompanyPopup = () => {
        document.querySelector('.companypopup').classList.remove('show');
    };

    const openCompanyupdatepopup = () => {
        const popup = document.getElementById('companyupdatepopup');
        popup.classList.toggle('show');
    };

    const closeCompanyupdatepopup = () => {
        document.querySelector('.companyupdatepopup').classList.remove('show');
    };

    const getCategoryNameById = (categoryId) => {
        const category = categories.find((cat) => cat._id === categoryId);
        return category ? category.name : '';
    };

    const getCountryNameById = (countryId) => {
        const country = countries.find((ctry) => ctry._id === countryId);
        return country ? country.name : '';
    };
    
    const [editingCompany, setEditingCompany] = useState(null);
    const handleUpdateCompany = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }
            const response = await axios.put(`/api/companies/${editingCompany._id}`, formDataToSend);
            const updatedCompany = response.data;
            setCompanies((prevCompanies) =>
                prevCompanies.map((company) => (company._id === updatedCompany._id ? updatedCompany : company))
            );
            formdatavalue();
            setEditingCompany(null);
            closeCompanyupdatepopup();
        } catch (error) {
            console.error('Error updating company:', error);
        }
    };
    
    const formdatavalue = () => {
        setFormData({
            company: '',
            category_id: '',
            country_id: '',
            website: '',
            mobile: '',
            profile: '',
            logo: null,
            title: '',
            site_id: '',
            address: '',
            description: '',
            status: 'true',
            facebook_url: '',
            twitter_url: '',
            linkedin_url: '',
            insta_url: '',
            brochure_url: '',
            featured: 'false',
        });
    }
    const handleEditClick = (company) => {
        setEditingCompany(company);
        setFormData({
            company: company.company,
            category_id: company.category_id,
            country_id: company.country_id,
            website: company.website,
            mobile: company.mobile,
            profile: company.profile,
            title: company.title,
            logo: company.logo,
            site_id: company.site_id,
            address: company.address,
            description: company.description,
            status: company.status.toString(), // assuming status is a boolean
            facebook_url: company.facebook_url,
            twitter_url: company.twitter_url,
            linkedin_url: company.linkedin_url,
            insta_url: company.insta_url,
            brochure_url: company.brochure_url,
            featured: company.featured.toString(), // assuming featured is a boolean
        });
        openCompanyupdatepopup(); // Open the edit popup
    };
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Calculate the index of the first and last item to display
    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCompanies = companies.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div>
        <div className="relative block md:w-full justify-center px-10 mb-5 items-center bg-white" >
            <button className="create-company-btn" onClick={openCompanyPopup}>
                Create Company
            </button>
            <div className="table-responsive">
            <table className="mt-4 w-3/4 border-collapse border border-gray-400">
                <thead>
                    <tr>
                        <th className="border border-gray-400 p-2">Logo</th>
                        <th className="border border-gray-400 p-2">Company Name</th>
                        <th className="border border-gray-400 p-2">Category</th>
                        <th className="border border-gray-400 p-2">Country</th>
                        <th className="border border-gray-400 p-2">Website</th>
                        <th className="border border-gray-400 p-2">Delete</th>
                    </tr>
                </thead>
                <tbody>
                        {currentCompanies.map((company) => (
                            <tr key={company._id}>
                                <td className="border border-gray-400 p-2">
                                {!company.logo ? 
                                <>
                                <img style={{ width:'80px', height:'50px' }} src={default_img} />
                                </>:
                                <>
                                    <img src={`http://localhost:5000/uploads/${company.logo}`} width="75px" height="55px" alt={company.company} />
                                </>
                                }
                                </td>
                                <td className="border border-gray-400 p-2">{company.company}</td>
                                <td className="border border-gray-400 p-2">Category</td>
                                <td className="border border-gray-400 p-2">Country</td>
                                <td className="border border-gray-400 p-2">{company.website}</td>
                                <td className="border border-gray-400 p-2">
                                    <button
                                        onClick={() => handleDeleteCompany(company._id)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                                    >Delete</button>
                                    <button onClick={() => handleEditClick(company)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                                        Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table></div>
                <ReactPaginate
                    pageCount={Math.ceil(companies.length / itemsPerPage)}
                    pageRangeDisplayed={5} 
                    marginPagesDisplayed={2} 
                    onPageChange={handlePageChange}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                />                
        </div>
        <section className="companyupdatepopup" id="companyupdatepopup">
            <div className="relative bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
                <button className="close px-5 py-3 mt-2 text-sm text-center bg-white text-gray-800 font-bold text-2xl" onClick={closeCompanyupdatepopup}>X</button>
                <div>
                    <h3 className="font-bold text-2xl">Edit Company</h3>
                </div>
                <div className="mt-10">
                    <form className="bg-white" onSubmit={handleUpdateCompany} encType="multipart/form-data">
                    <div className="mb-4">
                            <label htmlFor="company" className="block text-gray-700 text-sm font-bold mb-2">
                                Company Name:
                            </label>
                            <input type="text" id="update_company" name="company" value={formData.company}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="category_id" className="block text-gray-700 text-sm font-bold mb-2">
                                Category:
                            </label>
                            <select id="update_category_id" name="category_id" value={formData.category_id}
                                onChange={handleDropdownChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                                {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="country_id" className="block text-gray-700 text-sm font-bold mb-2">
                                Country:
                            </label>
                            <select id="update_country_id" name="country_id" value={formData.country_id}
                                onChange={handleDropdownChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="">Select a country</option>
                                {countries.map((country) => (
                                <option key={country._id} value={country._id}>
                                    {country.name}
                                </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="site_id" className="block text-gray-700 text-sm font-bold mb-2">
                                Site:
                            </label>
                            <select id="update_site_id" name="site_id" value={formData.site_id}
                                onChange={handleDropdownChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="">Select a site</option>
                                {sites.map((site) => (
                                <option key={site._id} value={site._id}>
                                    {site.name}
                                </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="logo" className="block text-gray-700 text-sm font-bold mb-2">
                                Logo:
                            </label>
                            <input
                                type="file"
                                id="update_logo"
                                name="logo"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                               />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="profile" className="block text-gray-700 text-sm font-bold mb-2">
                                Profile:
                            </label>
                            <textarea id="update_profile" name="profile" value={formData.profile} onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                                Title:
                            </label>
                            <input
                                type="text"
                                id="update_title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="website" className="block text-gray-700 text-sm font-bold mb-2">
                                Website URL:
                            </label>
                            <input
                                type="text"
                                id="update_website"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="mobile" className="block text-gray-700 text-sm font-bold mb-2">
                                Mobile:
                            </label>
                            <input
                                type="text"
                                id="update_mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
                                Address:
                            </label>
                            <input
                                type="text"
                                id="update_address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                                Description:
                            </label>
                            <textarea
                                id="update_description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="facebook_url" className="block text-gray-700 text-sm font-bold mb-2">
                                Facebook URL:
                            </label>
                            <input
                                type="text"
                                id="update_facebook_url"
                                name="facebook_url"
                                value={formData.facebook_url}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="twitter_url" className="block text-gray-700 text-sm font-bold mb-2">
                                Twitter URL:
                            </label>
                            <input
                                type="text"
                                id="update_twitter_url"
                                name="twitter_url"
                                value={formData.twitter_url}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="linkedin_url" className="block text-gray-700 text-sm font-bold mb-2">
                                LinkedIn URL:
                            </label>
                            <input
                                type="text"
                                id="update_linkedin_url"
                                name="linkedin_url"
                                value={formData.linkedin_url}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="insta_url" className="block text-gray-700 text-sm font-bold mb-2">
                                Instagram URL:
                            </label>
                            <input
                                type="text"
                                id="update_insta_url"
                                name="insta_url"
                                value={formData.insta_url}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="brochure_url" className="block text-gray-700 text-sm font-bold mb-2">
                                Brochure URL:
                            </label>
                            <input
                                type="text"
                                id="update_brochure_url"
                                name="brochure_url"
                                value={formData.brochure_url}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="featured" className="block text-gray-700 text-sm font-bold mb-2">
                                Featured:
                            </label>
                            <select
                                id="update_featured"
                                name="featured"
                                value={formData.featured}
                                onChange={handleDropdownChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
                                Status:
                            </label>
                            <select
                                id="update_status"
                                name="status"
                                value={formData.status}
                                onChange={handleDropdownChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Update Company
                        </button>
                    </form>
                </div>
            </div>
        </section>
        <section className="companypopup" id="companypopup" >
            <div className="relative bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
                <button className="close px-5 py-3 mt-2 text-sm text-center bg-white text-gray-800 font-bold text-2xl" onClick={closeCompanyPopup}>X</button>
                <div>
                    <h3 className="font-bold text-2xl">Create Company</h3>
                </div>
                <div className="mt-10">
                    <form className="bg-white" onSubmit={handleFormSubmit} encType="multipart/form-data">
                        <input type="hidden" id="user_id" name="user_id"  value={formData.user_id}
                                onChange={handleInputChange}/>
                        <div className="mb-4">
                            <label htmlFor="company" className="block text-gray-700 text-sm font-bold mb-2">
                                Company Name:
                            </label>
                            <input type="text" id="company" name="company" value={formData.company}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="category_id" className="block text-gray-700 text-sm font-bold mb-2">
                                Category:
                            </label>
                            <select id="category_id" name="category_id" value={formData.category_id}
                                onChange={handleDropdownChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                                {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="country_id" className="block text-gray-700 text-sm font-bold mb-2">
                                Country:
                            </label>
                            <select id="country_id" name="country_id" value={formData.country_id}
                                onChange={handleDropdownChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="">Select a country</option>
                                {countries.map((country) => (
                                <option key={country._id} value={country._id}>
                                    {country.name}
                                </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="site_id" className="block text-gray-700 text-sm font-bold mb-2">
                                Site:
                            </label>
                            <select id="site_id" name="site_id" value={formData.site_id}
                                onChange={handleDropdownChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="">Select a site</option>
                                {sites.map((site) => (
                                <option key={site._id} value={site._id}>
                                    {site.name}
                                </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="logo" className="block text-gray-700 text-sm font-bold mb-2">
                                Logo:
                            </label>
                            <input
                                type="file"
                                id="logo"
                                name="logo"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="profile" className="block text-gray-700 text-sm font-bold mb-2">
                                Profile:
                            </label>
                            <textarea id="profile" name="profile" value={formData.profile} onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                                Title:
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="website" className="block text-gray-700 text-sm font-bold mb-2">
                                Website URL:
                            </label>
                            <input
                                type="text"
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="mobile" className="block text-gray-700 text-sm font-bold mb-2">
                                Mobile:
                            </label>
                            <input
                                type="text"
                                id="mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
                                Address:
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                                Description:
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="facebook_url" className="block text-gray-700 text-sm font-bold mb-2">
                                Facebook URL:
                            </label>
                            <input
                                type="text"
                                id="facebook_url"
                                name="facebook_url"
                                value={formData.facebook_url}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="twitter_url" className="block text-gray-700 text-sm font-bold mb-2">
                                Twitter URL:
                            </label>
                            <input
                                type="text"
                                id="twitter_url"
                                name="twitter_url"
                                value={formData.twitter_url}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="linkedin_url" className="block text-gray-700 text-sm font-bold mb-2">
                                LinkedIn URL:
                            </label>
                            <input
                                type="text"
                                id="linkedin_url"
                                name="linkedin_url"
                                value={formData.linkedin_url}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="insta_url" className="block text-gray-700 text-sm font-bold mb-2">
                                Instagram URL:
                            </label>
                            <input
                                type="text"
                                id="insta_url"
                                name="insta_url"
                                value={formData.insta_url}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="brochure_url" className="block text-gray-700 text-sm font-bold mb-2">
                                Brochure URL:
                            </label>
                            <input
                                type="text"
                                id="brochure_url"
                                name="brochure_url"
                                value={formData.brochure_url}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="featured" className="block text-gray-700 text-sm font-bold mb-2">
                                Featured:
                            </label>
                            <select
                                id="featured"
                                name="featured"
                                value={formData.featured}
                                onChange={handleDropdownChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
                                Status:
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleDropdownChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Add Company
                        </button>
                    </form>
                </div>
            </div>
        </section>  
        </div>
    );
};

export default CompanyScreen;
