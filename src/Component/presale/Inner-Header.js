import React from "react";
import { Link } from 'react-router-dom';
import NetworkButton from '../helper/NetworkButton';

const InnerHeader = () => {
    return(
        <>
       
            <header className="transition">
				<div className="container">
					<div className="row flex-align">
						<div className="col-lg-4 col-md-3 col-8">
							<div className="logo">
								<Link to="/">
									<img src={require('../../assets/images/logo.png')} className="transition" alt="Cheetah Token" />
								</Link>
							</div>
						</div>
						<div className="col-lg-8 col-md-9 col-4 text-right">
							{/* <div className="menu-toggle">
								<span></span>
							</div> */}
							<div className="">
								
								<div className="signin d-inline-block">
									{/* <Link to="#" className="btn">Payment status</Link> */}
									<NetworkButton />
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>
        </>
    )
}

export default InnerHeader