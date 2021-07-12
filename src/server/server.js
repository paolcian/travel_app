// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const path = require('path');
const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Start up an instance of app
const app = express();



/* Middleware*/


const bodyParser = require('body-parser');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
// Initialize the main project folder
app.use(express.static('dist'));




// GET and POST routes


app.get('/all', getData);

function getData(req, res) {
    console.log(projectData);
    res.sendFile(path.resolve('dist/index.html'))
}


//post function

app.post('/add', addData);

function addData(request, response) {

    let data = request.body;

    console.log('server side data ', data);

    //date
    //temp -> temperature
    // feelings -> user's input
    projectData["to"] = data.to;
    projectData["max"] = data.max;
    projectData["min"] = data.min;
    projectData["weather"] = data.weather;
    projectData["daysLeft"] = data.daysLeft;
    projectData["photo"] = data.photo;
    projectData["date"] = data.date;


    response.send(projectData);
}

module.exports = app;