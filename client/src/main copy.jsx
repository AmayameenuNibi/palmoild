import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './css/style.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import store from './store';
import { Provider } from 'react-redux';
import CountryScreen from './admin/CountryScreen.jsx';
import SiteScreen from './admin/SiteScreen.jsx';
import CategoryScreen from './admin/CategoryScreen.jsx';
import CompanyScreen from './admin/CompanyScreen.jsx';
import AddCompany from './admin/AddCompany.jsx';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import ContactScreen from './screens/ContactScreen.jsx';
import AboutScreen from './screens/AboutScreen.jsx';
import CategoryList from './screens/CategoryList.jsx'
import CategorySingle from './screens/CategorySingle.jsx';
import CountryList from './screens/CountryList.jsx';
import CountrySingle from './screens/CountrySingle.jsx';
import CompanyList from './screens/CompanyList.jsx';
import CompanySingle from './screens/CompanySingle.jsx';
import UserCompany from './user/UserCompany.jsx';
import Users from './user/Users.jsx';
import Search from './screens/Search.jsx';
import Payment from './user/PayPalPayment.jsx';
import ForgetPassword from './screens/ForgetPassword.jsx';
import NewPassword from './screens/NewPassword.jsx';
import NotFound from "./screens/NotFoundPage.jsx";
import '@fortawesome/fontawesome-free/css/all.min.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/admin-country' element={<CountryScreen />} />
      <Route path='/admin-company' element={<CompanyScreen />} />
      <Route path='/admin-site' element={<SiteScreen />} />
      <Route path='/admin-category' element={<CategoryScreen />} />
      <Route path='/contact' element={<ContactScreen />} />
      <Route path='/about' element={<AboutScreen />} />
      <Route path='/categories' element={<CategoryList />} />
      <Route path="/categories/:categoryName" element={<CategorySingle />} />      
      <Route path='/countries' element={<CountryList />} />
      <Route path="/countries/:countryName" element={<CountrySingle />} />
      <Route path='/companies' element={<CompanyList />} />
      <Route path="/companies/:companyName" element={<CompanySingle />} />
      <Route path='/company' element={<UserCompany />} />
      <Route path='/add-company' element={<AddCompany />} />
      <Route path='/edit-company/:companyId' element={<AddCompany />} />
      <Route path='/admin-users' element={<Users />} />
      <Route path='/search' element={<Search />} />
      <Route path='/subscribe' element={<Payment />} />
      <Route path='/forget-password' element={<ForgetPassword />} />
      <Route path="/user/newpassword/:token" element={<NewPassword/>} />
      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<ProfileScreen />} />
      </Route>
      <Route  element={<NotFound />} /> 
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
