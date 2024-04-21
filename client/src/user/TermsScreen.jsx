import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "../constans";
import { Helmet } from 'react-helmet';

const TermsScreen = () => {
  const [termsData, settermsData] = useState('');
  
  const fetchTermsData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}api/cmsdata/terms`);
      settermsData(response.data);
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };  

  useEffect(() => {
    fetchTermsData();
  }, []); 

  return (
    <div>
      <Helmet>
      <title>{termsData?.seo_title || "Terms and Conditions"}</title>
          <meta name="description" content={termsData.seo_description} />
          <meta name="Keywords" content={termsData.seo_keywords} />
      </Helmet>
	    <section className="bg-white py-8" id="about">
		    <div className="container max-w-5xl mx-auto">
          <h2 className="font-bold text-2xl text-center font-raleway">
                Terms and Conditions
          </h2>
          <div className="w-full mb-4">
			      <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
		      </div>
          <div 
            className="text-justify text-gray-600 mb-8 px-5"
            dangerouslySetInnerHTML={{ __html: termsData.cms_content }}
          />
		    </div>
	    </section>	
    </div>
  );
};

export default TermsScreen;