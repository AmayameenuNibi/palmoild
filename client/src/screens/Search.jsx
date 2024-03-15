import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import * as XLSX from 'xlsx';
import '../css/spinner.css';

const Search = () => {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompanies = companies.slice(indexOfFirstItem, indexOfLastItem);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`https://palmoild-sand.vercel.app/api/companies`);
      setCompanies(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://palmoild-sand.vercel.app/api/companies/search?term=${searchTerm}`);
      setCompanies(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error searching:', error);
      setLoading(false);
    }
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const downloadSearchResultsAsExcel = async () => {
    try {
      if(searchTerm == '') {
        const response = await axios.get('https://palmoild-sand.vercel.app/api/companies');
        const allCompanies = response.data;  
        const data = allCompanies.map((company, index) => ({
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
      }else{
        const response = await axios.get(`https://palmoild-sand.vercel.app/api/companies/search?term=${searchTerm}`);
        const allCompanies = response.data;
        const data = allCompanies.map((company, index) => ({
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
      }
    } catch (error) {
      console.error('Error downloading Excel file:', error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if(value === '') {
      fetchCompanies();
    }
  };

  useEffect(() => {
    if(searchTerm === '') {
      fetchCompanies();
    }
  }, []);

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
            <button onClick={handleSearch}>
              <i className="fa-brands fa-searchengin"></i>
            </button>
            <button onClick={downloadSearchResultsAsExcel}>Excel</button>
          </div>
        </div>
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
                              <Link to={`/companies/${company.company_slug}`}>{company.company}</Link>
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
        <div className="favourites-container">
          <h1 className="featured-companies">Featured Companies</h1>
          <div className="child-frame-a">
            <div className="eccelso-group">
              <div className="eccelso-group-child"></div>
              <h2 className="eccelso">Eccelso</h2>
              <div className="company-frame-b">
                <div className="company-frame-c">
                  <div className="vector-set">
                    <div className="vector-set-a">
                      <div className="vector-set-b">
                        <i className="fa-solid fa-user"></i>
                        <div className="sumeetmandaleccelsocouk-group">
                          <i className="fa-solid fa-envelopes-bulk"></i>
                        </div>
                      </div>
                    </div>
                    <div className="eccelsoframe">
                      <div className="sumeet-mandal">Sumeet Mandal</div>
                      <div className="sumeetmandaleccelsocouk">
                        sumeet.mandal@eccelso.co.uk
                      </div>
                    </div>
                  </div>
                  <div className="favouritesframe">
                    <div className="addtofav">
                      <div className="addtofav-child"></div>
                      <div className="add-to-favourites">Add to Favourites</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="eccelso-group1">
              <div className="eccelso-group-item"></div>
              <h2 className="pt-ruby-privatindo">PT Ruby Privatindo</h2>
              <div className="eccelso-group-inner">
                <div className="frame-parent">
                  <div className="frame-group">
                    <div className="frame-wrapper">
                      <div className="vector-parent">
                        <i className="fa-solid fa-user"></i>
                        <div className="vector-group">
                          <i className="fa-solid fa-envelopes-bulk"></i>
                        </div>
                      </div>
                    </div>
                    <div className="sumeet-mandal-parent">
                      <div className="sumeet-mandal1">Sumeet Mandal</div>
                      <div className="sumeetmandaleccelsocouk1">
                        sumeet.mandal@eccelso.co.uk
                      </div>
                    </div>
                  </div>
                  <div className="rectangle-parent">
                    <div className="frame-child"></div>
                    <div className="add-to-favourites1">Add to Favourites</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="eccelso-group2">
              <div className="rectangle-div"></div>
              <h2 className="ptdua-kuda-indonesia">PT.Dua Kuda Indonesia</h2>
              <div className="frame-div">
                <div className="frame-container">
                  <div className="frame-parent1">
                    <div className="frame-wrapper1">
                      <div className="vector-container">
                        <i className="fa-solid fa-user"></i>

                        <div className="vector-parent1">
                          <i className="fa-solid fa-envelopes-bulk"></i>
                        </div>
                      </div>
                    </div>
                    <div className="sumeet-mandal-group">
                      <div className="sumeet-mandal2">Sumeet Mandal</div>
                      <div className="sumeetmandaleccelsocouk2">
                        sumeet.mandal@eccelso.co.uk
                      </div>
                    </div>
                  </div>
                  <div className="rectangle-group">
                    <div className="frame-item"></div>
                    <div className="add-to-favourites2">Add to Favourites</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
