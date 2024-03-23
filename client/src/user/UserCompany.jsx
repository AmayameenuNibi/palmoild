import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BACKEND_URL } from '../constans';

const UserCompany = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { companyId } = useParams();
  const [logoPreview, setLogoPreview] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: userInfo._id,
    company: userInfo.company,
    category_id: '',
    country_id: '',
    website: '',
    mobile: '',
    email: '',
    profile: '',
    title: '',
    logo: null,
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
  const [statusData, setstatusData] = useState({
    status: '',
    companyId: '',
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
    if (file) {
      const logoUrl = URL.createObjectURL(file);
      setFormData((prevFormData) => ({
        ...prevFormData,
        logo: file,
      }));
      setLogoPreview(logoUrl);
    }
  };

  useEffect(() => {
    fetchOptions();
    fetchCompanyDetails(userInfo._id);
  }, [statusData.status, statusData.companyId]);

  const fetchCompanyDetails = async (userId) => {
    try {
      const response = await axios.get(`${ BACKEND_URL }api/companies/user/${userId}`);
      const companyData = response.data;
      setstatusData({
        status: '1',
        companyId: companyData._id,
      });
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
      setstatusData({
        status: '0',
      });
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

      if (statusData.status === '1') {
        const response = await axios.put(`${ BACKEND_URL }api/companies/${statusData.companyId}`, formDataToSend);
        const companyData = response.data;
        navigate(`/companies/${companyData.company_slug}`);
        toast.success('Company details Updated Successfully');
      } else {
        const response = await axios.post(`${ BACKEND_URL }api/companies`, formDataToSend);
        const companyData = response.data;
        navigate(`/companies/${companyData.company_slug}`);
        toast.success('Company details Added Successfully');
      }
      formdatavalue();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message === 'company already exists') {
        toast.error('User already exists with this same company already exists ');
      } else {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const formdatavalue = () => {
    setFormData({
      company: '',
      category_id: '',
      country_id: '',
      website: '',
      mobile: '',
      email: '',
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
  };

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
      <section class="bg-white">
        <div class="container mx-auto my-0 w-8/12 pt-10">
            <h2 class="text-xl text-gray-600 mb-10">Please complete your ad listing details</h2>
            <form onSubmit={handleFormSubmit} encType="multipart/form-data">
              {logoPreview ? <img src={logoPreview} width="75px" height="55px" alt={formData.company} /> : null}
              {statusData.status == '1' ? (
                <img src={`${ BACKEND_URL }uploads/${formData.logo}`} width="75px" height="55px" alt="Company Logo" />
              ) : null}
              <input
                type="hidden"
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                class="w-full rounded border h-10"/>
              
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="company" className="pb-2 block text-sm"> Company Name: <span class="text-red-500 text-xs">*</span></label>
                  <input 
                      type="text" id="company" name="company" value={formData.company} onChange={handleInputChange}
                      class="w-full rounded border h-10"
                      required />
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="category_id" className="pb-2 block text-sm">
                      Category:
                  <span class="text-red-500 text-xs">*</span></label>
                  <select 
                      id="category_id" name="category_id" value={formData.category_id} onChange={handleDropdownChange}
                      class="w-full rounded border h-10">
                      {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                          {category.name}
                      </option>
                      ))}
                  </select>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="country_id" className="pb-2 block text-sm">
                      Country:
                  <span class="text-red-500 text-xs">*</span></label>
                  <select 
                      id="country_id" name="country_id" value={formData.country_id} onChange={handleDropdownChange}
                      class="w-full rounded border h-10">
                      <option value="">Select a country</option>
                      {countries.map((country) => (
                      <option key={country._id} value={country._id}>
                          {country.name}
                      </option>
                      ))}
                  </select>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="site_id" className="pb-2 block text-sm">
                      Site:
                  <span class="text-red-500 text-xs">*</span></label>
                  <select 
                      id="site_id" name="site_id" value={formData.site_id} onChange={handleDropdownChange}
                      class="w-full rounded border h-10">
                      <option value="">Select a site</option>
                      {sites.map((site) => (
                      <option key={site._id} value={site._id}>
                          {site.name}
                      </option>
                      ))}
                  </select>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="logo" className="pb-2 block text-sm">
                      Logo:
                  <span class="text-red-500 text-xs">*</span></label>
                  <input
                      type="file" id="logo" name="logo" accept="image/*" onChange={handleLogoChange}
                      class="w-full rounded border h-10"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="profile" className="pb-2 block text-sm">
                      Profile:
                  <span class="text-red-500 text-xs">*</span></label>
                  <textarea id="profile" name="profile" value={formData.profile} onChange={handleInputChange}
                      class="w-full rounded border h-10"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="title" className="pb-2 block text-sm">
                      Title:
                  <span class="text-red-500 text-xs">*</span></label>
                  <input
                      type="text" id="title" name="title" value={formData.title} onChange={handleInputChange}
                      class="w-full rounded border h-10"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="website" className="pb-2 block text-sm">
                      Website URL:
                  <span class="text-red-500 text-xs">*</span></label>
                  <input
                      type="text" id="website" name="website" value={formData.website} onChange={handleInputChange}
                      class="w-full rounded border h-10"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="mobile" className="pb-2 block text-sm">
                      Mobile:
                  <span class="text-red-500 text-xs">*</span></label>
                  <input
                      type="text" id="mobile" name="mobile" value={formData.mobile} onChange={handleInputChange}
                      class="w-full rounded border h-10"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="email" className="pb-2 block text-sm">
                      Email:
                  <span class="text-red-500 text-xs">*</span></label>
                  <input
                      type="text" id="email" name="email" value={formData.email} onChange={handleInputChange}
                      class="w-full rounded border h-10"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="address" className="pb-2 block text-sm">
                      Address:
                  <span class="text-red-500 text-xs">*</span></label>
                  <input
                      type="text" id="address" name="address" value={formData.address} onChange={handleInputChange}
                      class="w-full rounded border h-10"
                      required />
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="description" className="pb-2 block text-sm">
                      Description:
                  <span class="text-red-500 text-xs">*</span></label>
                  <textarea
                      id="description" name="description" value={formData.description} onChange={handleInputChange}
                      class="w-full rounded border h-10"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="facebook_url" className="pb-2 block text-sm">
                      Facebook URL:
                  <span class="text-red-500 text-xs">*</span></label>
                  <input
                      type="text" id="facebook_url" name="facebook_url" value={formData.facebook_url}
                      onChange={handleInputChange}
                      class="w-full rounded border h-10"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="twitter_url" className="pb-2 block text-sm">
                      Twitter URL:
                  <span class="text-red-500 text-xs">*</span></label>
                  <input
                      type="text" id="twitter_url" name="twitter_url" value={formData.twitter_url}
                      onChange={handleInputChange}
                      class="w-full rounded border h-10"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="linkedin_url" className="pb-2 block text-sm">
                      LinkedIn URL:
                  <span class="text-red-500 text-xs">*</span></label>
                  <input
                      type="text" id="linkedin_url" name="linkedin_url" value={formData.linkedin_url}
                      onChange={handleInputChange}
                      class="w-full rounded border h-10"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="insta_url" className="pb-2 block text-sm">
                      Instagram URL:
                  <span class="text-red-500 text-xs">*</span></label>
                  <input
                      type="text" id="insta_url" name="insta_url" value={formData.insta_url} onChange={handleInputChange}
                      class="w-full rounded border h-10"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="brochure_url" className="pb-2 block text-sm">
                      Brochure URL:
                  <span class="text-red-500 text-xs">*</span></label>
                  <input
                      type="text" id="brochure_url" name="brochure_url" value={formData.brochure_url}
                      onChange={handleInputChange}
                      class="w-full rounded border h-10"
                  />
              </div> 
              <div>
                  {staff.map((staffMember, index) => (
                  <div key={index} style={{ border: '1px solid #000', borderRadius: '5px' }}>
                      <input
                          type="text"
                          name="name"
                          value={staffMember.name}
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Name"
                          required />
                      <input
                          type="email"
                          name="email"
                          value={staffMember.email}
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Email" 
                          required />
                      <input
                          type="tel"
                          name="mobile"
                          value={staffMember.mobile}
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Mobile"
                          required />
                      <input
                          type="text"
                          name="designation"
                          value={staffMember.designation}
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Designation"
                          required />
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
        </section>
    </div>
  );
};

export default UserCompany;
