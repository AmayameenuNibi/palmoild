import React, { useState, useEffect } from 'react';
import axios from 'axios';
import background from '../images/vlo.jpg'
import { BACKEND_URL } from "../constans";

const Cancellation = () => {
  const [cancellationData, setcancellationData] = useState('');
  
  const fetchCancellationData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}api/cmsdata/cancellation`);
      setcancellationData(response.data.cms_content);
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };  

  useEffect(() => {
    fetchCancellationData();
  }, []); 

  return (
    <div>
	    <section className="bg-white border-b py-8" id="about">
		    <div className="container max-w-5xl mx-auto">
          <div className="w-full mb-4">
			      <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
		      </div>
          <div 
            className="text-justify text-gray-600 mb-8 px-5"
            dangerouslySetInnerHTML={{ __html: cancellationData }}
          />
		    </div>
	    </section>	
    </div>
  );
};

export default Cancellation;