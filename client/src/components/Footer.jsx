import React from 'react'

const Footer = () => {
  return (
    <div className="foot">
      <footer className="" style={{ backgroundColor: 'rgba(37, 38, 65, 1)'}}>
		<div className="py-10">
			<div className="text-center text-white">
				<p className="my-3 text-gray-400 text-sm">© 2023 Palmoildirectory.com All Rights Reserved. Online payment services provided by 2Checkout.com, Inc.</p>
			</div>
			<div className="flex items-center text-gray-400 text-sm justify-center">
				<a href="index.html" className="pr-3">Home</a>
				<a href="about.html" className="border-l border-gray-400 px-3">About us</a>
				<a href="" className="border-l border-gray-400 px-3">Companies</a>
			</div>
		</div>
	</footer>
    </div>
  )
}

export default Footer
