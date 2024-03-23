import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BACKEND_URL } from "../constans";
import '../css/spinner.css'

const Favorites = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Define fetchCompanies outside of useEffect
    const fetchCompanies = async () => {
        try {
            const response = await fetch(`${ BACKEND_URL }api/favorites/${userInfo._id}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setCompanies(data);
                setLoading(false);
            } else {
                console.error('Expected an array but received:', data);
                setCompanies([]);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
            setCompanies([]);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, [userInfo]);

    const handleRemoveFavorite = async (Companyid) => {
        try {
            await axios.delete(`${ BACKEND_URL }api/favorites/delete/${Companyid}/${userInfo._id}`);
            fetchCompanies();
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <div>
            {loading ? (
                <div className="spinner"></div>
            ) : (
                <>
                    {Array.isArray(companies) && companies.length > 0 ? (
                        <>
                            <section className="bg-white">
                                <div className="container mx-auto my-0">
                                    <h2 className="text-xl text-gray-600 mb-10">Favorite</h2>
                                    <table className="table border-2 mb-20 ">
                                        <thead>
                                            <tr>
                                                <th className="panel-head p-2 border">Company</th>
                                                <th className="panel-head p-2 border">Contact Name</th>
                                                <th className="panel-head p-2 border">Email</th>
                                                <th className="panel-head p-2 border">Category</th>
                                                <th className="panel-head p-2 border">Country</th>
                                                <th className="panel-head p-2 border">&nbsp;</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {companies.map((company, index) => (
                                                <tr key={company._id} className={index % 2 === 0 ? 'even bg-white' : 'odd bg-gray-100'}>
                                                    <td className="p-2 border">{company.company}</td>
                                                    <td className="p-2 border">{company.staff_mobiles}</td>
                                                    <td className="p-2 border">{company.staff_emails}</td>
                                                    <td className="p-2 border">{company.categoryName}</td>
                                                    <td className="p-2 border">{company.countryName}</td>
                                                    <td className="p-2 border">
                                                        <a className="delete text-red-600" title="Delete" href="#" onClick={() => handleRemoveFavorite(company._id)}>
                                                            *
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </>
                    ) : (
                            <p></p>
                        )}
                </>
            )}
        </div>
    );
};

export default Favorites;
