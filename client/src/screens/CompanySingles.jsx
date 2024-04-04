import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import { BACKEND_URL } from "../constans";
import { Helmet } from 'react-helmet';

const CompanySingles = () => {
    const { companyName } = useParams();
    const [company, setCompany] = useState(null);
    const [categories, setCategories] = useState([]);
    const [relatedCompanies, setRelatedCompanies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); 
    const [itemsPerPage] = useState(50); 
    const [loading, setLoading] = useState(true);
    const { userInfo } = useSelector((state) => state.auth);

    const fetchCompanyDetails = async (companyName) => {
        try {
            const response = await fetch(`${ BACKEND_URL }api/companies/${companyName}`);
            const data = await response.json();
            setCompany(data);
            const cat_response = await axios.get(`${ BACKEND_URL }api/categories`);
            setCategories(cat_response.data);
            if (data && data.category_id) {
                const relatedCompaniesResponse = await axios.get(`${ BACKEND_URL }api/companies/category/${data.category_id}/${data._id}`);
                setRelatedCompanies(relatedCompaniesResponse.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching company details:', error);
            setLoading(false);
        }
    };

    useEffect(() => {   
        fetchCompanyDetails(companyName);
    }, [companyName]); 
    
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCompanies = relatedCompanies.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div>
            <Helmet>
                <title>{company.company}</title>
            </Helmet>
            <div className="desktop-1 pt-7">
                <div className="desktop-1-child"></div>        
                <div className="row listing row-tab">
                    <div className="w-3/12"> 
                        <label className="block text-gray-600 text-lg mb-2 font-raleway font-semibold">
                            Categories:
                        </label>
                        <div className="mb-4">              
                            {categories.map((category) => (
                                <div class="" key={category._id}>
                                    <Link to={`/categories/${category.name}`} >
                                        <label class="font-lato text-gray-600 text-sm">{category.name}</label>
                                    </Link>                  
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-9/12 related_lab">
                        {company && (
                            <label className="">
                                <b class="relative featured-companies font-raleway mb-3 text-2xl font-semibold text-gray-600 bg-white pr-1.5 z-10 inline-block">{company.company}</b>
                                <p class="text-gray-700 font-lato text-sm ml-2">
                                    <Link to={'/subscribe'}>Click here to subscribe to PalmOil Directory.com</Link> - Largest Marketplace of companies in 
                                </p><p class="text-gray-700 font-lato text-sm">Palm Oil Industry.</p>
                                <b class="relative featured-companies font-raleway mt-3 mb-3 text-2xl font-semibold text-gray-600 bg-white pr-1.5 z-10 inline-block">Related Companies</b>
                            </label>
                        )}
                        {loading ? (
                            <div className="spinner"></div> 
                        ) : (
                            <>
                                {Array.isArray(currentCompanies) && currentCompanies.length > 0 ? (
                                    <>
                                        {currentCompanies.map((company, index) => (
                                            <div className="listing row-tab" key={company._id}>
                                                <div className="w-8/12 inline-block my-2">
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
                                                        <h3><b>{company.categoryName}</b></h3>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {relatedCompanies.length > itemsPerPage && (
                                        <ReactPaginate
                                            pageCount={Math.ceil(relatedCompanies.length / itemsPerPage)}
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

export default CompanySingles;
