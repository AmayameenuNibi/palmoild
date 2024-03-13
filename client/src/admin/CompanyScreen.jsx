import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import default_img from '../images/default.jpg';
import '../css/spinner.css'

const CompanyScreen = () => {
    const [currentPage, setCurrentPage] = useState(0); 
    const [itemsPerPage] = useState(10);  
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get('/api/companies');
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
                await axios.delete(`/api/companies/${id}`);
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
            <div className="relative block md:w-full justify-center px-10 mb-5 items-center bg-white" >
                <Link className="create-company-btn" to={`/add-company`}>Create Company</Link> 
                <div className="table-responsive">
                    <table className="mt-4 w-3/4 border-collapse border border-gray-400">
                        <thead>
                            <tr>
                                <th className="border border-gray-400 p-2">Logo</th>
                                <th className="border border-gray-400 p-2">Company Name</th>
                                <th className="border border-gray-400 p-2">Category</th>
                                <th className="border border-gray-400 p-2">Country</th>
                                <th className="border border-gray-400 p-2">Website</th>
                                <th className="border border-gray-400 p-2">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <div className="spinner"></div> 
                            ) : (
                                <>
                                    {currentCompanies.map((company) => (
                                        <tr key={company._id}>
                                            <td className="border border-gray-400 p-2">
                                                {!company.logo ? 
                                                <>
                                                    <img style={{ width:'80px', height:'50px' }} src={default_img} />
                                                </>:
                                                <>
                                                    <img src={`http://localhost:5000/uploads/${company.logo}`} width="75px" height="55px" alt={company.company} />
                                                </>
                                                }
                                            </td>
                                            <td className="border border-gray-400 p-2">{company.company}</td>
                                            <td className="border border-gray-400 p-2">Category</td>
                                            <td className="border border-gray-400 p-2">Country</td>
                                            <td className="border border-gray-400 p-2">{company.website}</td>
                                            <td className="border border-gray-400 p-2">
                                            <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                                                to={`/edit-company/${company._id}`}>Edit</Link> 
                                            <button
                                                onClick={() => handleDeleteCompany(company._id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">Delete</button>                               
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
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
    );
};
export default CompanyScreen;
