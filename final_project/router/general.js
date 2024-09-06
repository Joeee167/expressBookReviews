const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {return user.username === username});

    if(userswithsamename.length > 0)
    {
        return true;
    }

    else
    {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password)
  {

    if(!doesExist(username))
    {

        users.push({"username" : username , "password" : password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});

    }

    else
    {
        return res.status(404).json({message : "User already exists!"});
    }

  }

  else
  {
    return res.status(404).json({message : "Unable to register user"});
  }
});

public_users.get('/',function (req, res) {
  let allBooks = books;
  res.send(JSON.stringify(allBooks,null,5));
});

public_users.get('/isbn/:isbn',function (req, res) {

    let required = req.params.isbn;
    let book = books[required];

    res.send(JSON.stringify(book,null,4));
 
 });
  
public_users.get('/author/:author',function (req, res) {
    let writer = req.params.author;

    let result=[];

    for(let id in books)
    {
        if(books[id].author === writer)
        {
            result.push(books[id]);
        }
    }

    res.send(JSON.stringify(result,null,5));
  
});

public_users.get('/title/:title',function (req, res) {
    let writer = req.params.title;

    let result=[];

    for(let id in books)
    {
        if(books[id].title === writer)
        {
            result.push(books[id]);
        }
    }

    res.send(JSON.stringify(result,null,5));
});

public_users.get('/review/:isbn',function (req, res) {
  let reqBook = req.params.isbn;
  res.send(books[reqBook].reviews);
});

function getBooksUsingPromise()
{
    axios.get('http://localhost:5001/')
    .then(response => {
        console.log('Books : ',response.data);
    })

    .catch(error => {
        console.error("Error : ",error);
    })
}

function getBooksByISBNUsingPromise()
{
    axios.get('http://localhost:5001/isbn/:isbn')
    .then(response => {
        console.log('Books : ',response.data);
    })

    .catch(error => {
        console.error("Error : ",error);
    })
}

function getBooksByAuthorUsingPromise()
{
    axios.get('http://localhost:5001/author/:authors')
    .then(response => {
        console.log('Books : ',response.data);
    })

    .catch(error => {
        console.error("Error : ",error);
    })
}

function getBooksByTitleUsingPromise()
{
    axios.get('http://localhost:5001/title/:title')
    .then(response => {
        console.log('Books : ',response.data);
    })

    .catch(error => {
        console.error("Error : ",error);
    })
}



getBooksUsingPromise();
getBooksByISBNUsingPromise();
getBooksByAuthorUsingPromise();
getBooksByTitleUsingPromise();

module.exports.general = public_users;
