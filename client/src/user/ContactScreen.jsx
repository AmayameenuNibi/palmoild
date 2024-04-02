import React from 'react';
import background from '../images/vlo.jpg'

const ContactScreen = () => {
    return (
      <div>
	    <section className="bg-white border-b py-8" id="about">
		    <div className="container max-w-5xl mx-auto">
          <div className="w-full mb-4">
			      <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
		      </div>
          <p className="text-justify text-gray-600 mb-8 px-5 font-lato text-2sm">
            For all your enquiries, please contact : Email: info@palmoildirectory.com
          </p>
		    </div>
	    </section>	
    </div>
      );
};

export default ContactScreen;
