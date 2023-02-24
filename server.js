// Researched MDN for express, express official website for body-parser, node official website for fs module
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Tutorial_local_library_website
// https://expressjs.com/en/resources/middleware/body-parser.html
// https://nodejs.org/api/fs.html

// importing the relevant modules for our project
import express from 'express';
import bodyParser from 'body-parser';
import productItems from "./productItems.json" assert {type: "json"};

// access the computer's file system so we can read, and write to it
import fs from 'fs';

// initialising express in our project
const app = express();

// where our server will listen for requests
const PORT = 3000;

// we're going to use JSON data in our project
app.use(bodyParser.json());

// creating our routes
// getting all our items from our 'productItems.json' and displaying them in the browser 
app.get("/api", (req, res) => {
    res.send(productItems);
})

// route to add an item to our 'productItems.json' file
app.post("/api", (req, res) => {

    // getting the content entered by the user in Postman and saving it to a variable
    let itemToAdd = req.body;

    // saving the new item to our file
    productItems.push(itemToAdd);
    fs.writeFileSync('productItems.json', JSON.stringify(productItems));

    // message displayed if save successful
    res.send(`Title with the name ${req.body.title} added successfully!`);
})

// function created to delete an item from our 'productItems.json' file
function deleteItem(itemToDelete){

    // getting all our items
    const allItems = productItems;

    // deleting the specific item from it
    allItems.splice(itemToDelete, 1)

    // saving this change to our file
    fs.writeFileSync('productItems.json', JSON.stringify(allItems))
}

// delete an item from our 'projectItems.json' file
app.delete("/api/:id", (req, res) => {

    // route to delete item from our 'projectItems.json' file.
    // saving the item id sent by the user
    // Number() method used to convert string to a number for comparison later
    const itemID = Number(req.params.id);

    // checking if our 'projectItems.json' contains the id number entered by the user
    const searchForID = productItems.find(item => item.id === itemID);

    // if this is yes, then we find the index number where the item id is located in our 'productItems.json' file
    if(searchForID){
        let index = productItems.findIndex(item => { return item.id === itemID});

        // call deleteItem function and pass in the item's index number
        deleteItem(index);

        // once deleted the user is notified
        res.send("Success");
    } else{
        // message displayed if the user's input doesn't match anything in our file
        res.send(false);
    }
})

// route to update an item in our file. We can update either an item's title or description
app.put("/api/:id", (req, res) => {

    // save id entered by the user. parseInt convers to a number to use for comparison later
    const itemId = parseInt(req.params.id);

    // check if the item's id is inside our 'productItems.json' file
    const searchForID =productItems.findIndex(item => { return item.id === itemId});

    // statements below check whether the user entered a new title or description 
    if(req.body.title){

        // updating the old title to the new title
        productItems[searchForID].title = req.body.title;

        // saving this change to our file
        fs.writeFileSync('productItems.json', JSON.stringify(productItems))

        // message if title successfully changed
        res.send("Title sucessfully changed!")

    }else if(req.body.description){

        // updating our old description to the new description
        productItems[searchForID].description = req.body.description;

        // saving this change to our file
        fs.writeFileSync('productItems.json', JSON.stringify(productItems))

        // message if description successfully changed
        res.send("Description sucessfully changed!");

    }else {
        // if the user didn't enter either a new title or description
        res.send("Unable to process, please edit yout title or description again!")
    }
})

// web server will listen to requests here. Message displayed to show server sucessfully running
app.listen(PORT, () => {
    console.log(`Success! Server is running on port ${PORT}`)
})