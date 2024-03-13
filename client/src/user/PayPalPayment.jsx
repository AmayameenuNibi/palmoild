import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { setCredentials } from "../slices/authSlice";
import { toast } from 'react-toastify';
import { useSubscribeMutation } from "../slices/usersApiSlice";
import emailjs from '@emailjs/browser';

const PayPalButton = () => {
    const [formData, setFormData] = useState({
        company: '',
        address: '',
        country_id: '',
        mobile: '',
    });
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

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
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
                const countriesResponse = await axios.get('/api/countries');
                setCountries(countriesResponse.data);
            } catch (error) {
                console.error('Error fetching countries and categories:', error);
            }
        };

        fetchCountriesAndCategories();
    }, []);

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
                        
                        emailjs.send('service_vnf567f', 'template_lhgje57', templateParams).then(
                            (response) => {
                                console.log('SUCCESS!', response.status, response.text);
                            },
                            (error) => {
                                console.log('FAILED...', error);
                            },
                        );
                        navigate('/');
                        // handleSubmits(details.id);
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
        <div className="relative bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">           	  
            <div className="mt-10">                
                <div className="update-block" style={{ display: userInfo.company ? 'none' : 'block' }}>
                    <div>
                        <h3 className="font-bold text-2xl">Members Register</h3>
                    </div>
                    <form className="flex flex-col" onSubmit={handleSubmit}>
                        <div className="mb-6 pt-3 rounded bg-gray-200">
                            <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="Company Name" > Company Name </label>
                            <input 
                                type="text" 
                                name="company" 
                                id="company" 
                                value={formData.company}
                                onChange={handleInputChange}
                                className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3"
                                required/>
                        </div>
                        <div className="mb-6 pt-3 rounded bg-gray-200">
                            <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="Address" > Address </label>
                            <input 
                                type="text" 
                                name="address" 
                                id="address" 
                                value={formData.address}
                                onChange={handleInputChange}
                                className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3"
                                required/>
                        </div>
                        <div className="mb-6 pt-3 rounded bg-gray-200">
                            <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="Country" > Country </label>
                            <select
                                id="country_id"
                                className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3"
                                required
                                type="text"
                                name="country_id"
                                value={formData.country_id}
                                onChange={handleInputChange}
                            >
                                <option className="text-white" value="">
                                    Country *
                                </option>
                                {countries.map((country) => (
                                    <option key={country._id} value={country._id}>
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-6 pt-3 rounded bg-gray-200">
                            <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="Mobile" > Mobile </label>
                            <input 
                                type="text" 
                                name="mobile" 
                                id="mobile"                           
                                value={formData.mobile}
                                onChange={handleInputChange}
                                className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3"
                                required/>
                        </div>
                        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200" type="submit">
                            Next
                        </button>           
                    </form>
                </div>  
                <div className="payment-block" style={{ display: userInfo.company ? 'block' : 'none' }}>
                    <div id="paypal-button-container"></div> 
                </div>          
            </div>
        </div>          
    );
};

export default PayPalButton;