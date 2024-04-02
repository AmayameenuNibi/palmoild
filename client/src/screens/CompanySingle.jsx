import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from "../constans";

const CompanySingle = () => {
    const { companyName } = useParams();
    const [company, setCompany] = useState(null);
    
    const fetchCompanyDetails = async (companyName) => {
        try {
            const response = await fetch(`${ BACKEND_URL }api/companies/${companyName}`);
            const data = await response.json();
            setCompany(data);
        } catch (error) {
            console.error('Error fetching company details:', error);
        }
    };

    useEffect(() => {   
        fetchCompanyDetails(companyName);
    }, [companyName]); // Add companyName as a dependency to useEffect
    
    const createdAtDate = company ? new Date(company.date_added) : null;
    const createdAtDateString = createdAtDate ? createdAtDate.toLocaleDateString() : '';

    return (
        <div>
            {company && (
                <div className="page-content page-container" id="page-content">
                    <div className="padding">
                        <div className="row container d-flex justify-content-center">
                            <div className="col-xl-6 col-md-12">
                                <div className="card user-card-full">
                                    <div className="row m-l-0 m-r-0">
                                        <div className="col-sm-12 col-md-4 bg-c-lite-green user-profile py-5">
                                            <div className="card-block text-center text-white">
                                                <div className="m-b-25">
                                                    <img src={`${ BACKEND_URL }uploads/${company.logo}`} className="img-radius h-full" alt="User-Profile-Image"/>
                                                </div>
                                                <h5 className="f-w-600">{company.company}</h5>
                                                <p>{company.categoryName}</p>
                                                <a href={company.facebook_url} className="social_"><i className="fa-brands fa-facebook-f"></i></a>
                                                <a href={company.twitter_url} className="social_"><i className="fa-brands fa-x-twitter"></i></a>
                                                <a href={company.linkedin_url} className="social_"><i className="fa-brands fa-linkedin-in"></i></a>
                                                <a href={company.insta_url} className="social_"><i className="fa-brands fa-instagram"></i></a>
                                                <div className="cnt-code">
                                                    <a className="f-w-600 f-r">Country</a>
                                                    <a className="f-r">{company.countryName}</a>
                                                    <a className="f-w-600 f-r">Member since</a>
                                                    <a className="f-r">{createdAtDateString}</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12 col-md-8 py-5">
                                            <div className="card-block">
                                                <h6 className="block text-gray-700 text-lg mb-2 font-raleway font-semibold">Profile { company.status ? <span className="green flo">Active</span> : <span className="red flo">Inactive</span> }</h6>
                                                <div className="">
                                                    <div className="col-sm-12">
                                                        <p className="text-gray-700 font-lato text-sm">{company.profile}</p>
                                                    </div>
                                                </div>
                                                <h6 className="text-gray-700 font-lato text-sm">Information</h6>
                                                <div className="row">
                                                    {company.mobile && (
                                                        <div className="col-sm-6">
                                                            <p className="text-gray-700 font-lato text-sm">Phone</p>
                                                            <a className="text-muted f-w-400">{company.mobile}</a>
                                                        </div>
                                                    )}
                                                    {company.sector && (
                                                        <div className="col-sm-6">
                                                            <p className="text-gray-700 font-lato text-sm">Sector</p>
                                                            <a className="text-muted f-w-400">{company.sector}</a>
                                                        </div>
                                                    )}
                                                    {company.website && (
                                                        <div className="col-sm-6">
                                                            <p className="text-gray-700 font-lato text-sm">Website</p>
                                                            <a href="#" className="text-muted text-gray-700 font-lato text-sm">{company.website}</a>
                                                        </div>
                                                    )}
                                                    {company.address && (
                                                        <div className="col-sm-6">
                                                            <p className="text-gray-700 font-lato text-sm">Address</p>
                                                            <a className="text-muted text-gray-700 font-lato text-sm">{company.address}</a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanySingle;
