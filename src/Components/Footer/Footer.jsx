import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <div className='footer'>
      <div className="footer-top">
        <div className="social-section">
          <span className="follow-us-text">Follow us on</span>
          <div className="social-icons">
            <a href="https://www.instagram.com/aakashbookagency?igsh=MWFvZWp3anprdzI2Mg==" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
          </div>
        </div>
        <div className="developer-link">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">Our Developers</a>
        </div>
      </div>

      <div className="footer-bottom-line" />

      <p className="copyright-text">
        © Aakash Book Agency. All rights reserved.
      </p>
    </div>
  );
};

export default Footer;