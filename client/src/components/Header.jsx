import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import logo_img from '../images/logo.png';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { BACKEND_URL } from "../constans";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [logoutApiCall] = useLogoutMutation();

  const validateForm = () => {
    let isValid = true;
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        setEmailError('Email format is not correct');
        isValid = false;
    } else {
        setEmailError('');
    }
    if (password.length < 6) {
        setPasswordError('Password must be at least 6 characters long');
        isValid = false;
    } else {
        setPasswordError('');
    }
    return isValid;
  };  
  
  const handleClick = () => {
    navigate('/forget-password');
    closePopup(); 
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
        return;
    }
    try {
        const res = await login({ email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        closePopup();
        navigate('/');
        setEmail('');
        setPassword('');
        toast.success('Login Successful');
    } catch (err) {
        toast.error(err?.data?.message || err.error);
    }
  };

  const openPopup = () => {
    const popup = document.getElementById("loginme");
    popup.classList.toggle("show");
  };

  const closePopup = () => {
    document.querySelector('.popmeup').classList.remove('show');
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleAuth = () => {
    try {
      window.location.href = `${ BACKEND_URL }auth/google/callback`;
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleFacebookAuth = () => {
    try {
      window.location.href = `${ BACKEND_URL }auth/facebook`;
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <header>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className='w-full text-gray-700 bg-cream'>
        <div className="row">
          <div className="py-2">
            <div className="relative md:mt-8">
              <a href="/"><img src={logo_img} alt="Logo" /></a>
            </div>
            <button className="rounded-lg md:hidden focus:outline-none focus:shadow-outline"
              onClick={toggleMenu} >
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                <path xshow={isOpen ? "false" : "true"} fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd"></path>
                <path xshow={isOpen ? "false" : "true"} fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" style={{ display: 'none' }}></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="bg-orange-600">
          <div class="row">
            <nav className={`${ isOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:items-center md:justify-end pb-4 md:pb-0`}>
              {userInfo ? (
                <>
                  {userInfo.role === 0 && userInfo.status === 1 ? (
                    <>
                      <Link to="/" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">HOME</Link>
                      <Link to="/search" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">SEARCH</Link>
                      <Link to="/company" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">MY COMPANY</Link>
                      <Link to="/favorites" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">MY FAVOURITES</Link>
                      <a className="popup px-10 py-3 text-sm text-center bg-white text-gray-800 md:ml-10 z-10 cursor-pointer" onClick={logoutHandler}>LOGOUT</a>
                    </>
                  ) : null}
                  {userInfo.role === 0 && userInfo.status === 0 ? (
                    <>
                      <Link to="/" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">HOME</Link>
                      <Link to="/companies" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">COMPANIES</Link>
                      <Link to="/contact-us" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">CONTACT </Link>
                      <a href="/subscribe" className="moving-bt px-10 py-3 mt-2 text-sm text-center bg-yellow-500 text-white md:mt-0 md:ml-4 hover:bg-green-600" >
                        <span></span> <span></span> <span></span> <span></span> SUBSCRIBE
                      </a>
                      <a className="popup px-10 py-3 text-sm text-center bg-white text-gray-800 md:ml-10 z-10 cursor-pointer" onClick={logoutHandler}>LOGOUT</a>
                    </>
                  ) : null}
                  {userInfo.role === 1 ? (
                    <>
                      <Link to="/companies" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">COMPANIES</Link>
                      <Link to="/admin-users" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">USERS</Link>
                      <Link to="/search" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">SEARCH</Link>
                      <Link to="/admin-site" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">SITES</Link>
                      <Link to="/admin-company" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">COMPANY</Link>
                      <Link to="/admin-country" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">COUNTRY</Link>
                      <Link to="/admin-category" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">CATEGORY</Link>
                      <Link to="/admin-cms" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">CMS</Link>
                      <a className="popup px-10 py-3 text-sm text-center bg-white text-gray-800 md:ml-10 z-10 cursor-pointer" onClick={logoutHandler}>Logout</a>
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  <Link to="/" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">HOME</Link>
                  <Link to="/register" className="px-4 py-2 mt-2 text-sm bg-transparent rounded-lg md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">REGISTER</Link>
                  <a className="popup px-10 py-3 text-sm text-center bg-white text-gray-800 md:ml-10 z-10 cursor-pointer" onClick={openPopup}>LOGIN</a>
                </>
              )} 
            </nav>
          </div>
        </div>
        <section className="popmeup" id="loginme">
          <div className="relative bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
            <button
                className="close px-5 py-3 mt-2 text-sm text-center bg-white text-gray-800 font-bold text-2xl"
                onClick={closePopup} > X 
            </button>
            <div>
              <h3 className="font-bold text-2xl">Members Login</h3>
            </div>	  
            <div className="mt-10">
              <form className="flex flex-col"  onSubmit={submitHandler}>
                <div className="mb-6 pt-3 rounded bg-gray-200">
                  <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="email" > Email </label>
                  <input 
                    name="email"
                    type="text" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3"/>
                    {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
                </div>
                <div className="mb-6 pt-3 rounded bg-gray-200">
                  <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" htmlFor="password" > Password </label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-green-600 transition duration-500 px-3 pb-3"/>
                    {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"type="submit">
                  Sign In
                </button>                
              </form>
              <div className="flex flex-col">
                <label className="mt-3 right-label" onClick={handleClick}>Forget password?</label>
                <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-md mt-4 ml-3 hover:bg-red-700"
                    onClick={handleGoogleAuth}>
                    Sign in with Google
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-md mt-4 ml-3 hover:bg-blue-700">
                      Sign in with LinkedIn
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-md mt-4 ml-3 hover:bg-darkblue-700"
                    onClick={handleFacebookAuth}>
                    Sign in with Facebook
                  </button>
                </div>
            </div>
          </div>
        </section>
      </div>       
    </header>
  );
};

export default Header;