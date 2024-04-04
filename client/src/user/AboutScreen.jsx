import React from 'react';
import background from '../images/vlo.jpg'
import { Helmet } from 'react-helmet';

const AboutScreen = () => {
  return (
    <div>
      <Helmet>
          <title>About Us</title>
      </Helmet>
	    <section className="bg-white border-b py-8" id="about">
		    <div className="container max-w-5xl mx-auto">
          <h2 className="w-full my-2 text-5xl font-semibold font-raleway text-center text-gray-800 abt relative inline-block">
            About Us
          </h2>
		      <div className="w-full mb-4">
			      <div className="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>
		      </div>
          <p className="text-justify text-gray-600 mb-8 px-5 font-lato text-2sm">
            Commoditylife publishes two leading business directory for the Palm Oil and EdibleOil 
            industry. The information provided in these directories has been recognized and 
            appreciated by clients globally. The company profiles and product catalogs details 
            provided in the directory has helped in developing, supporting and promoting better 
            trade relationships in the Palm Oil & EdibleOil sector.</p>

          <p className="text-justify text-gray-600 mb-8 px-5 font-lato text-2sm">PalmOil Directory published by the Commoditylife is a comprehensive resource of industry 
            information in the Palm Oil business community worldwide. With over 5000 registered 
            companies it is one of the biggest PalmOil B2B directory which lists out details for Palm 
            Oil suppliers,exporters,traders and more. It includes the list of plantations, traders, 
            brokers, millers, refiners, exporters, buyers, oleochemicals, food manufacturers, 
            non-food manufacturers, logistics providers, equipment manufacturers, plantation suppliers, 
            biodiesel, banks/investors , market reports, surveyors, consultants and associations. 
            It is an excellent guide for any Palm Oil related websites, enquiries,partnerships and 
            marketing opportunities.</p>

            <p className="text-justify text-gray-600 mb-8 px-5 font-lato text-2sm">The EdibleOil Directory is the world-wide directory for the EdibleOil industry.<br/></p>
		    </div>
	    </section>	
    </div>
  );
};

export default AboutScreen;
