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
                    className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                
                <div className="mb-4">
                    <input 
                        type="text" id="company" name="company" placeholder='Company Name:' value={formData.company} onChange={handleInputChange}
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"
                        required />
                </div>
                <div className="mb-4">
                    <select 
                        id="category_id" name="category_id" value={formData.category_id} onChange={handleDropdownChange} placeholder='Category:'
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold">
                        {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <select 
                        id="country_id" name="country_id" value={formData.country_id} onChange={handleDropdownChange}
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold">
                        <option value="">Select a country</option>
                        {countries.map((country) => (
                        <option key={country._id} value={country._id}>
                            {country.name}
                        </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <select 
                        id="site_id" name="site_id" value={formData.site_id} onChange={handleDropdownChange} placeholder='Site: '
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold">
                        <option value="">Select a site</option>
                        {sites.map((site) => (
                        <option key={site._id} value={site._id}>
                            {site.name}
                        </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="logo" className="w-full px-6 py-3 font-lato text-gray-600 text-sm font-semibold">
                        Logo:
                    </label>
                    <input
                        type="file" id="logo" name="logo" accept="image/*" onChange={handleLogoChange}
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                </div>
                <div className="mb-4">
                    <textarea id="profile" name="profile" value={formData.profile} onChange={handleInputChange} placeholder='Profile: '
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                </div>
                <div className="mb-4"><input
                        type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder='Title: '
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                </div>
                <div className="mb-4">
                    <input
                        type="text" id="website" name="website" value={formData.website} onChange={handleInputChange}
                        placeholder='Website URL:'
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                </div>
                <div className="mb-4">
                    <input 
                        type="text" id="mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder='Mobile:'
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                </div>
                <div className="mb-4">
                    <input
                        type="text" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder='Email:'
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                </div>
                <div className="mb-4">
                    <input
                        type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder='Address:'
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"
                        required />
                </div>
                <div className="mb-4">
                    <textarea
                        id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder='Description:'
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                </div>
                <div className="mb-4">
                    <input
                        type="text" id="facebook_url" name="facebook_url" value={formData.facebook_url}
                        onChange={handleInputChange}
                        placeholder='Facebook URL:'
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                </div>
                <div className="mb-4">
                    <input
                        type="text" id="twitter_url" name="twitter_url" value={formData.twitter_url} placeholder='Twitter URL:'
                        onChange={handleInputChange}
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                </div>
                <div className="mb-4">
                    <input
                        type="text" id="linkedin_url" name="linkedin_url" value={formData.linkedin_url} placeholder='LinkedIn URL:'
                        onChange={handleInputChange}
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                </div>
                <div className="mb-4">
                    <input
                        type="text" id="insta_url" name="insta_url" value={formData.insta_url} onChange={handleInputChange} placeholder='Instagram URL:'
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                </div>
                <div className="mb-4">
                    <input
                        type="text" id="brochure_url" name="brochure_url" value={formData.brochure_url} placeholder='Brochure URL:'
                        onChange={handleInputChange}
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"
                    />
                </div>
                <div className="mb-4">
                    <select id="status" name="status" value={formData.status}  onChange={handleDropdownChange} placeholder='Status:'
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold">
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
                <div>
                    {staff.map((staffMember, index) => (
                        <div key={index} className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold">
                            <input
                                type="text"
                                className="focus:outline-none focus:shadow-outline font-lato text-gray-600 font-semibold"
                                name="name"
                                value={staffMember.name}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="Name" />
                            <input
                                type="email"
                                className="focus:outline-none focus:shadow-outline font-lato text-gray-600 font-semibold"
                                name="email"
                                value={staffMember.email}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="Email" />
                            <input
                                type="tel"
                                className="focus:outline-none focus:shadow-outline font-lato text-gray-600 font-semibold"
                                name="mobile"
                                value={staffMember.mobile}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="Mobile" />
                            <input
                                type="text"
                                className="focus:outline-none focus:shadow-outline font-lato text-gray-600 font-semibold"
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
                    <button type="button" onClick={handleAddStaff} className="bg-slate-50 text-sm font-semibold mx-1 px-5 py-2 text-gray-800 border border-gray-200 rounded">
                        Add Staff
                    </button>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    {companyId ? 'Edit Company' : 'Add Company'}
                </button>
            </form>
        </div>
    </div>
  )
}

export default AddCompany
