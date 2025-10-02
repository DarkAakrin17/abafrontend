import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import './OurPublications.css';

const OurPublications = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [currentBookIndex, setCurrentBookIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookDescription, setBookDescription] = useState("");
  const [isFetchingDescription, setIsFetchingDescription] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Helper function to check if description is valid
  const isValidDescription = (description) => {
    return description && 
           description !== "NaN" && 
           description.trim() !== "" && 
           description.toLowerCase() !== "no description available";
  };

  // Enhanced image source handler
  const getImageSource = (book) => {
    if (book.image && book.image !== "NaN" && book.image.trim() !== "") {
      return book.image;
    }
    
    if (book.Image && book.Image !== "NaN" && book.Image.trim() !== "") {
      return book.Image;
    }
    
    if (book.isbn) {
      const cloudinaryUrl = `https://res.cloudinary.com/dt2plfobm/image/upload/v1751607245/book_covers/book_covers/${book.isbn}.jpg`;
      return cloudinaryUrl;
    }
    
    return "https://via.placeholder.com/600x900/667eea/ffffff?text=No+Cover+Available";
  };

  // Fetch description from Google Books API
  const fetchBookDetailsFromGoogleBooks = async (isbn) => {
    if (!isbn) return null;
    
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      if (!response.ok) return null;
      
      const data = await response.json();
      if (data.items?.length > 0) {
        const book = data.items[0].volumeInfo;
        return book.description || null;
      }
      return null;
    } catch (err) {
      console.warn("Failed to fetch book details from Google Books:", err);
      return null;
    }
  };

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch("http://localhost:5000/api/books");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const bookData = await response.json();

      // Filter only books published by "mhe" (case insensitive)
      const mheBooks = bookData.filter(book => {
        const publisher = (book.publisher || "").toLowerCase().trim();
        return publisher === "aakaash publication" || publisher === "aakaash publication";
      });

      const processedBooks = mheBooks.map((book, index) => {
        const category = book.category || book.CATEGORY || "Unknown";
        const priceValue = parseFloat(book.price) || 0;
        const currency = book.currency || "USD";
        const formattedPrice = `${currency} ${priceValue}`;
        const dbDescription = book.description || book.DESCRIPTION || "";
        
        return {
          id: book._id,
          title: book.title || "Unknown Title",
          author: book.author || "Unknown Author",
          price: formattedPrice,
          image: book.image || "",
          Image: book.Image || "",
          category: category,
          publisher: book.publisher || "Unknown Publisher",
          isbn: book.isbn || book.ISBN || "",
          availability: book.AVAILABILITY || book.availability || "Unknown",
          originalPrice: priceValue,
          originalCurrency: currency,
          description: dbDescription,
          originalIndex: index,
          originalBook: book
        };
      });

      setAllBooks(processedBooks);
      if (processedBooks.length > 0) {
        fetchBookDescription(processedBooks[0]);
      }
    } catch (error) {
      console.error("❌ Error fetching books:", error);
      setError("Failed to load our publications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookDescription = async (book) => {
    setIsFetchingDescription(true);
    setBookDescription("Loading description...");
    
    try {
      if (isValidDescription(book.description)) {
        setBookDescription(book.description);
        setIsFetchingDescription(false);
        return;
      }

      if (book.isbn) {
        const googleDescription = await fetchBookDetailsFromGoogleBooks(book.isbn);
        if (googleDescription) {
          setBookDescription(googleDescription);
        } else {
          setBookDescription("Discover this comprehensive publication from our collection. This book represents our commitment to delivering high-quality educational content that empowers professionals and students alike.");
        }
      } else {
        setBookDescription("Discover this comprehensive publication from our collection. This book represents our commitment to delivering high-quality educational content that empowers professionals and students alike.");
      }
    } catch (error) {
      console.error("Error fetching book description:", error);
      setBookDescription("Discover this comprehensive publication from our collection. This book represents our commitment to delivering high-quality educational content that empowers professionals and students alike.");
    } finally {
      setIsFetchingDescription(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (allBooks.length > 0) {
      fetchBookDescription(allBooks[currentBookIndex]);
      setImageLoadError(false);
    }
  }, [currentBookIndex, allBooks]);

  const handleNextBook = () => {
    if (currentBookIndex < allBooks.length - 1) {
      setCurrentBookIndex(currentBookIndex + 1);
    }
  };

  const handlePrevBook = () => {
    if (currentBookIndex > 0) {
      setCurrentBookIndex(currentBookIndex - 1);
    }
  };

  const handlePageClick = (index) => {
    setCurrentBookIndex(index);
  };

  if (isLoading) {
    return (
      <div className="pub-loading-wrapper">
        <div className="pub-loading-content">
          <div className="pub-loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pub-loading-title"
          >
            Loading Publications
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pub-loading-subtitle"
          >
            Preparing our latest collection...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pub-error-wrapper">
        <div className="pub-error-content">
          <div className="pub-error-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2 className="pub-error-title">Something went wrong</h2>
          <p className="pub-error-message">{error}</p>
          <button onClick={fetchBooks} className="pub-retry-btn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (allBooks.length === 0) {
    return (
      <div className="pub-empty-wrapper">
        <div className="pub-empty-content">
          <div className="pub-empty-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.11 0 2-.9 2-2V4c0-1.11-.89-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
            </svg>
          </div>
          <h2 className="pub-empty-title">No Publications Found</h2>
          <p className="pub-empty-message">We're currently updating our collection. Check back soon!</p>
        </div>
      </div>
    );
  }

  const currentBook = allBooks[currentBookIndex];

  return (
    <div className="pub-wrapper">
      {/* Background Elements */}
      <div className="pub-background">
        <div className="pub-bg-gradient"></div>
        <div className="pub-bg-pattern"></div>
      </div>

      {/* Header Section */}
      <motion.section 
        className="pub-hero-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="pub-hero-content">
          <h1 className="pub-hero-title">Our Publications</h1>
          <p className="pub-hero-subtitle">
            Discover our carefully curated collection of published works
          </p>
          <div className="pub-hero-stats">
            <div className="pub-stat-card">
              <span className="pub-stat-number">{allBooks.length}</span>
              <span className="pub-stat-label">Publications</span>
            </div>
            <div className="pub-stat-divider"></div>
            <div className="pub-stat-card">
              <span className="pub-stat-number">{currentBookIndex + 1}</span>
              <span className="pub-stat-label">Current</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Main Content Section */}
      <section className="pub-main-section">
        <div className="pub-content-container">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentBookIndex}
              className="pub-showcase-card"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* Book Visual */}
              <div className="pub-book-visual">
                <motion.div 
                  className="pub-book-frame"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="pub-book-shadow"></div>
                  <img 
                    src={imageLoadError ? "https://via.placeholder.com/400x600/667eea/ffffff?text=Publication" : getImageSource(currentBook)}
                    alt={currentBook.title}
                    className="pub-book-cover"
                    onError={() => setImageLoadError(true)}
                  />
                  <div className="pub-book-reflection"></div>
                </motion.div>
              </div>

              {/* Book Information */}
              <div className="pub-book-info-panel">
                <motion.div 
                  className="pub-info-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {/* Category Badge */}
                  <div className="pub-category-badge">
                    <span className="pub-badge-text">{currentBook.category}</span>
                  </div>

                  {/* Title & Author */}
                  <h2 className="pub-publication-headline">{currentBook.title}</h2>
                  <p className="pub-author-name">by {currentBook.author}</p>

                  {/* Price Section */}
                  <div className="pub-price-display">
                    <span className="pub-price-amount">{currentBook.price}</span>
                    <div className="pub-availability-indicator">
                      <span className={`pub-status-dot ${currentBook.availability === "YES" ? "available" : "unavailable"}`}></span>
                      <span className="pub-status-text">
                        {currentBook.availability === "YES" ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="pub-details-grid">
                    <div className="pub-detail-item">
                      <div className="pub-detail-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                        </svg>
                      </div>
                      <div className="pub-detail-content">
                        <span className="pub-detail-label">Publisher</span>
                        <span className="pub-detail-value">{currentBook.publisher}</span>
                      </div>
                    </div>
                    
                    {currentBook.isbn && (
                      <div className="pub-detail-item">
                        <div className="pub-detail-icon">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
                          </svg>
                        </div>
                        <div className="pub-detail-content">
                          <span className="pub-detail-label">ISBN</span>
                          <span className="pub-detail-value">{currentBook.isbn}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="pub-description-panel">
                    <h3 className="pub-description-header">About This Publication</h3>
                    {isFetchingDescription ? (
                      <div className="pub-description-loader">
                        <div className="pub-loader-dots">
                          <span></span><span></span><span></span>
                        </div>
                        <span className="pub-loader-text">Loading description...</span>
                      </div>
                    ) : (
                      <motion.div 
                        className="pub-description-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <p className="pub-description-text">{bookDescription}</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Navigation Section */}
      <motion.section 
        className="pub-navigation-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="pub-nav-container">
          <button 
            onClick={handlePrevBook}
            disabled={currentBookIndex === 0}
            className="pub-nav-control pub-nav-prev"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
            <span className="pub-nav-label">Previous</span>
          </button>

          <div className="pub-pagination-display">
            <div className="pub-page-dots">
              {allBooks.slice(Math.max(0, currentBookIndex - 2), Math.min(allBooks.length, currentBookIndex + 3)).map((_, idx) => {
                const actualIndex = Math.max(0, currentBookIndex - 2) + idx;
                return (
                  <button
                    key={actualIndex}
                    className={`pub-page-dot ${actualIndex === currentBookIndex ? 'active' : ''}`}
                    onClick={() => handlePageClick(actualIndex)}
                  >
                    {actualIndex + 1}
                  </button>
                );
              })}
            </div>
            <div className="pub-page-counter">
              <span className="pub-current-page">{currentBookIndex + 1}</span>
              <span className="pub-page-separator">/</span>
              <span className="pub-total-pages">{allBooks.length}</span>
            </div>
          </div>

          <button 
            onClick={handleNextBook}
            disabled={currentBookIndex === allBooks.length - 1}
            className="pub-nav-control pub-nav-next"
          >
            <span className="pub-nav-label">Next</span>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
      </motion.section>
    </div>
  );
};

export default OurPublications;