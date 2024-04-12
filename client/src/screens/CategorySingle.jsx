import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BACKEND_URL } from "../constans";
import '../css/spinner.css'
import { Helmet } from 'react-helmet';

const CategorySingle = () => {
    const { categoryName } = useParams();
    const [companies, setCompanies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); 
    const [itemsPerPage] = useState(50); 
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
            <Helmet>
                <title>PalmOil Directory, {categoryName}</title>
                <meta name="description" content="PalmOil Directory" />
                <meta name="Keywords" CONTENT="palm oil,cpo,commodities,palm kernel oil,carotene,FFB,vegetable oil,lauric acid, milling,MPOPC,MPOB,olein,kernel,PKO,PKS,PORAM,RBD,refining,
                    speciality fats,plantations,refinery,lipids,fatty acids,soap noodles,stearin,stearine,shortening,vanaspati,margarine,malaysia,indonesia,
                    biodiesel,palm biodiesel"/>    
            </Helmet>
            <div className="desktop-1 pt-7">
                <div className="desktop-1-child"></div>        
                <div className="row listing row-tab">
                    <div className="w-3/12"> 
                        <label className="block text-gray-700 text-lg mb-2 font-raleway  font-semibold">
                            Categories:
                        </label>
                        <div className="mb-4">              
                            {categories.map((category) => (
                                <div className="" key={category._id}>
                                    <Link to={`/categories/${category.slug}`} >
                                        <label className="font-lato text-gray-600 text-sm">{category.name}</label>
                                    </Link>                  
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-9/12">
                        <label className="capitalize relative featured-companies font-raleway mb-1.5 text-2xl font-semibold text-gray-600 bg-white pr-1.5 z-10 inline-block">
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
                                                <div className="w-8/12 inline-block my-1">
                                                    <div className="first_top">
                                                        <div className="white_">
                                                            <h3 className="text-gray-800 text-gray-700 font-lato text-sm">
                                                                {userInfo ? (
                                                                    <Link to={`/company/${company.company_slug}`}>{company.company}</Link>
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

export default CategorySingle;
