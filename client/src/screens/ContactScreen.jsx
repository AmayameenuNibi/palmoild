import React from 'react';
import background from '../images/vlo.jpg'

const ContactScreen = () => {
    return (
      <div>
      <div className="pt-24 backdropse h-96" style={{ backgroundImage: `url(${background})`}}>
        <div className="px-3 mx-auto items-center content-center grid">
          <div className="relative z-10 justify-center text-center">
              <h1 className="my-4 text-gray-100 text-5xl font-bold leading-tight">
                Contact Us
              </h1>
              <p className="block uppercase tracking-loose w-full text-white font-bold">
                  <span> <a href="#">Home</a>&nbsp; &#8594; &nbsp;Contact Us</span>
              </p>
          </div>
        </div>
      </div>
	    <section className="bg-white border-b py-8" id="about">
		    <div className="container max-w-5xl mx-auto">
          <div className="w-full mb-4">
			      <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
		      </div>
          <p className="text-justify text-gray-600 mb-8 px-5">
            For all your enquiries, please contact : Email: info@palmoildirectory.com
          </p>
		    </div>
	    </section>	
    </div>
      );
};

export default ContactScreen;
