const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const bodyParser = require('body-parser');
public_users.use(bodyParser.json());
public_users.use(bodyParser.urlencoded({ extended: true }));

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;


  // Check if exists a value for the username and password.
  if (username.length > 0 && password.length > 0) {
      // Next, check if the username exist in the system.
      if (isValid(username)) {
          users.push({username: username, password: password });
          return res
          .status(200)
          .json({message:"User succesfully registered!"});
      } else {
          return res.status(406).json({message: "Unable to register user: User already exists!"});
      }
  }
  return res.status(406).json({message:"Unable to register user: No username and/or password provided."})
});

//1 - Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books));
});

//10 - get avaliable books in the shop
public_users.get("/async", function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
      resolve({ books });
    });
  
    getBooks.then((data) => {
      console.log("Promise is here.");
      res.send(JSON.stringify(data));
    });
  });


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const bookIsbn = req.params.isbn;
  res.send(books[bookIsbn]);
 });
  
// 11 - Implement a promise for getting book details based on ISBN
public_users.get("/async/isbn/:isbn", function (req, res) {
    // Promise to get the book.
    const getBook = new Promise((resolve, reject) => {
      const bookISBN = req.params.isbn;
      const book = books[bookISBN];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found.");
      }
    });
  
    getBook.then((book) => res.send(book))
      .catch((error) => res.status(404).send(error));
  });

// 3 - Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const author = req.params.author;
  
    // Get all keys.
    const allBooksByAuthor = Object.entries(books);
    const finalBooks = [];
  
    // Find which values match the given author.
    for (const [key, value] of allBooksByAuthor) {
      if (value.author === author) {
        finalBooks.push(value);
      }
    }
    res.send(finalBooks);
  });


// 12 - Promise get book details/author
public_users.get("/async/author/:author", function (req, res) {
    const getAuthorsBooks = new Promise(() => {
      const author = req.params.author;
    
      //keys.
      const allBooksByAuthor = Object.entries(books);
      const finalBooks = [];
    
      // values that match the given author.
      for (const [key, value] of allBooksByAuthor) {
        if (value.author === author) {
          finalBooks.push(value);
        }
      }
      res.send(finalBooks);
    })
  
  });


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  //keys
  const allBooksByTitle = Object.entries(books);
  const finalBooks = []

  //values match the given title(searcher)
  for (const [key, value] of allBooksByTitle){
      if (value.title === title){
          finalBooks.push(value);
      }
  }
  res.send(finalBooks)
});;

// 13 - Promise get all books based on title
public_users.get("/async/title/:title", function (req, res) {
    const getBookTitles = new Promise(() => {
      const title = req.params.title;
    
      // Keys.
      const allBooksByTitle = Object.entries(books);
      const finalBooks = [];
    
      // Vvalues that match given the title.
      for (const [key, value] of allBooksByTitle) {
        if (value.title === title) {
          finalBooks.push(value);
        }
      }
      res.send(finalBooks);
    });
  
  });

// 5 -   Get book review
public_users.get("/review/:isbn", function (req, res) {
    const bookIsbn = req.params.isbn;
    // Get the book reviews for the given ISBN.
    const book = books[bookIsbn];
    res.send(book.reviews);
  });

module.exports.general = public_users;



