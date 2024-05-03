import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { setCredentials } from "../slices/authSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSubscribeMutation } from "../slices/usersApiSlice";
import emailjs from '@emailjs/browser';
import { BACKEND_URL } from "../constans";
import { Helmet } from 'react-helmet';
import paymentbg from '../images/subscribe.png';
import paypal from '../images/paypal-y.png';
import cards from '../images/cards.png';

const PayPalButton = () => {
    const [formData, setFormData] = useState({
        company: '',
        address: '',
        country_id: '',
        mobile: '',
    });
    const [validationErrors, setValidationErrors] = useState({
        company: '',
        address: '',
        country_id: '',
        mobile: '',
      });  
    const [showFirstSection, setShowFirstSection] = useState(true);
    const [showSecondSection, setShowSecondSection] = useState(false);
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [updateProfile, { isLoading }] = useSubscribeMutation();
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const validateForm = () => {
        let isValid = true;       
      
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
      
        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        const isValid = validateForm();
        if (!isValid) {
            return;
        }
        try {
            const res = await updateProfile({
                userId: userInfo._id,
                name:userInfo.name,
                email:userInfo.email,
                country_id: formData.country_id,
                company: formData.company,
                address: formData.address,
                mobile: formData.mobile,
                transactionId: "",
                status:0
            }).unwrap();
            dispatch(setCredentials(res));
            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };
    const handleSubmits = async (transactionId) => {
        try {
            const res = await updateProfile({
                userId: userInfo._id,
                name: userInfo.name,
                email: userInfo.email,
                country_id: userInfo.country_id,
                company: userInfo.company,
                address: userInfo.address,
                mobile: userInfo.mobile,
                transactionId: transactionId,
                status:1
            }).unwrap();
            dispatch(setCredentials(res));
            toast.success("Profile updated successfully");
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };    
    
    const [countries, setCountries] = useState([]);
    
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

    useEffect(() => {
        emailjs.init('FA8La9Btl7_yGsYcZ');
        const script = document.createElement('script');
        script.src = 'https://www.paypal.com/sdk/js?client-id=AeFdz0d8MQjg75gDWKTNiwzE7QppoQazImqNytZvG-wlo-CsMp8TlFAWyz66kT38deC8T-ZvoM_0VE-2';
        script.addEventListener('load', () => {
            window.paypal.Buttons({
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: '10.00' 
                            }
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        const currentDate = new Date();
                        const expiryDate = new Date();
                        expiryDate.setFullYear(expiryDate.getFullYear() + 1); 
                        const formattedCurrentDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
                        const formattedExpiryDate = `${expiryDate.getDate()}-${expiryDate.getMonth() + 1}-${expiryDate.getFullYear()}`;

                        var templateParams = {
                            name: userInfo.name,
                            email: userInfo.email,
                            date:formattedCurrentDate,
                            expiry_date:formattedExpiryDate,
                            amount_paid:'10',
                            transaction_id:details.id, 
                        };
                        handleSubmits(details.id);                        
                        emailjs.send('service_vnf567f', 'template_lhgje57', templateParams).then(
                            (response) => {
                                console.log('SUCCESS!', response.status, response.text);
                            },
                            (error) => {
                                console.log('FAILED...', error);
                            },
                        );
                        navigate('/');
                    });
                },
                onError: function(err) {
                    console.error('Error occurred:', err);
                }
            }).render('#paypal-button-container'); 
        });
        document.body.appendChild(script);
    }, []);

    return (
        <div>
            <Helmet>
                <title>PalmOil Directory, Subscribe</title>
                <meta name="description" content="PalmOil Directory" />
                <meta name="Keywords" CONTENT="palm oil,cpo,commodities,palm kernel oil,carotene,FFB,vegetable oil,lauric acid, milling,MPOPC,MPOB,olein,kernel,PKO,PKS,PORAM,RBD,refining,
                    speciality fats,plantations,refinery,lipids,fatty acids,soap noodles,stearin,stearine,shortening,vanaspati,margarine,malaysia,indonesia,
                    biodiesel,palm biodiesel"/>    
            </Helmet>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <section className="bg-white">    
                <div className="container mx-auto my-0 w-6/12 pt-10" style={{ display: userInfo.company ? 'none' : 'block' }}>
                    <h2 className="font-bold text-2xl text-center font-raleway">Register</h2>
                    {showFirstSection && (
                        <div className="reg-first-section">
                            <div className="StepIndicator mt-8 mb-10">
                            <div className="StepText">
                                <span className="Number ">Step 2</span>
                                <div className="Line" />
                            </div>
                            </div>
                        </div>
                    )}
                    <form className="mt-8"  onSubmit={handleSubmit}>
                        {showFirstSection && (
                            <div className="reg-first-section">
                                <div className="w-8/12 pr-4 pb-4">
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
                                <div className="w-8/12 pr-4 pb-4">
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
                                <div className="w-8/12 pr-4 pb-4">
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
                                <div className="w-8/12 pr-4 pb-4">
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
                                <div className="my-5 mr-3.5 text-center">
                                    <button className="w-8/12 text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"
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
                <div className="relative bg-white w-6/12 mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">           	  
                    <div className="mt-8">                 
                        <section class="popmeup show text-center">
                            <div class="relative w-5/12 mx-auto mt-20 px-10">
                                <img class="w-full p-2" src={paymentbg} alt="subscribe" />
                                <div class="absolute centre">
                                    <h3 class="font-raleway text-gray-700 font-bold text-2xl text-center m-5">Buy Palm Oil Directory</h3>
                                    <div class="strip px-7 py-5">
                                        <h3 class="font-raleway text-gray-600 text-2xl"> USD <span class=" font-bold ">$74.95</span></h3>
                                        <a href="#" class="paypalpay inline-block mt-1" ><img src={paypal} alt="paypal" /> </a>
                                        <img class="carding" src={cards} alt="subscribe" />
                                    </div>

                                    <div class="btn_holder pb-4">
                                        <a href="#" data-toggle="modal" data-target="#myModal" class=" pb-4 float-left font-lato font-bold text-gray-600 text-lg ml-3"><i class="icon-list-alt"></i> View Sample Listing</a>
                                        <a class=" pb-4 font-bold mr-3 float-right font-lato text-gray-600 text-lg" href="#" data-toggle="modal" data-target="#learn-more"><i class="icon-info-sign"></i> Learn More</a>
                                    </div>
                                </div>
                            </div>
                        </section> 
                    </div>
                </div>
            </section> 
        </div>        
    );
};

export default PayPalButton;