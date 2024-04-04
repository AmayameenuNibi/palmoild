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
    const [itemsPerPage] = useState(50); 
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
            <div className="desktop-1 pt-7">
                <div className="desktop-1-child"></div>        
                <div className="row listing row-tab">
                    <div className="w-3/12"> 
                        <label className="block text-gray-600 text-lg mb-5 font-raleway ">
                            <b>Categories:</b>
                        </label>
                        <div className="mb-4">              
                            {categories.map((category) => (
                                <div class="" key={category._id}>
                                    <Link to={`/categories/${category.name.toLowerCase()}`} >
                                        <label class="font-lato text-gray-600 text-sm">{category.name}</label>
                                    </Link>                  
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-9/12">
                        <div className="relative mb-6">
                            <div class="row-tab listing featured">
                            {Array.isArray(featuredCompanies) && featuredCompanies.length > 0 ? (
                                <>
                                    {featuredCompanies.map((featured, index) => (
                                        <div key={featured._id} class="p-4 flex items-center from-white bg-gradient-to-r from-white to-green-200">
                                        <div class="w-8/12 inline-block">
                                          <div class="relative">
                                            <div class="featr">
                                                {userInfo ? (
                                                    <Link class="text-gray-600 font-lato text-sm" to={`/companies/${featured.company_slug}`}>{featured.company}</Link>
                                                ) :(
                                                    <Link class="text-gray-600 font-lato text-sm" to={`/company/${featured.company_slug}`}>{featured.company}</Link>
                                                )}                                                 
                                                <p class="text-gray-600 font-lato text-sm">{featured.mobile}</p>
                                                <p class="text-gray-600 font-lato text-sm">{featured.email}</p>
                                                <p class="text-green-600 font-lato text-sm">{featured.website}</p>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="w-4/12 inline-block text-right">
                                            <div class="brown">
                                                <h3 class="font-lato text-white bg-blue-600 text-xs inline-block px-2 py-1 rounded-sm fe">Featured</h3>
                                            </div>
                                        </div>
                                      </div>
                                    ))}
                                </>
                            ) : (
                                <p></p>
                            )}
                        </div>
                        </div>
                        {loading ? (
                            <div className="spinner"></div> 
                        ) : (
                            <>                            
                            {Array.isArray(currentCompanies) && currentCompanies.length > 0 ? (
                            <>
                                {currentCompanies.map((company, index) => (
                                    <div className="listing row-tab my-3" key={company._id}>
                                        <div className="w-8/12 inline-block">
                                            <div className="first_top">
                                                <div className="white_">
                                                    <h3 class="text-gray-800 text-gray-700 font-lato text-sm">
                                                        {userInfo ? (
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
                                !loading && <div className="font-lato text-sm text-gray-700 pt-10">No results found.</div>
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