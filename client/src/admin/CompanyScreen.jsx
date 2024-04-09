import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import default_img from '../images/default.jpg';
import '../css/spinner.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BACKEND_URL } from "../constans";

const CompanyScreen = () => {
    const [currentPage, setCurrentPage] = useState(0); 
    const [itemsPerPage] = useState(20);  
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get(`${ BACKEND_URL }api/companies`);
            setCompanies(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching companies:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);   
    
    const handleDeleteCompany = async (id) => {
        try {
            const confirmDelete = window.confirm('Are you sure you want to delete this company?');
            if (confirmDelete) {
                await axios.delete(`${ BACKEND_URL }api/companies/${id}`);
                fetchCompanies(); 
            }
        } catch (error) {
            console.error('Error deleting company:', error);
        }
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCompanies = companies.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <div className="relative block w-3/4 justify-center px-10 mb-5 mt-2 items-center text-right ">        
                <Link className="text-white font-raleway px-3 py-1.5 text-sm bg-green-500 mt-5 rounded inline-block" to={`/add-company`}>Create Company</Link>  
            </div>
            <div className="relative block md:w-full justify-center px-10 mb-5 mt-5 items-center page-centr" >
                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <div className="spinner"></div> 
                    </div>
                ) : (
                    <>
                        {currentCompanies.length > 0 ? (
                            <div className="table-responsive">
                                <table className="mt-4 w-3/4">
                                    <thead>
                                        <tr>
                                            <th className="font-lato text-gray-600 text-sm p-2">Logo</th>
                                            <th className="font-lato text-gray-600 text-sm p-2">Company Name</th>
                                            <th className="font-lato text-gray-600 text-sm p-2">Category</th>
                                            <th className="font-lato text-gray-600 text-sm p-2">Country</th>
                                            <th className="font-lato text-gray-600 text-sm p-2">Website</th>
                                            <th className="font-lato text-gray-600 text-sm p-2">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentCompanies.map((company) => (
                                            <tr key={company._id}>
                                                <td className="p-2">
                                                    {company.logo.trim() === '' ? (
                                                        <>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <img
                                                                className="font-lato text-gray-600 text-sm p-2"
                                                                src={`${BACKEND_URL}uploads/${company.logo.trim()}`}
                                                                width="75px"
                                                                height="55px"
                                                                alt={company.company}
                                                            />
                                                        </>
                                                    )}
                                                </td>
                                                <td className="font-lato text-gray-600 text-sm p-2">{company.company}</td>
                                                <td className="font-lato text-gray-600 text-sm p-2">{company.categoryName}</td>
                                                <td className="font-lato text-gray-600 text-sm p-2">{company.countryName}</td>
                                                <td className="font-lato text-gray-600 text-sm p-2">{company.website}</td>
                                                <td className="font-lato text-gray-600 text-sm p-2 text-center">
                                                <Link className="font-lato text-sm bg-blue-500 hover:bg-blue-700 text-white py-2 px-2 rounded focus:outline-none focus:shadow-outline md:inline-block"
                                                    to={`/edit-company/${company._id}`}>Edit</Link> 
                                                <button
                                                    onClick={() => handleDeleteCompany(company._id)}
                                                    className="font-lato text-sm bg-red-500 hover:bg-red-700 text-white py-1.5 ml-1 px-2 rounded focus:outline-none focus:shadow-outline md:inline-block">Delete</button>                               
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    
                                </table>
                                <div className='mt-4 w-3/4'>
                                    <ReactPaginate
                                        pageCount={Math.ceil(companies.length / itemsPerPage)}
                                        pageRangeDisplayed={5} 
                                        marginPagesDisplayed={2} 
                                        onPageChange={handlePageChange}
                                        containerClassName={'pagination'}
                                        activeClassName={'active'}
                                    />
                                </div>                                
                            </div>
                        ) : (
                            <div className="text-center p-5">No companies found.</div>
                        )}                      
                    </>
                )}        
            </div>
        </div>
    );
};
export default CompanyScreen;
