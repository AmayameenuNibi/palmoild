import React, { useState, useEffect } from 'react';
import axios from 'axios';
import background from '../images/vlo.jpg'
import { BACKEND_URL } from "../constans";

const TermsScreen = () => {
  const [termsData, settermsData] = useState('');
  
  const fetchTermsData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}api/cmsdata/terms`);
      settermsData(response.data.cms_content);
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };  

  useEffect(() => {
    fetchTermsData();
  }, []); 

  return (
    <div>
      <div className="pt-24 backdropse h-96" style={{ backgroundImage: `url(${background})`}}>
        <div className="px-3 mx-auto items-center content-center grid">
          <div className="relative z-10 justify-center text-center">
              <h1 className="my-4 text-gray-100 text-5xl font-bold leading-tight">
                  Terms
              </h1>
              <p className="block uppercase tracking-loose w-full text-white font-bold">
                  <span> <a href="#">Home</a>&nbsp; &#8594; &nbsp;Terms</span>
              </p>
          </div>
        </div>
      </div>
	    <section className="bg-white border-b py-8" id="about">
		    <div className="container max-w-5xl mx-auto">
          <div className="w-full mb-4">
			      <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
		      </div>
          <div 
            className="text-justify text-gray-600 mb-8 px-5"
            dangerouslySetInnerHTML={{ __html: termsData }}
          />
		    </div>
	    </section>	
    </div>
  );
};

export default TermsScreen;