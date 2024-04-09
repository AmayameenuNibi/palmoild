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
import mobile_logo from '../images/logo-dark.png';
import fb from '../images/fb.png';
import link from '../images/link.png';
import goog from '../images/goog.png';

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
        navigate('/search');
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
      <div className='w-full text-gray-700'>
        <div className="row responsive_">
          <div className="responsive-head">
            <div className="relative logoim">
              <a  href="/"><img src={logo_img} alt="Logo" /></a>
            </div>
            <button
              className="rounded-lg md:hidden focus:outline-none focus:shadow-outline"
              onClick={toggleMenu} >
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                <path xshow={isOpen ? "false" : "true"} fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd"></path>
                <path xshow={isOpen ? "false" : "true"} fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" style={{ display: 'none' }}></path>
              </svg>
            </button>
          </div>
          </div>
          <div className="bg-orange-600 ">
          <div className="row responsive_">
          <nav className={`${ isOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:items-center md:justify-end pb-4 md:pb-0`}>
            {userInfo ? (
              <>
                {userInfo.role === 0 && userInfo.status === 1 ? (
                  <>
                    <Link to="/" className="px-6 py-5 mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-raleway">HOME</Link>
                    <Link to="/search" className="px-6 py-5 mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">SEARCH</Link>
                    <Link to="/company" className="px-6 py-5 mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">MY COMPANY</Link>
                    <Link to="/favorites" className="px-6 py-5 mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">MY FAVOURITES</Link>
                    <a className="popup px-6 py-5 font-semibold mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline" onClick={logoutHandler}>LOGOUT</a>
                  </>
                ) : null}
                {userInfo.role === 0 && userInfo.status === 0 ? (
                  <>
                    <Link to="/" className="px-6 py-5 mt-2 text-sm font-semibold bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-raleway tracking-wide">HOME</Link>
                    <Link to="/about-us" className="px-6 py-5 mt-2 text-sm font-semibold bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-raleway tracking-wide">ABOUT US</Link>
                    <Link to="/companies" className="px-6 py-5 mt-2 text-sm font-semibold bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-raleway tracking-wide">COMPANIES</Link>
                    <Link to="/contact-us" className="px-6 py-5 mt-2 text-sm font-semibold bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-raleway tracking-wide">CONTACT </Link>
                    <a href="/subscribe" className="moving-bt px-10 py-3 mt-2 text-sm text-center bg-yellow-500 text-white md:mt-0 md:ml-4 hover:bg-green-600" >
                      <span></span> <span></span> <span></span> <span></span> SUBSCRIBE
                    </a>
                    <a className="popup px-6 py-5 font-semibold mt-2 text-sm bg-transparent md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline" onClick={logoutHandler}>LOGOUT</a>

                  </>
                ) : null}
                {userInfo.role === 1 ? (
                  <>
                    <Link to="/admin-company" className="px-6 py-5 font-medium mt-2 text-sm bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">COMPANY</Link>
                    <Link to="/admin-users" className="px-6 py-5 font-medium mt-2 text-sm bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">USERS</Link>
                    <Link to="/admin-site" className="px-6 py-5 font-medium mt-2 text-sm bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">SITES</Link>
                    <Link to="/admin-cms" className="px-6 py-5 font-medium mt-2 text-sm bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">CMS</Link>
                    <Link to="/admin-country" className="px-6 py-5 font-medium mt-2 text-sm bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">COUNTRY</Link>
                    <Link to="/admin-category" className="px-6 py-5 font-medium mt-2 text-sm bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline">CATEGORY</Link>
                    <a className="popup px-6 py-5 font-medium mt-2 text-sm bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline" onClick={logoutHandler}>LOGOUT</a>
                  </>
                ) : null}
              </>
              ) : (
                <>
                  <Link to="/" className="px-6 py-5 mt-2 text-sm font-semibold bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-raleway tracking-wide">HOME</Link>
                  <Link to="/register" className="px-6 py-5 mt-2 text-sm font-semibold bg-transparent  md:mt-0 md:ml-0 hover:text-gray-900 text-white focus:outline-none focus:shadow-outline font-raleway tracking-wide">REGISTER</Link>
                  <a className="popup px-6 py-5 text-sm text-center  bg-green-900 text-white md:ml-10 cursor-pointer font-raleway font-semibold" onClick={openPopup}>LOGIN</a>
                </>
              )}                  
          </nav>
        </div>
        </div>
        <section className="popmeup" id="loginme">
          <div className="relative bg-white w-5/12 mx-auto p-8 md:p-12 my-10  shadow-2xl">
            <button
                className="close px-5 py-3 mt-2 text-sm text-center bg-white text-gray-800 font-bold text-2xl"
                onClick={closePopup} > X 
            </button>
            <div>
              <h3 className="font-bold text-2xl text-center font-raleway">Members Login</h3>
            </div>
            <div className="mt-10">
              <div className="text-center">
              <button
                    type="submit"
                    className="w-3.5/12 rounded-md border font-raleway text-gray-600 text-sm px-6 py-3 mx-2 mt-4 sig font-semibold"
                    onClick={handleGoogleAuth}> <img src={goog} alt="Google" className="pr-2"/>
                    Sign in with Google
                  </button>
                  <button
                    type="submit"
                    className="w-3.5/12 rounded-md border font-raleway text-gray-600 text-sm px-6 py-3 mx-2 mt-4 sig font-semibold"> 
                    <img src={link} alt="Linked In" className="pr-2"/>
                      Sign in with LinkedIn
                  </button>
                  <button
                    type="submit"
                    className="text-center w-3.5/12 rounded-md border font-raleway text-gray-600 text-sm mx-2 px-6 py-3 mt-4 mb-4 sig font-semibold"
                    onClick={handleFacebookAuth}> <img src={fb} alt="Facebook" className="pr-2"/>
                    Sign in with Facebook
                  </button>
              </div>
              <div className="or_with mx-5 text-center relative my-5">
                <p className="font-lato text-sm text-gray-500">Or with email</p>
              </div>
              <form className="flex flex-col flex-respn"  onSubmit={submitHandler}>
                <div className="mb-2 pt-3 flex">
                  <input 
                    htmlFor="email" 
                    name="email"
                    type="text" 
                    id="email" 
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold mx-5"/>
                    {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
                </div>
                <div className="mb-3 pt-3 flex">
                  <input 
                    type="password" 
                    htmlFor="password"
                    id="password" 
                    placeholder='Password'
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded border px-6 py-3 font-lato text-gray-600 text-sm focus:outline-none font-semibold mx-5"/>
                    {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
                </div>
              <div className="flex flex-col text-right">
                <label className="mx-5 mb-8 font-lato text-green-600 text-sm" onClick={handleClick}>Forget password?</label>
              </div>
                <button className="mx-5 text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md shadow-lg hover:shadow-xl transition duration-200" type="submit">
                  Sign In
                </button>                
              </form>
            </div>
          </div>
        </section>  
      </div>       
    </header>
  );
};

export default Header;
