import { useState, useEffect,useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import emailjs from '@emailjs/browser';

const RegisterScreen = () => {
  const form = useRef();
  const [countries, setCountries] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    company: '',
    address: '',
    country_id: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });  

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    address: '',
    country_id: '',
    mobile: '',
    password: '',
    confirmPassword: '', 
  });

  const validateForm = () => {
    let isValid = true;
    const emailRegex = /\S+@\S+\.\S+/;
  
    if (!formData.name.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        name: 'Contact name is required',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        name: '',
      }));
    }
  
    if (!formData.email.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        email: 'Email is required',
      }));
      isValid = false;
    } else if (!emailRegex.test(formData.email.trim())) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        email: 'Email format is not correct',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        email: '',
      }));
    }
  
    if (!formData.company.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        company: 'Company name is required',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        company: '',
      }));
    }
  
    if (!formData.address.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        address: 'Address is required',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        address: '',
      }));
    }
  
    if (!formData.country_id.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        country_id: 'Country is required',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        country_id: '',
      }));
    }
  
    if (!formData.mobile.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        mobile: 'Mobile is required',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        mobile: '',
      }));
    }
  
    if (!formData.password.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        password: 'Password is required',
      }));
      isValid = false;
    } else if (formData.password.trim().length < 6) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        password: 'Password must be at least 6 characters long',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        password: '',
      }));
    }
  
    if (!formData.confirmPassword.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        confirmPassword: 'Confirm Password is required',
      }));
      isValid = false;
    } else if (formData.confirmPassword.trim() !== formData.password.trim()) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        confirmPassword: 'Passwords do not match',
      }));
      isValid = false;
    } else {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        confirmPassword: '',
      }));
    }
  
    return isValid;
  };
  
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    const { name, email, password, company, address, country_id, mobile, confirmPassword } = formData;
    try {
      const res = await register({ name, email, password, address, country_id, mobile, company }).unwrap();
      dispatch(setCredentials({ ...res }));
      emailjs.sendForm('service_vnf567f', 'template_txjuzpt', event.target, {
        name: name,
        email: email,
        password: password,
        publicKey: 'FA8La9Btl7_yGsYcZ',
      }).then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
      navigate("/");
      toast.success('Registration Successful');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message === "User already exists") {
        toast.error("User already exists with this same email id");
      }else if (err.response && err.response.data && err.response.data.message === "company already exists") {
        toast.error("User already exists with this same Company name");
      } else {
        toast.error(err?.data?.message || err.error);
      }
    }    
  };  

  useEffect(() => {
      const fetchCountriesAndCategories = async () => {
        try {
            const countriesResponse = await axios.get('/api/countries');
            setCountries(countriesResponse.data);
        } catch (error) {
            console.error('Error fetching countries and categories:', error);
        }
      };
      fetchCountriesAndCategories();
  }, []);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  return (
    <div className="relative bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div>
          <h3 className="font-bold text-2xl">Members Register</h3>
      </div>	  
      <div className="mt-10">
        <form ref={form}  className="flex flex-col"  onSubmit={handleSubmit}>
          <div className="mb-6 pt-3 rounded bg-gray-200">
            <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="Contact Name" > Contact Name </label>
            <input 
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3" />
              {validationErrors.name && <p className="text-red-500 text-xs italic">{validationErrors.name}</p>}
          </div>
          <div className="mb-6 pt-3 rounded bg-gray-200">
            <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="email" >Email Address </label>
            <input 
              type="text" 
              name="email" 
              id="email" 
              value={formData.email}
              onChange={handleInputChange}
              className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3"/>
              {validationErrors.email && <p className="text-red-500 text-xs italic">{validationErrors.email}</p>}
          </div>
          <div className="mb-6 pt-3 rounded bg-gray-200">
            <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="Company Name" > Company Name </label>
            <input 
              type="text" 
              name="company" 
              id="company" 
              value={formData.company}
              onChange={handleInputChange}
              className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3"/>
              {validationErrors.company && <p className="text-red-500 text-xs italic">{validationErrors.company}</p>}
          </div>
          <div className="mb-6 pt-3 rounded bg-gray-200">
            <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="Address" > Address </label>
            <input 
              type="text" 
              name="address" 
              id="address" 
              value={formData.address}
              onChange={handleInputChange}
              className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3"/>
              {validationErrors.company && <p className="text-red-500 text-xs italic">{validationErrors.company}</p>}
          </div>
          <div className="mb-6 pt-3 rounded bg-gray-200">
            <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="Country" > Country </label>
            <select
                id="country_id"
                className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3"
                type="text"
                name="country_id"
                value={formData.country_id}
                onChange={handleInputChange} >
                <option className="text-white" value="">
                    Country *
                </option>
                {countries.map((country) => (
                    <option key={country._id} value={country._id}>
                    {country.name}
                    </option>
                ))}
            </select>
            {validationErrors.country_id && <p className="text-red-500 text-xs italic">{validationErrors.country_id}</p>}
          </div>
          <div className="mb-6 pt-3 rounded bg-gray-200">
            <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="Mobile" > Mobile </label>
            <input 
              type="text" 
              name="mobile" 
              id="mobile"                           
              value={formData.mobile}
              onChange={handleInputChange}
              className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3"/>
              {validationErrors.mobile && <p className="text-red-500 text-xs italic">{validationErrors.mobile}</p>}
          </div>
          <div className="mb-6 pt-3 rounded bg-gray-200">
            <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="password" > Password </label>
            <input 
              type="password" 
              id="password" 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3"/>
              {validationErrors.password && <p className="text-red-500 text-xs italic">{validationErrors.password}</p>}
          </div>
          <div className="mb-6 pt-3 rounded bg-gray-200">
            <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="Confirm Password" > Confirm Password  </label>
            <input 
              type="password" 
              name="confirmPassword" 
              id="confirmPassword" 
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3"/>
              {validationErrors.confirmPassword && <p className="text-red-500 text-xs italic">{validationErrors.confirmPassword}</p>}
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"type="submit">
            Sign In
          </button>
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded-md mt-4 ml-3 hover:bg-red-700">
            Sign in with Google
          </button>
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded-md mt-4 ml-3 hover:bg-blue-700">
              Sign in with LinkedIn
          </button>
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded-md mt-4 ml-3 hover:bg-darkblue-700">
            Sign in with Facebook
          </button>
        </form>
      </div>
    </div>  
  );
};

export default RegisterScreen;
