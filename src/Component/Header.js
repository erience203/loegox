import { Link } from 'react-router-dom'

const Header = () => {
	return (
		<>
			<header className="transition">
				<div className="container">
					<div className="row flex-align">
						<div className="col-lg-4 col-md-3 col-8">
							<div className="logo">
								<Link to="/">
									<img src={require('../assets/images/logo.png')} className="transition" alt="Cheetah Token" />
								</Link>
							</div>
						</div>
						<div className="col-lg-8 col-md-9 col-4 text-right">
							<div className="menu-toggle">
								<span></span>
							</div>
							<div className="menu">
								<ul className="d-inline-block">
									<li><a href="#banner">Home</a></li>
									<li><a href="#about">About</a></li>
									<li><a href="#tokensale-part">Tokenomics</a></li>
									<li><a href="#roadmap">Roadmap</a></li>
									<li><a href="#faq">FAQ's</a></li>
								</ul>
								<div className="signin d-inline-block">
									<Link to="presale" className="btn">Buy $LEGOX</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>
		</>
	)
}
export default Header