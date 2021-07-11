const details = {};

/* Global Variables */
const baseUrl = 'http://api.geonames.org/searchJSON?q=';
const username = 'paolcian';
const weatherbitApiKey = '15da1f3f99444c958a997e5916fdab92';
const weatherbitUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=';
const weatherbitUrlCur = 'https://api.weatherbit.io/v2.0/current?lat=';
const pixabayApiKey = '20000768-2796e3683658d1cb5d43093d5';
const pixabayUrl = 'https://pixabay.com/api/?key=';
const section_trip_details = document.getElementById('trip_details');


function performAction(e){
    e.preventDefault();
    
    details['to'] = document.getElementById('city').value;
    details['date'] = document.getElementById('date').value;
    details['daysLeft'] = getCountdown(details['date']);
  

    try{

    getGeoNames(details['to'])

        .then(function(data) {
            const latitude = data.geonames[0].lat;
            const longitude = data.geonames[0].lng;
            console.log(longitude, latitude);

            return getWeather(latitude, longitude, details['date']);
            })
            .then(function(weatherData) {
                //Storing the weather details
                details['max'] = weatherData['data'][0]['max_temp'];
                details['min'] = weatherData['data'][0]['min_temp'];
                details['weather'] = weatherData['data']['0']['weather']['description'];
              
                return getImage(details['to']);

                })
                .then(function(imageData) {
                    details['photo'] = imageData['hits'][0]['webformatURL'];
  
                    console.log(details['photo']);
                    return postData(details);
                    })
                    .then((data) => {
                        //Receiving the data from server and updating the UI
                        updateUI(data);
                    })
                    } catch (e) {
                        console.log('error', e);
                    }
                

                
                    async function getGeoNames  (to) {
        const response = await fetch(baseUrl + to + '&maxRows=10&username=' + username);
        try {
            return await response.json();
        } catch (e) {
            console.log('error - getGeoNames', e);
        }
    }
    

 async function getWeather (latitude, longitude, date) {

        let response = await fetch(weatherbitUrl + latitude + '&lon=' + longitude + "&start_date=" + date + "&end_date="+ date +"&units=I" + "&key=" + weatherbitApiKey);
        console.log(response);
        try {
            return await response.json();
        } catch (e) {
            console.log('error - getWeather', e);
        }
    }


  async function getImage (city) {
        const response = await fetch(pixabayUrl + pixabayApiKey + '&q=' + city + ' city&image_type=photo');
        try {
            return await response.json();
        } catch (e) {
            console.log('error', e);
        }
    }
    

    function getCountdown(date) {
        const countdownDate = new Date(details['date']).getTime();
        const now = new Date().getTime();
        const difference = countdownDate - now;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        return days;
    }
//postData

 async function postData (details) {
    const response = await fetch('http://localhost:4000/add', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(details),
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

//Updating the UI

async function updateUI (data){
    trip_details.classList.remove('invisible');
    trip_details.scrollIntoView({behavior: "smooth"});

    let destination_details = document.getElementById("destination");
    let departure_date = document.getElementById("departing_date");
    let number_of_days = document.getElementById('number_of_days');
    let temperature = document.getElementById('temperature');
    let temperature_min = document.getElementById('temperature_min');
    let dest_desc_photo = document.getElementById('dest_desc_photo');
    let weather = document.getElementById('weather');



  number_of_days.innerHTML = data.daysLeft;


    destination_details.innerHTML = data.to;
    departure_date.innerHTML = data.date;

    
    temperature.innerHTML = Math.round(data.max) + '&#8457;';
    temperature_min.innerHTML = Math.round(data.min) + '&#8457;';
    if (data.photo !== undefined) {
        dest_desc_photo.setAttribute('src', data.photo);
    }

    weather.innerHTML = data.weather;
}


}

    export {
        performAction, section_trip_details
    }