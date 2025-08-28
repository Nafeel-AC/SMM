import React from 'react';
import { Link } from 'react-router-dom';
import ServiceSection from '../components/ServiceSection';
import './ServicesPage.css';

const ServicesPage = () => {
  return (
    <div className="services-page">
      <div className="banner-section">
        <div className="bg-img-overlay" style={{backgroundImage: 'url(https://smm-matrix.bugfinder.app/assets/upload/pagesImage/z6fQyUFhp8DfDHIpPuGFIIWMX9HMCL.avif)', backgroundPosition: 'center right', backgroundRepeat: 'no-repeat'}}></div>
        <div className="banner-section-inner">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="breadcrumb-area">
                            <h3>Services</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/"><i className="fas fa-home"></i> Home</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Services</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <ServiceSection />
    </div>
  );
};

export default ServicesPage;
