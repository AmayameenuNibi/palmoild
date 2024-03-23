import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import '../css/spinner.css'
import { BACKEND_URL } from "../constans";

const CompanyList = () => {
    const [loading, setLoading] = useState(true);
    const [companies, setCompanies] = useState([]);
    const [featuredCompanies, setFeaturedcompanies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); 
    const [categories, setCategories] = useState([]);
    const [itemsPerPage] = useState(20); 
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get(`${ BACKEND_URL }api/companies`);
            setCompanies(response.data);
            const cat_response = await axios.get(`${ BACKEND_URL }api/categories`);
            setCategories(cat_response.data);
            const featureresponse = await axios.get(`${ BACKEND_URL }api/companies/featuredlist`);
            setFeaturedcompanies(featureresponse.data);
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
        <div>
            <div className="desktop-1">
                <div className="desktop-1-child"></div>        
                <div className="row listing row-tab">
                    <div className="w-3/12"> 
                        <label className="block text-gray-600 text-lg mb-2">
                            Categories:
                        </label>
                        <div className="mb-4">              
                            {categories.map((category) => (
                                <div class="mb-2" key={category._id}>
                                    <Link to={`/categories/${category.name.toLowerCase()}`} >
                                        <label class="text-gray-500 ml-2">{category.name}</label>
                                    </Link>                  
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-9/12">
                        <div className="favourites-container">
                            <h1 className="featured-companies">Featured Companies</h1>
                            {Array.isArray(featuredCompanies) && featuredCompanies.length > 0 ? (
                                <>
                                    {featuredCompanies.map((featured, index) => (
                                        <div key={featured._id} class="row listing featured from-white bg-gradient-to-r from-white to-green-200 border border-slate-500">
                                        <div class="col-md-8">
                                          <div class="first_top">
                                            <div class="white_">
                                                {userInfo.status === 1 ? (
                                                    <Link to={`/companies/${featured.company_slug}`}>{featured.company}</Link>
                                                ) :(
                                                    <Link to={`/company/${featured.company_slug}`}>{featured.company}</Link>
                                                )}                                                 
                                                <p>{featured.mobile}</p>
                                                <p>{featured.email}</p>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="second_left"></div>
                                            <div class="brown">
                                                <h3><b>Featured</b></h3>
                                            </div>
                                        </div>
                                      </div>
                                    ))}
                                </>
                            ) : (
                                <p></p>
                            )}
                        </div>
                        {loading ? (
                            <div className="spinner"></div> 
                        ) : (
                            <>                            
                            {Array.isArray(currentCompanies) && currentCompanies.length > 0 ? (
                            <>
                                {currentCompanies.map((company, index) => (
                                    <div className="listing row-tab" key={company._id}>
                                        <div className="w-8/12 inline-block">
                                            <div className="first_top">
                                                <div className="white_">
                                                    <h3>
                                                        {userInfo.status === 1 ? (
                                                            <Link to={`/companies/${company.company_slug}`}>{company.company}</Link>
                                                        ) :(
                                                            <Link to={`/company/${company.company_slug}`}>{company.company}</Link>
                                                        )}                                                        
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-4/12 inline-block">
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
                                !loading && <div>No companies found in this category.</div>
                            )}
                            </>
                        )}  
                    </div>
                </div>              
            </div>
        </div>
    );
};
export default CompanyList;