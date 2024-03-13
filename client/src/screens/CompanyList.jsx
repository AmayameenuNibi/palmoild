import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import '../css/spinner.css'

const CompanyList = () => {
    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); 
    const [itemsPerPage] = useState(10); 

    useEffect(() => {
        fetchCompanies();
    }, []);

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

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCompanies = companies.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className='body-content'>
            {loading ? (
                <div className="spinner"></div> 
            ) : (
                <>
                    {Array.isArray(currentCompanies) && currentCompanies.length > 0 ? (
                        <>
                            {currentCompanies.map((company, index) => (
                                <div className="row listing row-tab" key={company._id}>
                                    <div className="col-md-8">
                                        <div className="first_top">
                                            <span className="floater">{index+1 + (currentPage* itemsPerPage)}</span>
                                            <div className="white_">
                                                <h3>
                                                    <b>
                                                        <Link to={`/companies/${company.company_slug}`}>
                                                            {company.company}
                                                        </Link>
                                                    </b>
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="second_left"></div>
                                        <div className="brown">
                                            <h3><b>{company.categoryName}</b></h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {companies.length > itemsPerPage && (
                                <ReactPaginate
                                    pageCount={Math.ceil(companies.length / itemsPerPage)}
                                    pageRangeDisplayed={5} 
                                    marginPagesDisplayed={2} 
                                    onPageChange={handlePageChange}
                                    containerClassName={'pagination'}
                                    activeClassName={'active'}
                                />
                            )}
                        </>
                    ) : (
                        <p>No companies available.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default CompanyList;
