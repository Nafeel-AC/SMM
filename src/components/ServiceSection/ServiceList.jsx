import React, { useState } from 'react';
import './ServiceSection.css';

const ServiceList = ({ services, expandedCategory, toggleAccordion }) => {
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceClick = (service) => {
    setSelectedService(service);
  };

  const closeServiceDetails = () => {
    setSelectedService(null);
  };

  return (
    <div className="service-list">
      {services.length === 0 ? (
        <div className="no-results">
          <div className="card text-center p-5">
            <div className="card-body">
              <i className="bi bi-search fs-1 mb-3 text-muted"></i>
              <h3>No Services Found</h3>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="accordion" id="serviceAccordion">
          {services.map(({ category, services }, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${expandedCategory === category ? '' : 'collapsed'}`}
                  type="button"
                  onClick={() => toggleAccordion(category)}
                >
                  <span className="category-name">{category}</span>
                  <span className="service-count badge bg-primary ms-2">{services.length}</span>
                </button>
              </h2>
              
              <div 
                className={`accordion-collapse collapse ${expandedCategory === category ? 'show' : ''}`}
              >
                <div className="accordion-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Service</th>
                          <th>Price</th>
                          <th>Min-Max</th>
                          <th>Avg. Time</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map(service => (
                          <tr key={service.id} className="service-item">
                            <td>{service.name}</td>
                            <td>${service.price.toFixed(2)}</td>
                            <td>{service.min}-{service.max}</td>
                            <td>{service.avgTime}</td>
                            <td>
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleServiceClick(service)}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Details Modal */}
      {selectedService && (
        <div className="service-modal">
          <div className="modal-backdrop" onClick={closeServiceDetails}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{selectedService.name}</h5>
              <button type="button" className="btn-close" onClick={closeServiceDetails}></button>
            </div>
            <div className="modal-body">
              <div className="service-details">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6>Price</h6>
                    <p className="price-tag">${selectedService.price.toFixed(2)}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Average Time</h6>
                    <p>{selectedService.avgTime}</p>
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6>Minimum Order</h6>
                    <p>{selectedService.min}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Maximum Order</h6>
                    <p>{selectedService.max}</p>
                  </div>
                </div>
                
                <div className="description-box">
                  <h6>Description</h6>
                  <pre className="description-content">{selectedService.description}</pre>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeServiceDetails}>Close</button>
              <button type="button" className="btn btn-primary">Order Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceList;
