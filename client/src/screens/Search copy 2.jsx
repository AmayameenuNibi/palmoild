import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import * as XLSX from 'xlsx';
import '../css/spinner.css';

const Search = () => {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isFavoriteCompany, setIsFavoriteCompany] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompanies = companies.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const checkIsFavorite = async () => {
      try {
        const response = await axios.get(`${ BACKEND_URL }api/favorites/check/${selectedCompany._id}/${userInfo._id}`);
        const result = response.data.isFavorite;
        setIsFavoriteCompany(result === "favorite");
      } catch (error) {
        console.error('Error checking favorite:', error);
      }
    };
  
    if (selectedCompany) {
      checkIsFavorite();
    }
  }, [selectedCompany, userInfo]);
  
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${ BACKEND_URL }api/companies`);
      setCompanies(response.data);
      setLoading(false);
      const cat_response = await axios.get(`${ BACKEND_URL }api/categories`);
      setCategories(cat_response.data);
      const countriesResponse = await axios.get(`${ BACKEND_URL }api/countries`);
      setCountries(countriesResponse.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setLoading(false);
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const downloadSearchResultsAsExcel = async () => {
    try {
      const data = companies.map((company, index) => ({
        No: index + 1 + currentPage * itemsPerPage,
        Company: company.company,
        Category: company.categoryName,
        Mobile: company.mobile,
        Country: company.countryName,
        Website: company.website,
      }));
  
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Search Results');
      XLSX.writeFile(workbook, 'palmoilSearch.xlsx');
    } catch (error) {
      console.error('Error downloading Excel file:', error);
    }
  };
  
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === '') { 
      await handleSearch('', selectedCategories, selectedCountries); 
    } else {
      await handleSearch(value, selectedCategories, selectedCountries);
    }
  };
  
  const handleCategoryChange = async (categoryId) => {
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(updatedCategories);
    await handleSearch(searchTerm, updatedCategories, selectedCountries);
  }; 
  
  
  const handleCountryChange = async (countryId) => {
    const updatedCountries = selectedCountries.includes(countryId)
      ? selectedCountries.filter(id => id !== countryId)
      : [...selectedCountries, countryId];
    setSelectedCountries(updatedCountries);
    await handleSearch(searchTerm, selectedCategories, updatedCountries);
  };

  useEffect(() => {
    if(searchTerm === '') {
      fetchCompanies();
    }
  }, []);

  const handleSearch = async (searchTerm, selectedCategories, selectedCountries) => {
    try {
      let url = `${ BACKEND_URL }api/companies/search`;
      const params = new URLSearchParams();      
      params.append('term', searchTerm);
      params.append('category_id', selectedCategories.join(','));
      params.append('country_id', selectedCountries.join(','));
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const response = await axios.get(url);
      setCompanies(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching:', error);
      setLoading(false);
    }
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
  };

  const closeModal = () => {
    setSelectedCompany(null);
  };
  

  const handleAddRemoveFavorite = async () => {
    try {
      if (isFavoriteCompany) {
        await axios.delete(`${ BACKEND_URL }api/favorites/delete/${selectedCompany._id}/${userInfo._id}`);
      } else {
        await axios.post(`${ BACKEND_URL }api/favorites/add/${selectedCompany._id}/${userInfo._id}`);
      }
      setIsFavoriteCompany(!isFavoriteCompany);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };
  

  return (
    <div>
      <div className="desktop-1">
        <div className="desktop-1-child"></div>
        <div className="frame-a mb-10">
          <div className="frame-a-child"></div>
          <h1 className="products-companies">Products, Companies</h1>
          <div className="frame-c">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="search ...."
            />
            <div className="frame-c-child"></div>
            <div className="frame-d"></div>
            <button onClick={() => handleSearch(searchTerm, selectedCategories, selectedCountries)}>
              <i className="fa-brands fa-searchengin"></i>
            </button>
            <button onClick={downloadSearchResultsAsExcel}>Excel</button>
          </div>
        </div>
        
        <div className="row listing row-tab" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr' }}>
          <div className="col-md-3"> {/* This div takes up 1/4 of the width */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Categories:
              </label>
              <div key="AllCategories">
                <input type="checkbox" id="AllCategories" name="AllCategories" checked={selectedCategories.includes("All")}
                  onChange={() => handleCategoryChange("All")}
                />
                <label htmlFor="AllCategories">All Categories</label>
              </div>
              {categories.map((category) => (
                <div key={category._id}>
                  <input type="checkbox" id={category._id} name={category._id}
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => handleCategoryChange(category._id)}
                  />
                  <label htmlFor={category._id}>{category.name}</label>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Countries:
              </label>
              <div key="AllCountries">
                <input type="checkbox" id="AllCountries" name="AllCountries" checked={selectedCountries.includes("All")}
                  onChange={() => handleCountryChange("All")}
                />
                <label htmlFor="AllCountries">All Countries</label>
              </div>
              {countries.map((country) => (
                <div key={country._id}>
                  <input type="checkbox" id={country._id} name={country._id}
                    checked={selectedCountries.includes(country._id)}
                    onChange={() => handleCountryChange(country._id)}
                  />
                  <label htmlFor={country._id}>{country.name}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-9"> {/* This div takes up 3/4 of the width */}
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
                            <span className="floater">{index + 1 + currentPage * itemsPerPage}</span>
                            <div className="white_">
                              <h3>
                                <b>
                                  <button onClick={() => handleCompanyClick(company)}>
                                    {company.company}
                                  </button>
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
                  !loading && <div>No results found. Try a different search.</div>
                )}
              </>
            )}  
          </div>
        </div>              
      </div>

      {selectedCompany && (
        <section className="selectedCompany-modal">
          <div className="modal fade in">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" onClick={closeModal} className="close">×</button>
                </div>
                <div className="modal-body">
                  <div className="simple-div">
                    <h4 className="bd-setails">{selectedCompany.company}</h4>
                    <div className="add-details">
                      <table className="table table-striped">
                        <tbody>
                          <tr>
                            <td>Category</td>
                            <td>{selectedCompany.categoryName}</td>
                          </tr>
                          {selectedCompany.address !== '' && (
                            <tr>
                              <td>Address</td>
                              <td>{selectedCompany.address}</td>
                            </tr>
                          )}
                          <tr>
                            <td>Country</td>
                            <td>{selectedCompany.countryName}</td>
                          </tr>
                          {selectedCompany.website !== '' && (
                            <tr>
                              <td>Website</td>
                              <td>{selectedCompany.website}</td>
                            </tr>
                          )}
                          <tr>
                            <td>Profile</td>
                            <td>{selectedCompany.profile}</td>
                          </tr>
                          {selectedCompany.mobile !== '' && (
                            <tr>
                              <td>
                                <h6><b>Contact Details</b></h6>
                              </td>
                              <td>{selectedCompany.mobile}</td>
                            </tr>
                          )}
                          {selectedCompany.email !== '' && (
                            <tr>
                              <td>Email</td>
                              <td>{selectedCompany.email}</td>
                            </tr>
                          )}
                          <tr>
                            {selectedCompany.email !== '' && (
                              <p>Email: {selectedCompany.email}</p>
                            )}
                            {selectedCompany.twitter_url !== '' && (
                              <p>twitter_url: {selectedCompany.twitter_url}</p>
                            )}
                            {selectedCompany.facebook_url !== '' && (
                              <p>facebook_url: {selectedCompany.facebook_url}</p>
                            )}
                            {selectedCompany.linkedin_url !== '' && (
                              <p>linkedin_url: {selectedCompany.linkedin_url}</p>
                            )}
                            {selectedCompany.insta_url !== '' && (
                              <p>insta_url: {selectedCompany.insta_url}</p>
                            )}
                          </tr>
                          <tr>
                            <td>&nbsp;</td>
                            <td className="float-right">
                              <span><button className="btn btn-success" onClick={() => sendmail(11232)}>Send Mail</button></span>
                              <span><button className="btn btn-primary" onClick={handleAddRemoveFavorite}>{isFavoriteCompany ? 'Remove from Favorites' : 'Add to Favorites'}</button></span>
                              <span><button className="btn btn-danger" onClick={closeModal} data-dismiss="modal">Close</button></span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Search;
