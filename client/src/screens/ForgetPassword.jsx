import { useState, React} from 'react'
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const ForgetPassword = () => {
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState('');
    const [FormData, setFormData] = useState({
        email:'',
    });
    const validateForm = () => {
        let isValid = true;
        const emailRegex = /\S+@\S+\.\S+/;
        if (!FormData.email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!emailRegex.test(FormData.email)) {
            setEmailError('Email format is not correct');
            isValid = false;
        } else {
            setEmailError('');
        }
        return isValid;
    };
     
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const response = await axios.post('/api/users/forget-password', FormData);
            const { email, name, resetPasswordToken } = response.data;
            var templateParams = {
                email: email,
                name: name,
                resetPasswordToken: resetPasswordToken,
            };
            emailjs.init('7K6FgornqEudFEBY8');
            emailjs.send('service_n3h3why', 'template_ezd1s82', templateParams).then(
                (response) => {
                    toast.success('Reset email successfully sent to the provided email address.');
                },
                (error) => {
                    toast.error('Failed to send reset email to the provided email address.');
                },
            );
            navigate('/');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message === "account error") {
                toast.error(`The email ${FormData.email} is not associated with any account`);
            } else {
                toast.error(err?.data?.message || err.error);
            }            
        }
    };
    
    return (
       <div className="relative bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <div>
                <h3 className="font-bold text-2xl">Reset your password</h3>
                <h5>Enter your email address and we will send you a new password</h5>
            </div>	  
            <div className="mt-10">
                <form className="flex flex-col" onSubmit={handleSubmit}>
                  <div className="mb-6 pt-3 rounded bg-gray-200">
                    <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="email" > Email </label>
                    <input 
                      type="text" 
                      name="email" 
                      value={FormData.email}
                      onChange={(e) => setFormData({ ...FormData, email: e.target.value })}
                     className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3"/>
                        {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
                  </div>
                  
                  <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"type="submit">
                    Send password reset email
                  </button>
                </form>
            </div>
            </div>
    )
}
export default ForgetPassword;
