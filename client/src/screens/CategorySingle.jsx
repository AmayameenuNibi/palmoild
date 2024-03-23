import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BACKEND_URL } from "../constans";
import '../css/spinner.css'

const CategorySingle = () => {
    const { categoryName } = useParams();
    const [companies, setCompanies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); 
    const [itemsPerPage] = useState(20); 
    const [loading, setLoading] = useState(true);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch(`${ BACKEND_URL }api/categories/${categoryName}`);
                const data = await response.json();
                setCompanies(data);
                const Catresponse = await axios.get(`${ BACKEND_URL }api/categories`);
                setCategories(Catresponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setLoading(false);
            }
        };

        fetchCompanies();
    }, [categoryName]);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    let currentCompanies = [];
    if (Array.isArray(companies) && companies.length > 0) {
        const indexOfLastItem = (currentPage + 1) * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        currentCompanies = companies.slice(indexOfFirstItem, indexOfLastItem);
    }

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
                        <label className="block text-gray-600 text-lg mb-2">
                            {categoryName}
                        </label>
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

export default CategorySingle;
