import React from 'react';
import './Map.css';

const Map = ({ 
  googleMapsUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.18431395584!2d-73.988379684773!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b311f7b9%3A0x88da81f0bb25c729!2sNew%20York%2C%20NY%2010017%2C%20USA!5e0!3m2!1sen!2sus!4v1698765432100!5m2!1sen!2sus"
}) => {
  return (
    <div className='map' id='map'>
      <h2>Visit our kitchen</h2>
       <div className="map-container">
      <div className="map-wrapper">
        <iframe
          src={googleMapsUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Store Location Map"
          className="map-iframe"
        ></iframe>
      </div>
    </div>
    </div>
  );
};

export default Map;