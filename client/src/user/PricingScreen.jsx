import { Link } from 'react-router-dom';

const PricingScreen = () => { 
  return (
    <div>      
      <section className="bg-white">    
        <div className="container mx-auto my-0 w-8/12 pt-10">
          <h2 className="font-bold text-2xl text-center font-raleway">Pricing Plans</h2>
          <p className="text-sm text-center font-raleway pb-3 pt-2">Get access to the Largest Marketplace of companies in Palm Oil Industry.</p>
            <div className="reg-second-section">
              <div className="payment-box">
                  <div className="box" id="freeBox">
                      <h4  className="font-raleway mb-3.5 text-lg text-center font-semibold text-gray-600 mt-10">Basic</h4>
                      <h2 className="font-bold text-2xl text-center font-raleway mb-1">Free</h2>
                      <p className="text-center text-sm mt-2">(only for one month)</p>
                      <div class="my-6 mx-6 text-center">
                        <Link class="w-12/12 text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 px-12 rounded shadow-lg hover:shadow-xl transition duration-200" 
                                to="/register">Get Started</Link>
                      </div>
                      <hr />
                      <p className="text-gray-600 font-lato text-sm text-center mt-3">Description of paid option</p>
                      <p className="text-gray-600 font-lato text-sm text-center">Description of paid option</p>
                      <p className="text-gray-600 font-lato text-sm text-center">Description of paid option</p>
                      <p className="text-gray-600 font-lato text-sm text-center">Description of paid option</p>
                      <p className="text-gray-600 font-lato text-sm text-center">Description of paid option</p>     
                  </div>
                  <div class="box" id="paidBox">
                    <h4 class="font-raleway mb-3.5 text-center  text-lg font-semibold text-gray-600">Premium</h4>
                    <s class="text-center text-sm mt-2 px-14 ">normally $100/ year</s>
                    <h2 class="font-bold text-2xl text-center font-raleway mt-5 mb-1">$74.95/ year</h2>
                    <p class="text-center text-sm mt-2 mb-6">(billed annually)</p>
                    <p class="pricing-discount text-center text-sm mt-6">$26.05 savings*</p>
                    <div class="my-6 mx-6 text-center">
                        <Link class="w-12/12 text-raleway text-sm bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 px-12 rounded shadow-lg hover:shadow-xl transition duration-200" 
                            to="/register">Get Started</Link>
                    </div>
                    <hr />
                    <p class="text-gray-600 font-lato text-sm text-center mt-3">Description of paid option</p>
                    <p class="text-gray-600 font-lato text-sm text-center">Description of paid option</p>
                    <p class="text-gray-600 font-lato text-sm text-center">Description of paid option</p>
                    <p class="text-gray-600 font-lato text-sm text-center">Description of paid option</p>
                    <p class="text-gray-600 font-lato text-sm text-center">Description of paid option</p>
                  </div>
              </div>
            </div> 
        </div>
      </section> 
    </div> 
  );
};

export default PricingScreen;
