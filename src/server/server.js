// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');



// Start up an instance of app
const app = express();

// Setup Server
const port = 8800;
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
    res.send(projectData);
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
projectData["temp"] = data.temp;
projectData["resp"] = data.resp;

response.send(projectData);
}