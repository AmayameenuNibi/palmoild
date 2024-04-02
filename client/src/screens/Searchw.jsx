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
  const [featuredCompanies, setFeaturedcompanies] = useState([]);

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompanies = companies.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const checkIsFavorite = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/favorites/check/${selectedCompany._id}/${userInfo._id}`);
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
      const response = await axios.get(`http://localhost:5000/api/companies`);
      setCompanies(response.data);
      setLoading(false);
      const featureresponse = await axios.get(`http://localhost:5000/api/companies/featuredlist`);
      setFeaturedcompanies(featureresponse.data);
      const cat_response = await axios.get(`http://localhost:5000/api/categories`);
      setCategories(cat_response.data);
      const countriesResponse = await axios.get(`http://localhost:5000/api/countries`);
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
      let url = `http://localhost:5000/api/companies/search`;
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
        await axios.delete(`http://localhost:5000/api/favorites/delete/${selectedCompany._id}/${userInfo._id}`);
      } else {
        await axios.post(`http://localhost:5000/api/favorites/add/${selectedCompany._id}/${userInfo._id}`);
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
        <div className="mb-10">
          <div className="frame-c">          
            <input 
              class="text-lg"
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Products, Companies" />
            <div className="frame-c-child"></div>
            <div className="frame-d"></div>
            <button 
              class="bg-green-400 p-5 text-white text-lg" 
              onClick={() => handleSearch(searchTerm, selectedCategories, selectedCountries)}>
              Search
            </button>
            <button onClick={downloadSearchResultsAsExcel}>Excel</button>
          </div>
        </div>
        
        <div className="row listing row-tab">
          <div className="w-3/12"> 
            <div className="mb-4 max-h-96 overflow-y-auto">
              <label className="block text-gray-600 text-lg mb-2">
                Categories:
              </label>
              <div class="mb-2" key="AllCategories">
                <input 
                  type="checkbox" 
                  id="AllCategories" 
                  name="AllCategories" 
                  checked={selectedCategories.includes("All")}
                  onChange={() => handleCategoryChange("All")} />
                <label class="text-gray-800 ml-2" htmlFor="AllCategories">All Categories</label>
              </div>
              {categories.map((category) => (
                <div class="mb-2" key={category._id}>
                  <input type="checkbox" id={category._id} name={category._id}
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => handleCategoryChange(category._id)}
                  />
                  <label class="text-gray-500 ml-2" htmlFor={category._id}>{category.name}</label>
                </div>
              ))}
            </div>
            <label className="block text-gray-600 text-lg mb-2">
                Countries:
            </label>
            <div className="mb-4 max-h-96 overflow-y-auto">              
              <div class="mb-2" key="AllCountries">
                <input type="checkbox" id="AllCountries" name="AllCountries" checked={selectedCountries.includes("All")}
                  onChange={() => handleCountryChange("All")}
                />
                <label className="text-gray-800 ml-2" htmlFor="AllCountries">All Countries</label>
              </div>
              {countries.map((country) => (
                <div class="mb-2" key={country._id}>
                  <input type="checkbox" id={country._id} name={country._id}
                    checked={selectedCountries.includes(country._id)}
                    onChange={() => handleCountryChange(country._id)}
                  />
                  <label className="text-gray-500 ml-2" htmlFor={country._id}>{country.name}</label>
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
                              <h3><b>
                                <button onClick={() => handleCompanyClick(featured)}>
                                    {featured.company}
                                </button></b></h3>
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
                                <b>
                                  <button onClick={() => handleCompanyClick(company)}>
                                    {company.company}
                                  </button>
                                </b>
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
            <div className="modal-dialog bg-white p-5 z-20">
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
