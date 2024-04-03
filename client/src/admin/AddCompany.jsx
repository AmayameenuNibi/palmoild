import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams,useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BACKEND_URL } from "../constans";

const AddCompany = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const { companyId } = useParams(); 
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        user_id: userInfo._id, 
        company: '',
        category_id: '', 
        country_id: '', 
        website: '',
        mobile: '',
        email:'',
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
    });
    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);
    const [sites, setSites] = useState([]);
    const [staff, setStaff] = useState([]);
    

    const fetchOptions = async () => {
        try {
            const categoriesResponse = await axios.get(`${ BACKEND_URL }api/categories`);
            setCategories(categoriesResponse.data);

            const countriesResponse = await axios.get(`${ BACKEND_URL }api/countries`);
            setCountries(countriesResponse.data);

            const sitesResponse = await axios.get(`${ BACKEND_URL }api/sites`);
            setSites(sitesResponse.data);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };
    
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevFormData) => {
            const formDataCopy = { ...prevFormData };
            formDataCopy.logo = file; 
            return formDataCopy;
        });
    };

    useEffect(() => {
        fetchOptions();
        if (companyId) {
            fetchCompanyDetails(companyId);
        }
    }, []);

    const fetchCompanyDetails = async (companyId) => {
        try {
            const response = await axios.get(`${ BACKEND_URL }api/companies/single/${companyId}`);
            const companyData = response.data; 
            setFormData(companyData);
            const staffresponse = await axios.get(`${ BACKEND_URL }api/staff/${companyData._id}`);
            const staffData = staffresponse.data;
            if (Array.isArray(staffData)) {
                setStaff(staffData);
            } else {
                const staffArray = Object.values(staffData);
                setStaff(staffArray);
                console.error('Staff data is not an array:', staffData);
            }
        } catch (error) {
            console.error('Error fetching company details:', error);
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

            staff.forEach((staffMember, index) => {
                for (const key in staffMember) {
                  formDataToSend.append(`staff[${index}][${key}]`, staffMember[key]);
                }
            });

            if (companyId) {
                const response = await axios.put(`${ BACKEND_URL }api/companies/${companyId}`, formDataToSend);
                const companyData = response.data; 
                navigate(`/companies/${companyData.company_slug}`);
                toast.success('Company details Updated Successfully');
            } else {
                const response =await axios.post(`${ BACKEND_URL }api/companies`, formDataToSend);
                const companyData = response.data; 
                navigate(`/companies/${companyData.company_slug}`);
                toast.success('Company details Added Successfully');
            }
            formdatavalue();
        } catch (error) {
            console.error('Error adding company:', error);
        }
    };

    const formdatavalue = () => {
        setFormData({
            company: '',
            category_id: '',
            country_id: '',
            website: '',
            mobile: '',
            email:'',
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
        });
    }

    const handleAddStaff = () => {
        setStaff([...staff, { name: '', email: '', mobile: '', designation: '' }]);
    };
    
    const handleRemoveStaff = (index) => {
        const updatedStaff = [...staff];
        updatedStaff.splice(index, 1);
        setStaff(updatedStaff);
    };
    
    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedStaff = [...staff];
        updatedStaff[index][name] = value;
        setStaff(updatedStaff);
    };

    return (
        <div>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false}
        closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />      
        <div className="relative bg-white  p-8 md:p-12 my-10">                
            <form className="bg-white company-row" onSubmit={handleFormSubmit} encType="multipart/form-data">
                <div>
                    <h3 className="text-white font-raleway px-3 py-1.5 text-sm inline-block mb-4">Create Company</h3>
                </div>
                {!formData.logo ? 
                    <>                    
                    </>:
                    <>
                        <img src={`${ BACKEND_URL }uploads/${formData.logo}`} width="75px" height="55px" alt={company.company} />
                    </>
                }
                <input 
                    type="hidden"  id="user_id" name="user_id" value={formData.user_id}  onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                
                <div className="mb-4">
                    <label htmlFor="company" className="block text-gray-700 text-sm font-bold mb-2">
                        Company Name:
                    </label>
                    <input 
                        type="text" id="company" name="company" value={formData.company} onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        required />
                </div>
                <div className="mb-4">
                    <label htmlFor="category_id" className="block text-gray-700 text-sm font-bold mb-2">
                        Category:
                    </label>
                    <select 
                        id="category_id" name="category_id" value={formData.category_id} onChange={handleDropdownChange}
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
                    <select 
                        id="country_id" name="country_id" value={formData.country_id} onChange={handleDropdownChange}
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
                    <select 
                        id="site_id" name="site_id" value={formData.site_id} onChange={handleDropdownChange}
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
                        type="file" id="logo" name="logo" accept="image/*" onChange={handleLogoChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="profile" className="block text-gray-700 text-sm font-bold mb-2">
                        Profile:
                    </label>
                    <textarea id="profile" name="profile" value={formData.profile} onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                        Title:
                    </label>
                    <input
                        type="text" id="title" name="title" value={formData.title} onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="website" className="block text-gray-700 text-sm font-bold mb-2">
                        Website URL:
                    </label>
                    <input
                        type="text" id="website" name="website" value={formData.website} onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="mobile" className="block text-gray-700 text-sm font-bold mb-2">
                        Mobile:
                    </label>
                    <input
                        type="text" id="mobile" name="mobile" value={formData.mobile} onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                        Email:
                    </label>
                    <input
                        type="text" id="email" name="email" value={formData.email} onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
                        Address:
                    </label>
                    <input
                        type="text" id="address" name="address" value={formData.address} onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                        required />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                        Description:
                    </label>
                    <textarea
                        id="description" name="description" value={formData.description} onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="facebook_url" className="block text-gray-700 text-sm font-bold mb-2">
                        Facebook URL:
                    </label>
                    <input
                        type="text" id="facebook_url" name="facebook_url" value={formData.facebook_url}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="twitter_url" className="block text-gray-700 text-sm font-bold mb-2">
                        Twitter URL:
                    </label>
                    <input
                        type="text" id="twitter_url" name="twitter_url" value={formData.twitter_url}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="linkedin_url" className="block text-gray-700 text-sm font-bold mb-2">
                        LinkedIn URL:
                    </label>
                    <input
                        type="text" id="linkedin_url" name="linkedin_url" value={formData.linkedin_url}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="insta_url" className="block text-gray-700 text-sm font-bold mb-2">
                        Instagram URL:
                    </label>
                    <input
                        type="text" id="insta_url" name="insta_url" value={formData.insta_url} onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="brochure_url" className="block text-gray-700 text-sm font-bold mb-2">
                        Brochure URL:
                    </label>
                    <input
                        type="text" id="brochure_url" name="brochure_url" value={formData.brochure_url}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
                        Status:
                    </label>
                    <select id="status" name="status" value={formData.status}  onChange={handleDropdownChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
                <div>
                    {staff.map((staffMember, index) => (
                        <div key={index} className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                            <input
                                type="text"
                                className="focus:outline-none focus:shadow-outline"
                                name="name"
                                value={staffMember.name}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="Name" />
                            <input
                                type="email"
                                className="focus:outline-none focus:shadow-outline"
                                name="email"
                                value={staffMember.email}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="Email" />
                            <input
                                type="tel"
                                className="focus:outline-none focus:shadow-outline"
                                name="mobile"
                                value={staffMember.mobile}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="Mobile" />
                            <input
                                type="text"
                                className="focus:outline-none focus:shadow-outline"
                                name="designation"
                                value={staffMember.designation}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="Designation" />
                            {index > 0 && (
                            <button type="button" onClick={() => handleRemoveStaff(index)}>
                                Remove
                            </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={handleAddStaff}>
                        Add Staff
                    </button>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    {companyId ? 'Edit Company' : 'Add Company'}
                </button>
            </form>
        </div>
    </div>
  )
}

export default AddCompany
