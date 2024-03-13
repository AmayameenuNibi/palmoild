import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const CategorySingle = () => {
    const { categoryName } = useParams();
    const [companies, setCompanies] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); 
    const [itemsPerPage] = useState(10); 

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch(`/api/categories/${categoryName}`);
                const data = await response.json();
                setCompanies(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCompanies();
    }, [categoryName]);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };
    const indexOfLastItem = (currentPage + 1) * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCompanies = companies.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className='body-content'>
            <>
            {Array.isArray(currentCompanies) && currentCompanies.length > 0 ? (
                <>
                    {currentCompanies.map((company, index) => (
                        <div className="row listing row-tab">
                            <div className="col-md-12">
                                <div className="first_top">
                                    <span className="floater singe">{index+1 + (currentPage* itemsPerPage)}</span>
                                    <div className="white_">
                                        <h3><b key={company._id}>
                                        <Link to={`/companies/${company.company_slug}`}>{company.company}</Link>
                                        </b></h3>
                                    </div>
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
                <p></p>
            )}
            </>
        </div>
    );
};

export default CategorySingle;
