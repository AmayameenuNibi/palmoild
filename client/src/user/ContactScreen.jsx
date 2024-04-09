import React from 'react';
import { Helmet } from 'react-helmet';

const ContactScreen = () => {
    return (
      <div>
        <Helmet>
            <title>Contact Us</title>
            <meta name="description" content="PalmOil Directory" />
            <meta name="Keywords" CONTENT="palm oil,cpo,commodities,palm kernel oil,carotene,FFB,vegetable oil,lauric acid, milling,MPOPC,MPOB,olein,kernel,PKO,PKS,PORAM,RBD,refining,
                speciality fats,plantations,refinery,lipids,fatty acids,soap noodles,stearin,stearine,shortening,vanaspati,margarine,malaysia,indonesia,
                biodiesel,palm biodiesel"/>    
        </Helmet>
          <section className="bg-white border-b py-8" id="about">
            <div className="container max-w-5xl mx-auto">
              <h2 className="font-bold text-2xl text-center font-raleway">
                Contact Us
              </h2>
              <div className="w-full mb-4">
                <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
              </div>
              <div className="text-justify text-gray-600 mb-8 px-5">
                <p>For all your enquiries, please contact : Email: info@palmoildirectory.com</p>
              </div>
            </div>
          </section>	
      </div>
      );
};

export default ContactScreen;
