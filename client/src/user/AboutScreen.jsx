import React, { useState, useEffect } from 'react';
import axios from 'axios';
import background from '../images/vlo.jpg'
import { BACKEND_URL } from "../constans";

const AboutScreen = () => {
  const [aboutData, setAboutData] = useState('');
  
  const fetchAboutData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}api/cmsdata/about`);
      setAboutData(response.data.cms_content);
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };  

  useEffect(() => {
    fetchAboutData();
  }, []); 

  return (
    <div>
	    <section className="bg-white border-b py-8" id="about">
		    <div className="row mx-auto">
          <h2 className="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800 font-lato">
            About Us
          </h2>
		      <div className="w-full mb-4">
			      <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
		      </div>
          <div 
            className="text-justify text-gray-600 mb-8 px-5  font-lato"
            dangerouslySetInnerHTML={{ __html: aboutData }}
          />
		    </div>
	    </section>	
    </div>
  );
};

export default AboutScreen;