const Footer = () => {
    return (
        <>
            <footer className="bg-pattern darkblue">
                <div className="container">
                    <div className="copyright">
                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <img src={require('../assets/images/logo.png')} alt="" className='img-fluid mb-3 spl-img' />
                                <p className='spl-text'>Copyright &copy; 2022. All Rights Reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
export default Footer