import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BACKEND_URL } from '../constans';
import { Helmet } from 'react-helmet';

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
    if (userInfo.status === 0) {
      navigate('/subscribe');
    }
    fetchOptions();
    fetchCompanyDetails(userInfo._id);
  }, [userInfo.status,statusData.status, statusData.companyId]);

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
        // navigate(`/companies/${companyData.company_slug}`);
        toast.success('Company details Updated Successfully');
      } else {
        const response = await axios.post(`${ BACKEND_URL }api/companies`, formDataToSend);
        const companyData = response.data;
        // navigate(`/companies/${companyData.company_slug}`);
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
    <div style={{ display: userInfo.status === 0 ? 'none' : 'block' }}>
      <Helmet>
          <title>PalmOil Directory, My Company</title>
          <meta name="description" content="PalmOil Directory" />
          <meta name="Keywords" CONTENT="palm oil,cpo,commodities,palm kernel oil,carotene,FFB,vegetable oil,lauric acid, milling,MPOPC,MPOB,olein,kernel,PKO,PKS,PORAM,RBD,refining,
              speciality fats,plantations,refinery,lipids,fatty acids,soap noodles,stearin,stearine,shortening,vanaspati,margarine,malaysia,indonesia,
              biodiesel,palm biodiesel"/>    
      </Helmet>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false}
        closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <section className="bg-white">
        <div className="container mx-auto my-0 w-8/12 pt-10">
            <h2 className="text-xl text-gray-600 mb-10">Please complete your ad listing details</h2>
            <form onSubmit={handleFormSubmit} encType="multipart/form-data">
              {logoPreview ? <img src={logoPreview} width="75px" height="55px" alt={formData.company} /> : null}
              {statusData.status === '1' && formData.logo && typeof formData.logo === 'string' && formData.logo.trim() !== '' && (
                  <img 
                    src={`${BACKEND_URL}uploads/${formData.logo}`} 
                    width="75px" 
                    height="55px" 
                    alt="Company Logo" />
              )}

              <input
                type="hidden"
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                className="w-full rounded border-gray-400 border h-10"/>
              
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="company" className="pb-3 block text-sm uppercase font-raleway py-3 font-semibold text-gray-700"> COMPANY NAME <span className="text-red-500 text-xl pl-1">*</span></label>
                  <input 
                      type="text" id="company" name="company" value={formData.company} onChange={handleInputChange}
                      className="w-full rounded border border-gray-400 h-10 pl-2"
                      required />
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="category_id" className="pb-3 block text-sm  uppercase font-raleway py-3 font-semibold text-gray-700">
                      Category
                  <span className="text-red-500 text-xl pl-1">*</span></label>
                  <select 
                      id="category_id" name="category_id" value={formData.category_id} onChange={handleDropdownChange}
                      className="w-full rounded border border-gray-400 h-10 pl-2">
                      {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                          {category.name}
                      </option>
                      ))}
                  </select>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="country_id" className="pb-3 block text-sm uppercase font-raleway py-3 font-semibold text-gray-700">
                      COUNTRY
                  <span className="text-red-500 text-xl pl-1">*</span></label>
                  <select 
                      id="country_id" name="country_id" value={formData.country_id} onChange={handleDropdownChange}
                      className="w-full rounded border border-gray-400 h-10 pl-2">
                      <option value="">Select a country</option>
                      {countries.map((country) => (
                      <option key={country._id} value={country._id}>
                          {country.name}
                      </option>
                      ))}
                  </select>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="site_id" className="pb-3 block text-sm uppercase font-raleway py-3 font-semibold text-gray-700">
                      Site
                  <span className="text-red-500 text-xl pl-1">*</span></label>
                  <select 
                      id="site_id" name="site_id" value={formData.site_id} onChange={handleDropdownChange}
                      className="w-full rounded border border-gray-400 h-10 pl-2">
                      <option value="">Select a site</option>
                      {sites.map((site) => (
                      <option key={site._id} value={site._id}>
                          {site.name}
                      </option>
                      ))}
                  </select>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="logo" className="pb-3 block text-sm uppercase font-raleway py-3 font-semibold text-gray-700">
                      Logo
                  </label>
                  <input
                      type="file" id="logo" name="logo" accept="image/*" onChange={handleLogoChange}
                      className="w-full rounded border border-gray-400 h-10 pl-2"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="title" className="pb-3 block text-sm uppercase font-raleway py-3 font-semibold text-gray-700">
                      Title
                  <span className="text-red-500 text-xl pl-1">*</span></label>
                  <input
                      type="text" id="title" name="title" value={formData.title} onChange={handleInputChange}
                      className="w-full rounded border border-gray-400 h-10 pl-2"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="website" className="pb-3 block text-sm uppercase font-raleway py-3 font-semibold text-gray-700">
                      Website URL
                  <span className="text-red-500 text-xl pl-1">*</span></label>
                  <input
                      type="text" id="website" name="website" value={formData.website} onChange={handleInputChange}
                      className="w-full rounded border border-gray-400 h-10 pl-2"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="mobile" className="pb-3 block text-sm uppercase font-raleway py-3 font-semibold text-gray-700">
                      Mobile
                  <span className="text-red-500 text-xl pl-1">*</span></label>
                  <input
                      type="text" id="mobile" name="mobile" value={formData.mobile} onChange={handleInputChange}
                      className="w-full rounded border border-gray-400 h-10 pl-2"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="email" className="pb-3 block text-sm uppercase font-raleway py-3 font-semibold text-gray-700">
                      Email
                  <span className="text-red-500 text-xl pl-1">*</span></label>
                  <input
                      type="text" id="email" name="email" value={formData.email} onChange={handleInputChange}
                      className="w-full rounded border border-gray-400 h-10 pl-2"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="address" className="pb-3 block text-sm uppercase font-raleway py-3 font-semibold text-gray-700">
                      Address
                  <span className="text-red-500 text-xl pl-1">*</span></label>
                  <input
                      type="text" id="address" name="address" value={formData.address} onChange={handleInputChange}
                      className="w-full rounded border border-gray-400 h-10 pl-2"
                      required />
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="description" className="pb-3 block text-sm uppercase font-raleway py-3 font-semibold text-gray-700">
                      Description
                  <span className="text-red-500 text-xl pl-1">*</span></label>
                  <textarea
                      id="description" name="description" value={formData.description} onChange={handleInputChange}
                      className="w-full rounded border border-gray-400 h-10 pl-2"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="facebook_url" className="pb-3 block text-sm uppercase font-raleway py-3 font-semibold text-gray-700">
                      Facebook URL
                  </label>
                  <input
                      type="text" id="facebook_url" name="facebook_url" value={formData.facebook_url}
                      onChange={handleInputChange}
                      className="w-full rounded border border-gray-400 h-10 pl-2"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="twitter_url" className="pb-3 block text-sm uppercase font-raleway py-3 font-semibold text-gray-700">
                      Twitter URL
                  </label>
                  <input
                      type="text" id="twitter_url" name="twitter_url" value={formData.twitter_url}
                      onChange={handleInputChange}
                      className="w-full rounded border border-gray-400 h-10 pl-2"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="linkedin_url" className="pb-3 block text-sm uppercase font-raleway py-3 font-semibold text-gray-700">
                      LinkedIn URL
                  </label>
                  <input
                      type="text" id="linkedin_url" name="linkedin_url" value={formData.linkedin_url}
                      onChange={handleInputChange}
                      className="w-full rounded border border-gray-400 h-10 pl-2"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="insta_url" className="pb-3 block text-sm uppercase font-raleway py-3 font-semibold text-gray-700">
                      Instagram URL
                  </label>
                  <input
                      type="text" id="insta_url" name="insta_url" value={formData.insta_url} onChange={handleInputChange}
                      className="w-full rounded border border-gray-400 h-10 pl-2"/>
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                  <label htmlFor="brochure_url" className="pb-3 block text-sm uppercase font-raleway py-3 font-semibold text-gray-700">
                      Brochure URL
                  </label>
                  <input
                      type="text" id="brochure_url" name="brochure_url" value={formData.brochure_url}
                      onChange={handleInputChange}
                      className="w-full rounded border border-gray-400 h-10 pl-2 "
                  />
              </div> 
              <div className="w-full inline-block pr-4 pb-4">
                  <label htmlFor="profile" className="pb-3 block text-sm uppercase font-raleway py-3 font-semibold text-gray-700">
                      Profile
                  </label>
                  <textarea id="profile" name="profile" value={formData.profile} onChange={handleInputChange}
                      className="w-full rounded border border-gray-400 h-20 pl-2"/>
              </div>
              <div>
                  {staff.map((staffMember, index) => (
                  <div className="block mb-5" key={index}>
                      <input
                          type="text"
                          name="name"
                          value={staffMember.name}
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Name"
                          className="w-6/12 border h-10 pl-2 inline-block text-center"
                          required />
                      <input
                          type="email"
                          name="email"
                          value={staffMember.email}
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Email"
                          className="w-6/12 border h-10 pl-2 inline-block text-center"
                          required />
                      <input
                          type="tel"
                          name="mobile"
                          value={staffMember.mobile}
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Mobile"
                          className="w-6/12 border h-10 pl-2 inline-block text-center"
                          required />
                      <input
                          type="text"
                          name="designation"
                          className="w-6/12 border h-10 pl-2 inline-block text-center"
                          value={staffMember.designation}
                          onChange={(e) => handleChange(e, index)}
                          placeholder="Designation"
                          required />
                      {index > 0 && (
                      <button type="button" onClick={() => handleRemoveStaff(index)} className="text-red-500 pb-2">
                          Remove
                      </button>
                      )}
                  </div>
                  ))}
                  <button type="button" onClick={handleAddStaff} className="text-green-500 pb-2">
                  Add Contact
                  </button>
              </div>
              <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-5">
                  Update Company
              </button>
            </form>
          </div>
        </section>
    </div>
  );
};

export default UserCompany;
