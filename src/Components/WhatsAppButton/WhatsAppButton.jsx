import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
  const phoneNumber = '918939943199'; // Replace with your WhatsApp number in international format
  const message = 'Hello! I would like to know more about your services.'; // Customize message

  const openWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="whatsapp-button-container" onClick={openWhatsApp}>
      <div className="tooltip">WhatsApp us</div>
      <FontAwesomeIcon icon={faWhatsapp} size="2x" color="white" className="whatsapp-icon" />
    </div>
  );
};

export default WhatsAppButton;
