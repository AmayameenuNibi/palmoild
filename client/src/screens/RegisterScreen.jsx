import { useState, useEffect,useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { BACKEND_URL } from "../constans";
import fb from '../images/fb.png';
import link from '../images/link.png';
import goog from '../images/goog.png';

const RegisterScreen = () => {
  const [showFirstSection, setShowFirstSection] = useState(true);
  const [showSecondSection, setShowSecondSection] = useState(false);
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

  const handleContinueClick = () => {
    const isValid = validateForm();
    if (isValid) {
      setShowFirstSection(false);
      setShowSecondSection(true);
    }   
  };

  const handleBackClick = () => {
      setShowFirstSection(true);
      setShowSecondSection(false);
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
      navigate("/subscribe");
      toast.success('Registration Successful');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message === "User already exists") {
        toast.error("User already exists with this same email id");
        handleBackClick();
      }else if (err.response && err.response.data && err.response.data.message === "company already exists") {
        toast.error("User already exists with this same Company name");
        handleBackClick();
      } else {
        toast.error(err?.data?.message || err.error);
        handleBackClick();
      }
    }    
  };  

  useEffect(() => {
      const fetchCountriesAndCategories = async () => {
        try {
            const countriesResponse = await axios.get(`${ BACKEND_URL }api/countries`);
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

  const handleGoogleAuth = () => {
    try{
      const res = window.open(`${BACKEND_URL}auth/google`, "_self");      
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }    
  };

  const handleLinkedAuth = () => {
    try{
      const res = window.open(`${BACKEND_URL}auth/linkedin`, "_self");      
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    } 
  };

  const facebookAuth = () => {
    try{
      const res = window.open(`${BACKEND_URL}auth/facebook`, "_self");      
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }  
  };

  return (
    <div>      
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <section className="bg-white">    
        <div className="container mx-auto my-0 w-8/12 pt-10">
          <h2 className="font-bold text-2xl text-center font-raleway">Register</h2>
          {showFirstSection && (
          <div className="reg-first-section">
            <div className="StepIndicator mt-8 mb-10">
              <div className="StepText">
                <span className="Number ">Step 1</span>
                <div className="Line" />
              </div>
            </div>
            <div className="social_bt mt-8 text-center">
              <button
                type="submit"
                className="w-3.4/12 rounded-md border font-raleway text-gray-600 text-sm px-6 py-3 mr-2 mt-4 sig font-semibold"
                onClick={handleGoogleAuth} > <img src={goog} alt="Google" className="pr-2"/>
                Sign in with Google
              </button>
              {/* <button
                type="submit"
                className="w-3.4/12 rounded-md border font-raleway text-gray-600 text-sm px-6 py-3 mx-2 mt-4 sig font-semibold"
                onClick={handleLinkedAuth} > 
                <img src={link} alt="Linked In" className="pr-2"/>
                  Sign in with LinkedIn
              </button> */}
              <button
                type="submit"
                className="text-center w-3.4/12 rounded-md border font-raleway text-gray-600 text-sm ml-2 px-6 py-3 mt-4 mb-4 sig font-semibold"
                onClick={facebookAuth} > <img src={fb} alt="Facebook" className="pr-2"/>
                Sign in with Facebook
              </button>
            </div>
            <div className="or_with pl-5 mr-5 text-center relative my-5"><p className="font-lato text-sm text-gray-500">Or with email</p></div>
          </div>
          )}
          <form className="mt-8" ref={form}  onSubmit={handleSubmit}>
          {showFirstSection && (
            <div className="reg-first-section">
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="text"
                  name="name"
                  id="name"
                  placeholder='Contact Name  *'
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold" />
                  {validationErrors.name && <p className="text-red-500 text-xs italic">{validationErrors.name}</p>}
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  placeholder='Email Address  *'
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                  {validationErrors.email && <p className="text-red-500 text-xs italic">{validationErrors.email}</p>}
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="text" 
                  name="company" 
                  id="company" 
                  placeholder='Company  *'
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                  {validationErrors.company && <p className="text-red-500 text-xs italic">{validationErrors.company}</p>}
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="text" 
                  name="address" 
                  id="address" 
                  placeholder='Address  *'
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                  {validationErrors.address && <p className="text-red-500 text-xs italic">{validationErrors.address}</p>}
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                <select
                    id="country_id"
                    className="w-full rounded border px-6 py-3 font-lato text-gray-400 text-sm focus:outline-none font-semibold"
                    type="text"
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleInputChange} >
                    <option className="text-sm font-lato text-gray-600 font-semibold" value="">
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
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="text" 
                  name="mobile" 
                  id="mobile" 
                  placeholder="Mobile Number  *"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                  {validationErrors.mobile && <p className="text-red-500 text-xs italic">{validationErrors.mobile}</p>}
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="password" 
                  id="password" 
                  name="password"
                  placeholder="Password  *"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                  {validationErrors.password && <p className="text-red-500 text-xs italic">{validationErrors.password}</p>}
              </div>
              <div className="w-6/12 inline-block pr-4 pb-4">
                <input 
                  type="password" 
                  name="confirmPassword" 
                  id="confirmPassword"
                  placeholder= "Confirm Password  *"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                  {validationErrors.confirmPassword && <p className="text-red-500 text-xs italic">{validationErrors.confirmPassword}</p>}
              </div>
              <div className="my-5 mr-3.5 text-center">
                <button className="w-5/12 text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"
                    onClick={handleContinueClick} > Continue </button>
              </div> 
            </div>  
            )}                       
            <div className={`reg-second-section ${showSecondSection ? '' : 'hidden'}`}>
              <div className="StepIndicator mt-8 mb-10">
                <div className="StepText">
                  <span className="Number ">Step 2</span>
                  <div className="Line" />
                </div>
              </div>
              <div className="payment-box">
                  <div className="box" id="freeBox">
                      <h4  className="font-raleway mb-3.5 text-lg text-center font-semibold text-gray-600 mt-10">Basic</h4>
                      <h2 className="font-bold text-2xl text-center font-raleway mb-1">Free</h2>
                      <p className="text-center text-sm mt-2">(only for one month)</p>
                      <div class="my-6 mx-6 text-center">
                        <input class="w-12/12 text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 px-12 rounded shadow-lg hover:shadow-xl transition duration-200" 
                        type="submit" name="yt0" id="signupButton" value="Get Started" />
                      </div>
                      <hr />
                      <p className="text-gray-600 font-lato text-sm text-center mt-3">Description of paid option</p>
                      <p className="text-gray-600 font-lato text-sm text-center">Description of paid option</p>
                      <p className="text-gray-600 font-lato text-sm text-center">Description of paid option</p>
                      <p className="text-gray-600 font-lato text-sm text-center">Description of paid option</p>
                      <p className="text-gray-600 font-lato text-sm text-center">Description of paid option</p>     
                  </div>
                  <div class="box" id="paidBox">
                    <h4 class="font-raleway mb-3.5 text-center  text-lg font-semibold text-gray-600">Premium</h4>
                    <s class="text-center text-sm mt-2 px-14 ">normally $100/ year</s>
                    <h2 class="font-bold text-2xl text-center font-raleway mt-5 mb-1">$74.95/ year</h2>
                    <p class="text-center text-sm mt-2 mb-6">(billed annually)</p>
                    <p class="pricing-discount text-center text-sm mt-6">$26.05 savings*</p>
                    <div class="my-6 mx-6 text-center">
                      <input class="w-12/12 text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 px-12 rounded shadow-lg hover:shadow-xl transition duration-200" 
                      type="submit" name="yt0" id="signupButton" value="Get Started" />
                    </div>
                    <hr />
                    <p class="text-gray-600 font-lato text-sm text-center mt-3">Description of paid option</p>
                    <p class="text-gray-600 font-lato text-sm text-center">Description of paid option</p>
                    <p class="text-gray-600 font-lato text-sm text-center">Description of paid option</p>
                    <p class="text-gray-600 font-lato text-sm text-center">Description of paid option</p>
                    <p class="text-gray-600 font-lato text-sm text-center">Description of paid option</p>
                  </div>
              </div>
              <div className="my-5 mr-3.5 text-center">
                <a href="#" onClick={handleBackClick}>Back</a>                
              </div>
            </div>            
          </form>
        </div>
      </section> 
    </div> 
  );
};

export default RegisterScreen;
