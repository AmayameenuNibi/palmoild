import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from "../constans";
import { Helmet } from 'react-helmet';

const Cancellation = () => {
  const [cancellationData, setCancellationData] = useState(null);
  
  const fetchCancellationData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}api/cmsdata/cancellation`);
      setCancellationData(response.data);
    } catch (error) {
      console.error('Error fetching cancellation data:', error);
    }
  };  

  useEffect(() => {
    fetchCancellationData();
  }, []); 

  return (
    <div>
      <Helmet>
          <title>{cancellationData?.seo_title || "Cancellation"}</title>
          <meta name="description" content={cancellationData?.seo_description || ""} />
          <meta name="Keywords" content={cancellationData?.seo_keywords || ""} />
      </Helmet>
	    <section className="bg-white border-b py-8" id="about">
		    <div className="container max-w-5xl mx-auto">
          <h2 className="font-bold text-2xl text-center font-raleway">
               Cancellation
          </h2>
          <div className="w-full mb-4">
			      <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
		      </div>
          {cancellationData ? (
            <div 
              className="text-justify text-gray-600 mb-8 px-5"
              dangerouslySetInnerHTML={{ __html: cancellationData.cms_content }}
            />
          ) : (
            <p></p>
          )}
		    </div>
	    </section>	
    </div>
  );
};

export default Cancellation;
