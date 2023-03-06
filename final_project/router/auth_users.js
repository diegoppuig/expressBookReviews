const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let matchingUsers = users.filter((user) =>{
        return user.username === username;
    });
    if (matchingUsers.length > 0) {
        return false;
    }
    return true;
};

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let matchingUsers = users.filter((user) => {
        return user.username === username && user.password === password;
    });

    if (matchingUsers.length > 0) {
        return true;
    }
    return false;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  //If no username and/or password was provided
if (!username || !password){
    return res.status(404).send("There was an issue while trying to log in.");
}
// check if the user is registered in our system.
if (authenticatedUser(username, password)) {
    //Generate JWT token.
    let accessToken = jwt.sign({
        pw: password,
    },
    "access",
    {expiresIn: 60*60 }
    );
    //Create the user's session.
    req.session.authorization = {
        accessToken,
        username,
    };

    return res.status(200).send({
        message: "User successfully logged in."
      });
} else {
    return res
    .status(208)
    .send("The provided username or password was not valid.")
}

//
});



// Add a book review
regd_users.put("/auth/review/:isbn/", (req, res) => {
    const bookISBN = req.params.isbn;
    const userReview = req.query.review;
    
    // Get the user.
    const currentUser = req.session.authorization.username;
  
    // Get all the book reviews for the given ISBN.
    let bookReviews = books[bookISBN].reviews;
    
      // If there is an existing review, just modify it with the new one.
      if (bookISBN && userReview) {
        bookReviews[currentUser] = userReview;
        
      }
   
    
    res.send("The user's review has been added/updated successfully.");
  });

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const bookISBN = req.params.isbn;
    const userReview = req.query.review;
    //get user
    const currentUser = req.session.authorization.username;
    //Get all book reviews for the given ISBN.
    const bookReviews = books[bookISBN].reviews;

    if (bookISBN && userReview){
        delete bookReviews[currentUser];
    }
    
    res.send("The review was deleted successfully.");
});  
    



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
