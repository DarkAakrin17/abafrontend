import React, { useState, useRef, useEffect } from 'react';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './Home.css';
import slide1 from '../../assets/Banner1.jpg';
import slide2 from '../../assets/Banner2.jpg';

import slide4 from '../../assets/Banner4.jpg';
import slide5 from '../../assets/Banner5.jpg';
import slide6 from '../../assets/Banner6.jpg';


import smallslide1 from '../../assets/smallslider1.png';
import smallslide2 from '../../assets/smallslider2.png';
import smallslide3 from '../../assets/smallslider3.png';
import smallslide4 from '../../assets/smallslider4.png';



const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadeImages, setFadeImages] = useState([]);
  const fadeRef = useRef(null); // Reference for the Fade component

  // Function to set images based on screen width
  const updateImages = () => {
    // window.innerWidth < 541
    if (1==2) {
      setFadeImages([
        { url: smallslide1 },
        { url: smallslide2 },
        { url: smallslide3 },
        { url: smallslide4 },
      ]);
    } else {
      setFadeImages([
        { url: slide1 },
        { url: slide2 },
        
        { url: slide4 },
        { url: slide5 },
        { url: slide6 },
      ]);
    }
  };

  // Check screen width on load and resize
  useEffect(() => {
    updateImages();
    window.addEventListener('resize', updateImages);
    return () => window.removeEventListener('resize', updateImages);
  }, []);

  const properties = {
    autoplay: true,
    indicators: false,
    onChange: (oldIndex, newIndex) => {
      setCurrentSlide(newIndex);
    },
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    fadeRef.current.goTo(index); // Navigate to specific slide

    // Remove focus from the active element after clicking
    document.activeElement.blur();
  };

  return (
    <div className="slide-container">
      <Fade {...properties} ref={fadeRef}>
        {fadeImages.map((fadeImage, index) => (
          <div className="slides" key={index}>
            <img src={fadeImage.url} alt={`slide-${index}`} />
          </div>
        ))}
      </Fade>
      <div className="carousel-dots">
        {fadeImages.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            onMouseDown={(e) => e.preventDefault()} // Prevent focus on click
            tabIndex="-1" // Prevent focus via keyboard
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Home;
