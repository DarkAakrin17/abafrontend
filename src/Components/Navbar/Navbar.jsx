import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-scroll';
import './Navbar.css';
import logo from '../../assets/AakaashBookAgency.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 850);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 850);
      if (window.innerWidth > 850) setMenuOpen(false); 
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const handleLinkClick = () => {
    if (isMobile) setMenuOpen(false);
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="logo-container">
        <h1 className='logo'>aBa</h1>
        <img className="navbar-logo" src={logo} alt="Aakaash Book Agency Logo" />
      </div>

      {isMobile ? (
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </div>
      ) : (
        <ul className="navbar-links">
          <NavItems handleLinkClick={handleLinkClick} />
        </ul>
      )}

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.ul
            className="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <NavItems handleLinkClick={handleLinkClick} />
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const NavItems = ({ handleLinkClick }) => (
  <>
    <li className='navbutton'>
      <Link to='homerouter' spy={true} smooth={true} offset={-100} duration={1000} onClick={handleLinkClick}>
        <FlyoutLink>Home</FlyoutLink>
      </Link>
    </li>
    <li className='navbutton'>
      <Link to='aboutrouter' spy={true} smooth={true} offset={15} duration={1000} onClick={handleLinkClick}>
        <FlyoutLink>About Us</FlyoutLink>
      </Link>
    </li>
    <li className='navbutton'>
      <Link to='shoprouter' spy={true} smooth={true} offset={-15} duration={1000} onClick={handleLinkClick}>
        <FlyoutLink>Shop</FlyoutLink>
      </Link>
    </li>
    <li className='navbutton'>
      <Link to='ourpublicationsrouter' spy={true} smooth={true} offset={-85} duration={1000} onClick={handleLinkClick}>
        <FlyoutLink>Our Publications</FlyoutLink>
      </Link>
    </li>
    <li>
      <button className="custom-btn">
        <Link to='contactrouter' spy={true} smooth={true} offset={-100} duration={1000} onClick={handleLinkClick}>
          Contact Us
        </Link>
      </button>
    </li>
  </>
);

const FlyoutLink = ({ children, href, FlyoutContent }) => {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 850);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 850);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      onMouseEnter={() => isDesktop && setOpen(true)}
      onMouseLeave={() => isDesktop && setOpen(false)}
      className="flyout-container"
    >
      <a href={href} className="flyout-link nav-item">
        {children}
        {/* Show underline only on desktop */}
        {isDesktop && <span className={`flyout-underline ${open ? 'show-underline' : ''}`} />}
      </a>

      {/* Show flyout content only on desktop */}
      <AnimatePresence>
        {open && isDesktop && FlyoutContent && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 5 }}
            exit={{ opacity: 0, y: 15 }}
            className="flyout-content"
          >
            <div className="flyout-gap" />
            <div className="flyout-arrow" />
            <FlyoutContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default Navbar;
