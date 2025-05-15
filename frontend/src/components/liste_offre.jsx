import React, { useState, useEffect } from 'react';

const CarteComponent = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        // Récupérer les données depuis l'API Flask
        fetch('/api/services')
            .then(response => response.json())
            .then(data => setServices(data))
            .catch(error => console.error('Error fetching services:', error));
    }, []);

    return (
        <section className="services-section section-padding section-bg" id="services-section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-12">
                        <h2 className="mb-4">Our best offers</h2>
                    </div>

                    {services.map(service => (
                        <div className="col-lg-6 col-12" key={service.id}>
                            <div className="services-thumb">
                                <div className="row">
                                    <div className="col-lg-5 col-md-5 col-12">
                                        <div className="services-image-wrap">
                                            <a href={`services-detail/${service.id}`}>
                                                <img src={service.image1} className="services-image img-fluid" alt={service.title} />
                                                <img src={service.image2} className="services-image services-image-hover img-fluid" alt={service.title} />

                                                <div className="services-icon-wrap">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <p className="text-white mb-0">
                                                            <i className="bi-cash me-2"></i>
                                                            ${service.price}
                                                        </p>
                                                        <p className="text-white mb-0">
                                                            <i className="bi-clock-fill me-2"></i>
                                                            {service.duration} hrs
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>

                                    <div className="col-lg-7 col-md-7 col-12 d-flex align-items-center">
                                        <div className="services-info mt-4 mt-lg-0 mt-md-0">
                                            <h4 className="services-title mb-1 mb-lg-2">
                                                <a className="services-title-link" href={`services-detail/${service.id}`}>{service.title}</a>
                                            </h4>
                                            <p>{service.description}</p>

                                            <div className="d-flex flex-wrap align-items-center">
                                                <div className="reviews-icons">
                                                    {[...Array(service.rating)].map((_, index) => (
                                                        <i key={index} className="bi-star-fill"></i>
                                                    ))}
                                                    {[...Array(5 - service.rating)].map((_, index) => (
                                                        <i key={index + service.rating} className="bi-star"></i>
                                                    ))}
                                                </div>

                                                <a href={`services-detail/${service.id}`} className="custom-btn btn button button--atlas mt-2 ms-auto">
                                                    <span>Learn More</span>
                                                    <div className="marquee" aria-hidden="true">
                                                        <div className="marquee__inner">
                                                            <span>Learn More</span>
                                                            <span>Learn More</span>
                                                            <span>Learn More</span>
                                                            <span>Learn More</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CarteComponent;
