import { useState, React} from 'react'
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewPassword = () => {
    const { token } = useParams();     
    const navigate = useNavigate();   
    const [FormData, setFormData] = useState({
        password:'',
        re_password:'',
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/users/newpassword/${token}`, FormData);
            
            navigate('/');          
        } catch (error) {
            console.error('Error adding password:', error);
        }
    };
    return (
        <div className="relative bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">            <div>
            <h3 className="font-bold text-2xl">Reset your password</h3>
        </div>	  
        <div className="mt-10">
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <div className="mb-6 pt-3 rounded bg-gray-200">
                    <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="password" > New Password </label>
                    <input 
                        type="password" 
                        name="password" 
                        value={FormData.password}
                        onChange={(e) => setFormData({ ...FormData, password: e.target.value })}
                        required
                        className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3"/>
                </div>
                <div className="mb-6 pt-3 rounded bg-gray-200">
                    <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="email" > Confirm Password </label>
                    <input 
                        type="re_password" 
                        name="re_password" 
                        value={FormData.re_password}
                        onChange={(e) => setFormData({ ...FormData, re_password: e.target.value })}
                        required
                        className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3"/>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"type="submit">
                    Send password reset email
                </button>
            </form>
        </div>
    </div>
  );
};

export default NewPassword;
