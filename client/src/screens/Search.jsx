import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import * as XLSX from 'xlsx';
import { BACKEND_URL } from '../constans';
import '../css/spinner.css';
import buttonimage from '../images/download.png';

const Search = () => {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(50);
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
      const featureresponse = await axios.get(`${ BACKEND_URL }api/companies/featuredlist`);
      setFeaturedcompanies(featureresponse.data);
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

  const handleCategoryChange = async (categoryId) => {
    if (categoryId === "All") {
      if (selectedCategories.length === categories.length) {
        setSelectedCategories([]);
      } else {
        setSelectedCategories(categories.map(category => category._id));
      }
      await handleSearch(searchTerm, selectedCategories, selectedCountries);
    } else {
      const updatedCategories = selectedCategories.includes(categoryId)
        ? selectedCategories.filter(id => id !== categoryId)
        : [...selectedCategories, categoryId];
      setSelectedCategories(updatedCategories);
      await handleSearch(searchTerm, updatedCategories, selectedCountries);
    }    
  }; 
    
  const handleCountryChange = async (countryId) => {
    if (countryId === "All") {
      if (selectedCountries.length === countries.length) {
        setSelectedCountries([]);
      } else {
        setSelectedCountries(countries.map(country => country._id));
      }
      await handleSearch(searchTerm, selectedCategories, selectedCountries);
    } else {
      const updatedCountries = selectedCountries.includes(countryId)
        ? selectedCountries.filter(id => id !== countryId)
        : [...selectedCountries, countryId];
      setSelectedCountries(updatedCountries);
      await handleSearch(searchTerm, selectedCategories, updatedCountries);
    }      
  };

  return (
    <div>
      <div className="desktop-1 pt-7 respons_search">
        <div className="row">
          <div className="w-3/12 pr-3.5">
            <h4 className="font-raleway mb-3.5 text-lg font-semibold text-gray-600">Refine Your Results</h4>
          </div>
          <div className="w-9/12 px-4 search pr-0">          
            <input 
              className="text-sm px-2.5 py-2 mb-2 text-gray-400 border border-gray-400 w-9/12 rounded-sm font-lato"
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Products, Companies" />
            <span className="w-3/12 text-right inline-block"><i className="icon-email2"></i><button 
              className="bg-lime-500 text-white text-sm px-5 mx-1 py-2 border border-lime-500 hover:bg-green-500 rounded" 
              onClick={() => handleSearch(searchTerm, selectedCategories, selectedCountries)}>
              Search
            </button>
            <button className="let bg-slate-50 text-sm mx-1 px-5 py-2 text-gray-800 border border-gray-200 rounded hover:text-gray-500" onClick={downloadSearchResultsAsExcel}><img src={buttonimage} alt="download" /> Export</button></span>
          </div>
        </div>
        
        <div className="row listing row-tab">
          <div className="w-3/12 pr-3.5"> 
            <div className="mb-4 max-h-96 overflow-y-auto">
            <div className="mb-2" key="AllCategories">
                <input
                  className="py-1 w-4 inline-block text-sm mr-2"
                  type="checkbox"
                  id="AllCategories"
                  name="AllCategories"
                  checked={selectedCategories.length === categories.length}
                  onChange={() => handleCategoryChange("All")}
                />
                <label
                  className="ml-2 text-gray-600 ml-2 font-lato text-sm tracking-wider font-semibold"
                  htmlFor="AllCategories"
                >
                  All Categories
                </label>
              </div>
              {categories.map((category) => (
                <div className="mb-2" key={category._id}>
                  <input
                    className="py-1  w-4 inline-block text-sm mr-2"
                    type="checkbox"
                    id={category._id}
                    name={category._id}
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => handleCategoryChange(category._id)}
                  />
                  <label
                    className="text-gray-500 ml-2 ml-2 font-lato text-sm tracking-widest"
                    htmlFor={category._id}
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
            <label className="block text-gray-700 text-lg mb-2 font-raleway">
                <b>Countries:</b>
            </label>
            <div className="mb-4 max-h-96 overflow-y-auto">              
              <div className="mb-2" key="AllCountries">
                <input className="py-1  w-4 inline-block text-sm mr-2" 
                  type="checkbox" 
                  id="AllCountries" 
                  name="AllCountries" 
                  checked={selectedCountries.length === countries.length}
                  onChange={() => handleCountryChange("All")}
                />
                <label className="text-gray-500 ml-2 font-lato text-sm tracking-wider" htmlFor="AllCountries">All Countries</label>
              </div>
              {countries.map((country) => (
                <div className="mb-2" key={country._id}>
                  <input className="py-1  w-4 inline-block text-sm mr-2" type="checkbox" id={country._id} name={country._id}
                    checked={selectedCountries.includes(country._id)}
                    onChange={() => handleCountryChange(country._id)}
                  />
                  <label className="text-gray-500 ml-2 ml-2 font-lato text-sm tracking-wider" htmlFor={country._id}>{country.name}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="w-9/12 px-4 pr-0">
            <div className="favourites-container relative">
              <h4 className="text-lg z-10 mt-2 relative featured-companies font-raleway mb-2  font-semibold text-gray-600 bg-white pr-1.5 inline-block">Featured Companies</h4>
              <div className="row-tab listing featured from-white bg-gradient-to-r from-white to-green-300 border border-slate-500">
              {Array.isArray(featuredCompanies) && featuredCompanies.length > 0 ? (
                <>
                    {featuredCompanies.map((featured, index) => (
                      <div key={featured._id} className="border-b-1 border-l-4 p-3 m-1.5 mb-3 ml-0 border-gray-400">
                        <div className="w-8/12 inline-block">
                          <div className="relative">
                            <div className="white_">
                              <h3 className="font-lato text-black font-bold">
                                <button className="text-md font-lato text-gray-900 font-semibold hover:underline " onClick={() => handleCompanyClick(featured)}>
                                    {featured.company}
                                </button></h3>
                            </div>
                          </div>
                        </div>
                        <div className="w-4/12 inline-block text-right">
                            <div className="brown">
                                <h3 className="text-md font-lato font-semibold text-gray-900">Featured</h3>
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
                      <div className="listing row-tab" key={company._id}>
                        <div className="w-8/12 inline-block">
                          <div className="first_top">
                            <div className="white_ p-2.5">
                              <h3>
                                <b>
                                  <button className="font-lato hover:underline text-gray-600 text-sm" onClick={() => handleCompanyClick(company)}>
                                    {company.company}
                                  </button>
                                </b>
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div className="w-4/12 inline-block text-right">
                          <div className="second_left"></div>
                          <div className="brown">
                            <h3 className="font-lato hover:underline text-gray-600 text-sm">{company.categoryName}</h3>
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
                  !loading && <div className="font-lato text-sm text-gray-700 pt-10">No results found. Try a different search.</div>
                )}
              </>
            )}  
          </div>
        </div>              
      </div>

      {selectedCompany && (
        <section className="selectedCompany-modal">
          <div className="modal fade in z-30">
            <div className="modal-dialog bg-white p-5 z-50">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" onClick={closeModal} className="close">×</button>
                </div>
                <div className="modal-body">
                  <div className="simple-div">
                    <h4 className="bd-setails block text-gray-700 text-lg mb-2 font-raleway">{selectedCompany.company}</h4>
                    <div className="add-details">
                      <table className="table table-striped">
                        <tbody>
                          <tr>
                            <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Category</td>
                            <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{selectedCompany.categoryName}</td>
                          </tr>
                          {selectedCompany.address !== '' && (
                            <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Address</td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{selectedCompany.address}</td>
                            </tr>
                          )}
                          <tr>
                            <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Country</td>
                            <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{selectedCompany.countryName}</td>
                          </tr>
                          {selectedCompany.website !== '' && (
                            <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Website</td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{selectedCompany.website}</td>
                            </tr>
                          )}
                          <tr>
                            <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Profile</td>
                            <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{selectedCompany.profile}</td>
                          </tr>
                          {selectedCompany.mobile !== '' && (
                            <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">
                                <h6 className="text-gray-500 ml-2 ml-2 font-lato text-sm "><b>Contact Details</b></h6>
                              </td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{selectedCompany.mobile}</td>
                            </tr>
                          )}
                          {selectedCompany.email !== '' && (
                            <tr>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">Email</td>
                              <td className="text-gray-500 ml-2 ml-2 font-lato text-sm ">{selectedCompany.email}</td>
                            </tr>
                          )}
                          <tr>
                            {selectedCompany.twitter_url !== '' && (
                              <p className="text-gray-500 ml-2 ml-2 font-lato text-sm ">twitter_url: {selectedCompany.twitter_url}</p>
                            )}
                            {selectedCompany.facebook_url !== '' && (
                              <p className="text-gray-500 ml-2 ml-2 font-lato text-sm ">facebook_url: {selectedCompany.facebook_url}</p>
                            )}
                            {selectedCompany.linkedin_url !== '' && (
                              <p className="text-gray-500 ml-2 ml-2 font-lato text-sm ">linkedin_url: {selectedCompany.linkedin_url}</p>
                            )}
                            {selectedCompany.insta_url !== '' && (
                              <p className="text-gray-500 ml-2 ml-2 font-lato text-sm ">insta_url: {selectedCompany.insta_url}</p>
                            )}
                          </tr>
                          <tr>
                            <td>&nbsp;</td>
                            <td className="float-right">
                              <span><button className="btn btn-success font-lato text-sm" onClick={() => sendmail(11232)}>Send Mail</button></span>
                              <span><button className="btn btn-primary font-lato text-sm" onClick={handleAddRemoveFavorite}>{isFavoriteCompany ? 'Remove from Favorites' : 'Add to Favorites'}</button></span>
                              <span><button className="btn btn-danger font-lato text-sm" onClick={closeModal} data-dismiss="modal">Close</button></span>
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

