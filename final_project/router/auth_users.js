const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username" : "Youssef" , "password" : "2004"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 

    let Valid = users.filter((user) => {return user.username === username && user.password === password});

    if(Valid.length > 0)
    {
        return true;
    }

    return false;

}

regd_users.post("/login", (req,res) => {

    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password)
    {
       return res.status(404).json({message : "Error logging in"});
    }

    if(authenticatedUser(username,password))
    {
       let accessToken = jwt.sign({
            data:password
        },"access",{expiresIn: 60 * 60});

        req.session.authorization = {accessToken,username};

        return res.status(200).json({message : "User Successfully logged in"});
    }

    else
    {
        return res.status(208).json({message: "Invalid Login. Check username and password" });
    }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
    const isbn = req.params.isbn;
    const review = req.query.review;
    const sessionUser = req.session?.authorization?.username;
  
    if (!sessionUser) {
      return res.status(401).json({ message: "User not logged in!" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found!" });
    }
  
    books[isbn].reviews[sessionUser] = review;
  
    return res.status(200).json({ message: "Review added/updated successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;  
    const sessionUser = req.session?.authorization?.username;

    if (!sessionUser) {
        return res.status(403).json({ message: "User not logged in!" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found!" });
    }

    if (!books[isbn].reviews[sessionUser]) {
        return res.status(404).json({ message: "Review not found for this user!" });
    }

    delete books[isbn].reviews[sessionUser];

    return res.status(200).json({ message: "Review deleted successfully!" });
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
