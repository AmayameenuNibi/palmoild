import { useState, React} from 'react'
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import { BACKEND_URL } from "../constans";

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
            await axios.post(`${ BACKEND_URL }api/users/newpassword/${token}`, FormData);
            
            navigate('/');          
        } catch (error) {
            console.error('Error adding password:', error);
        }
    };
    return (
        <div className="relative bg-white w-3/12 mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">            <div>
            <h3 className="font-bold text-2xl text-center font-raleway">Reset your password</h3>
        </div>	  
        <div className="mt-5">
            <form className="flex flex-col" onSubmit={handleSubmit}>
                <div className="mb-3 pt-3"><input 
                        type="password" 
                        name="password" 
                        placeholder='New Password' 
                        value={FormData.password}
                        onChange={(e) => setFormData({ ...FormData, password: e.target.value })}
                        required
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                </div>
                <div className="mb-3 pt-3"><input 
                        type="re_password" 
                        name="re_password" 
                        placeholder='Confirm Password'
                        value={FormData.re_password}
                        onChange={(e) => setFormData({ ...FormData, re_password: e.target.value })}
                        required
                        className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold"/>
                </div>
                <button className="mt-3 text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md shadow-lg hover:shadow-xl transition duration-200" type="submit">
                    Send password reset email
                </button>
            </form>
        </div>
    </div>
  );
};

export default NewPassword;
