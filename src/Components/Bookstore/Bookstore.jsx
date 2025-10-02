import React, { useState, useEffect, useRef } from "react";
import ReactModal from 'react-modal';
import axios from 'axios';
import './Bookstore.css';

const Bookstore = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [sortOrder, setSortOrder] = useState('default');
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set());
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookDescription, setBookDescription] = useState("");
  const [isFetchingDescription, setIsFetchingDescription] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 20;

  const dropdownRef = useRef(null);

  // Helper function to check if description is valid
  const isValidDescription = (description) => {
    return description && 
           description !== "NaN" && 
           description.trim() !== "" && 
           description.toLowerCase() !== "no description available";
  };

  // Enhanced image source handler for Cloudinary and fallback images
  const getImageSource = (book) => {
    // First, try the main image field (Cloudinary URL)
    if (book.image && book.image !== "NaN" && book.image.trim() !== "") {
      return book.image;
    }
    
    // Fallback to Image field if available
    if (book.Image && book.Image !== "NaN" && book.Image.trim() !== "") {
      return book.Image;
    }
    
    // If we have an ISBN, try to construct a potential Cloudinary URL
    if (book.isbn) {
      const cloudinaryUrl = `https://res.cloudinary.com/dt2plfobm/image/upload/v1751607245/book_covers/book_covers/${book.isbn}.jpg`;
      return cloudinaryUrl;
    }
    
    // Final fallback to placeholder
    return "https://via.placeholder.com/500x750/f0f0f0/666666?text=No+Cover+Available";
  };

  // Enhanced image error handler with multiple fallback attempts
  const handleImageError = (bookId, book, currentAttempt = 0) => {
    const maxAttempts = 3;
    
    if (currentAttempt < maxAttempts) {
      // Try different image sources on error
      const fallbackSources = [
        book.image !== "NaN" ? book.image : null,
        book.Image !== "NaN" ? book.Image : null,
        book.isbn ? `https://res.cloudinary.com/dt2plfobm/image/upload/v1751607245/book_covers/book_covers/${book.isbn}.jpg` : null,
        "https://via.placeholder.com/500x750/f0f0f0/666666?text=No+Cover+Available"
      ].filter(Boolean);
      
      if (currentAttempt + 1 < fallbackSources.length) {
        // Try next fallback source
        return;
      }
    }
    
    // Mark as error after all attempts
    setImageLoadErrors(prev => new Set(prev).add(bookId));
  };

  // Fetch description from Google Books API as fallback
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

  useEffect(() => {
    ReactModal.setAppElement('#root');
    fetchBooks();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMobileCategories(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter, sort, and pagination logic
  const applyFiltersAndPagination = (books) => {
    let filtered = books;
    
    if (selectedCategory || searchQuery) {
      filtered = books.filter(book => {
        const matchesCategory = !selectedCategory || book.category === selectedCategory;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          book.title.toLowerCase().includes(searchLower) ||
          book.author.toLowerCase().includes(searchLower) ||
          (book.isbn && book.isbn.toLowerCase().includes(searchLower));
        return matchesCategory && matchesSearch;
      });
    }
    
    let sorted = [...filtered];
    if (sortOrder === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === 'price') {
      sorted.sort((a, b) => a.originalPrice - b.originalPrice);
    } else if (sortOrder === 'default') {
      sorted.sort((a, b) => a.originalIndex - b.originalIndex);
    }
    
    const totalFilteredBooks = sorted.length;
    const calculatedTotalPages = Math.ceil(totalFilteredBooks / ITEMS_PER_PAGE);
    setTotalPages(calculatedTotalPages);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sorted.slice(startIndex, endIndex);
  };

  useEffect(() => {
    if (allBooks.length > 0) {
      const paginatedBooks = applyFiltersAndPagination(allBooks);
      setDisplayedBooks(paginatedBooks);
    }
  }, [allBooks, selectedCategory, searchQuery, sortOrder, currentPage]);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch books from your backend
      const response = await axios.get("http://localhost:5000/api/books");
      const bookData = response.data;

      const processedBooks = bookData.map((book, index) => {
        // Extract category
        const category = book.category || book.CATEGORY || "Unknown";
        
        // Extract price - handle different currency formats
        const priceValue = parseFloat(book.price) || 0;
        const currency = book.currency || "USD";
        const formattedPrice = `${currency} ${priceValue}`;
        
        // Extract description from database
        const dbDescription = book.description || book.DESCRIPTION || "";
        
        return {
          id: book._id,
          title: book.title || "Unknown Title",
          author: book.author || "Unknown Author",
          price: formattedPrice,
          image: book.image || "", // Cloudinary URL
          Image: book.Image || "", // Fallback image field
          category: category,
          publisher: book.publisher || "Unknown Publisher",
          isbn: book.isbn || book.ISBN || "",
          availability: book.AVAILABILITY || book.availability || "Unknown",
          originalPrice: priceValue,
          originalCurrency: currency,
          description: dbDescription, // Store database description
          originalIndex: index,
          // Keep original book object for image fallback handling
          originalBook: book
        };
      });

      // Extract unique categories
      const uniqueCategories = [...new Set(processedBooks.map(book => book.category))];
      
      setAllBooks(processedBooks);
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("❌ Error fetching books:", error);
      setError("Failed to load books. Please check if the server is running and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookDescription = async (book) => {
    setIsFetchingDescription(true);
    setBookDescription("Loading description...");
    
    try {
      // First, check if we have a valid description from the database
      if (isValidDescription(book.description)) {
        setBookDescription(book.description);
        setIsFetchingDescription(false);
        return;
      }

      // If no valid description in database, try Google Books API
      if (book.isbn) {
        const googleDescription = await fetchBookDetailsFromGoogleBooks(book.isbn);
        if (googleDescription) {
          setBookDescription(googleDescription);
        } else {
          setBookDescription("No description available");
        }
      } else {
        setBookDescription("No description available (missing ISBN)");
      }
    } catch (error) {
      console.error("Error fetching book description:", error);
      setBookDescription("Failed to load description. Please try again later.");
    } finally {
      setIsFetchingDescription(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (currentPage > 1) {
      pageNumbers.push(
        <button 
          key="prev" 
          onClick={() => handlePageChange(currentPage - 1)} 
          className="pagination-button"
        >
          « Prev
        </button>
      );
    }

    if (startPage > 1) {
      pageNumbers.push(
        <button 
          key={1} 
          onClick={() => handlePageChange(1)} 
          className="pagination-button"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <span key="start-ellipsis" className="pagination-ellipsis">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button 
          key={i} 
          onClick={() => handlePageChange(i)}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="end-ellipsis" className="pagination-ellipsis">
            ...
          </span>
        );
      }
      pageNumbers.push(
        <button 
          key={totalPages} 
          onClick={() => handlePageChange(totalPages)} 
          className="pagination-button"
        >
          {totalPages}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pageNumbers.push(
        <button 
          key="next" 
          onClick={() => handlePageChange(currentPage + 1)} 
          className="pagination-button"
        >
          Next »
        </button>
      );
    }

    return (
      <div className="pagination-container">
        {pageNumbers}
      </div>
    );
  };

  const toggleMobileCategories = () => {
    setShowMobileCategories(!showMobileCategories);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowMobileCategories(false);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setSortOrder('default');
    setCurrentPage(1);
  };

  const openBookModal = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
    fetchBookDescription(book); // Pass the entire book object
  };

  const closeBookModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchBooks} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bookstore-container">
      <div className="bookstore-controls">
        <div className="category-dropdown" ref={dropdownRef}>
          <button className="dropdown-toggle" onClick={toggleMobileCategories}>
            <span>{selectedCategory || "All Categories"}</span>
            <svg className="dropdown-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {showMobileCategories && (
            <div className="dropdown-menu">
              <div className={`dropdown-item ${!selectedCategory ? "active" : ""}`} onClick={() => handleCategorySelect(null)}>
                All Categories
                {!selectedCategory && (
                  <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              {categories.map((category, index) => (
                <div key={index} className={`dropdown-item ${selectedCategory === category ? "active" : ""}`} onClick={() => handleCategorySelect(category)}>
                  {category}
                  {selectedCategory === category && (
                    <svg className="check-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="search-container">
          <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        <div className="sort-dropdown">
          <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="default">Default Order</option>
            <option value="title">Sort by Title</option>
            <option value="price">Sort by Price</option>
          </select>
          <div className="sort-icon">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
            </svg>
          </div>
        </div>

        {(selectedCategory || searchQuery || sortOrder !== 'default') && (
          <button className="clear-filters-button" onClick={handleClearFilters}>
            Clear All
            <svg className="clear-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className="books-grid">
        {displayedBooks.map((book, index) => {
          const currentImage = imageLoadErrors.has(book.id) 
            ? "https://via.placeholder.com/500x750/f0f0f0/666666?text=No+Cover+Available"
            : getImageSource(book);
            
          return (
            <div key={book.id || index} className="book-card" onClick={() => openBookModal(book)}>
              <div className="book-image-container">
                <img 
                  src={currentImage}
                  alt={book.title}
                  className="book-image"
                  onError={() => handleImageError(book.id, book)}
                  loading="lazy"
                />
              </div>
              <div className="book-content">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <p className="book-price"><span className="bold">{book.price}</span></p>
                <p className="book-category">Category: {book.category}</p>
                <p className="book-publisher">Publisher: {book.publisher}</p>
                {book.isbn && <p className="book-isbn">ISBN: {book.isbn}</p>}
                <p className="book-availability">
                  Availability: &nbsp;
                  <span className={book.availability === "YES" ? "text-green-600" : "text-red-600"}>
                    {book.availability}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {renderPagination()}

      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeBookModal}
        contentLabel="Book Details"
        className="book-modal"
        overlayClassName="book-modal-overlay"
      >
        {selectedBook && (
          <div className="modal-content">
            <button className="modal-close-button" onClick={closeBookModal}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="modal-book-container">
              <div className="modal-book-image">
                <img 
                  src={imageLoadErrors.has(selectedBook.id) 
                    ? "https://via.placeholder.com/500x750/f0f0f0/666666?text=No+Cover+Available"
                    : getImageSource(selectedBook)}
                  alt={selectedBook.title}
                  onError={() => handleImageError(selectedBook.id, selectedBook)}
                />
              </div>
              
              <div className="modal-book-details">
                <h2>{selectedBook.title}</h2>
                <p className="modal-author">by {selectedBook.author}</p>
                
                <div className="modal-price-section">
                  <span className="modal-price">{selectedBook.price}</span>
                  <br></br>
                  {/* <span className={`availability-badge ${selectedBook.availability === "YES" ? "available" : "unavailable"}`}>
                    {selectedBook.availability === "YES" ? "Available" : "Out of Stock"}
                  </span> */}
                </div>
                
                <div className="modal-detail-row">
                  <span className="detail-label">Category:</span>
                  <span>{selectedBook.category}</span>
                </div>
                
                <div className="modal-detail-row">
                  <span className="detail-label">Publisher:</span>
                  <span>{selectedBook.publisher}</span>
                </div>
                
                {selectedBook.isbn && (
                  <div className="modal-detail-row">
                    <span className="detail-label">ISBN:</span>
                    <span>{selectedBook.isbn}</span>
                  </div>
                )}
                
                <div className="modal-description">
                  <h3>Description</h3>
                  {isFetchingDescription ? (
                    <div className="description-loading">
                      <div className="loading-spinner small"></div>
                      <p>Loading description...</p>
                    </div>
                  ) : (
                    <p>{bookDescription}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </ReactModal>
    </div>
  );
};

export default Bookstore;