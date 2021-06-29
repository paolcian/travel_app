/* Global Variables */

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=4f5b273cd40e0c238274a7ce081dd48b&units=metric';


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.toDateString();



document.getElementById('generate').addEventListener('click', performAction);

function performAction(e){
    let newZip = document.getElementById('zip').value;
    let newFeeling = document.getElementById('feelings').value;
    let countryCode = document.getElementById('country').value;
    let str = ',';    

    getFeelings(baseUrl, newZip, str, countryCode, apiKey)

        .then(function(data) {
            postData('/add', {
                temp: Math.round(data.main.temp),
                date: newDate, 
                resp: newFeeling
            });
            }).then( () =>{
            updateUI()})
            .catch(error => {
                alert("Please provide correct data!");
            })
        }

const getFeelings = async (baseUrl, newZip, str, countryCode, apiKey)=>{

    const res = await fetch(baseUrl+newZip+str+countryCode+apiKey);
    console.log(res);
    try {
        const data = await res.json();
        console.log(data);
        return(data);
    } catch(error) {
        console.log("Fetch problem" + error.message);

    }
} 

const postData = async (url = '', data = {})=>{
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    console.log(response);
    try {
        const newData = await response.json();
        console.log(newData);
        return newData;
    } catch(error) {
        console.log("Fetch problem" + error.message);
    }
}; 


const updateUI = async()=>{
    const request = await fetch('/all');
    try{
    const projectData = await request.json();
    console.log(projectData);
    document.getElementById('date').innerHTML = `Date: ${projectData.date}`;
    document.getElementById('temp').innerHTML = `Temperature: ${projectData.temp}`;
    document.getElementById('content').innerHTML = `I feel: ${projectData.resp}`;
    }catch(err){
    console.log('error',err);
    }
    };


    export {
        performAction
    }