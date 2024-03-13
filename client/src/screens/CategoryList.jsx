import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CategoryList = () => {
  
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); 
  const [itemsPerPage] = useState(10); 

  const fetchCategories = async () => {
    try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
  };  
  useEffect(() => {
    fetchCategories();
  }, []); 

  const handlePageChange = ({ selected }) => {
      setCurrentPage(selected);
  };
  
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCountries = categories.slice(indexOfFirstItem, indexOfLastItem);
  return (
      <div className='body-content'>
        <h1 className="country-list">Category List</h1>
        <>
        {Array.isArray(currentCountries) && currentCountries.length > 0 ? (
            <>
                {currentCountries.map((category, index) => (
                    <div className="row listing">
                        <div className="col-md-12">
                            <div className="first_top">
                                <span className="floater singe">{index+1 + (currentPage* itemsPerPage)}</span>
                                <div className="white_">
                                    <h3><b key={category._id}>
                                    <Link to={`/categories/${category.name}`}>{category.name}</Link>
                                    </b></h3>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {categories.length > itemsPerPage && (
                    <ReactPaginate
                        pageCount={Math.ceil(categories.length / itemsPerPage)}
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

export default CategoryList;
