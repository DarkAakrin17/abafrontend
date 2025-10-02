import React, { useEffect, useState } from "react";
import axios from "axios";

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/books")
      .then((res) => {
        setBooks(res.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching books:", err);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📚 Book Store</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book._id} className="border p-4 rounded shadow">
            <p className="font-semibold">{book.title}</p>
            <p>Author: {book.author}</p>
            <p>Price: ₹{book.price}</p>
            <p>Availability: 
              <span className={book.AVAILABILITY === "YES" ? "text-green-600" : "text-red-600"}>
                {book.AVAILABILITY}
              </span>
            </p>
            {/* Show image if available */}
            {book.Image !== "NaN" && (
              <img
                src={book.Image}
                alt={book.title}
                className="w-full h-40 object-cover mt-2"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
