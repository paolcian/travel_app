// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
var path = require('path');
const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Start up an instance of app
const app = express();

// Setup Server
const port = 4000;
const server = app.listen(port, listening);

function listening(){
    console.log('server running');
    console.log(`running on localhost: ${port}`);
}

/* Middleware*/


const bodyParser = require('body-parser');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
// Initialize the main project folder
app.use(express.static('dist'));




// GET and POST routes

 projectData = {};


app.get('/all', getData);

function getData (req, res) { 
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

projectData["date"] = data.date;
projectData["max"] = data.max;
projectData["min"] = data.min;
projectData["weather"] = data.weather;
projectData["city"] = data.city;
projectData["daysLeft"] = data.daysLeft;
projectData["photo"] = data.photo;

response.send(projectData);
}