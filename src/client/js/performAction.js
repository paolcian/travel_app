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
   // details['daysLeft'] = date_diff_indays(details['date']);

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
  
                    console.log(cityImage);
                    return postData(details);
                    })
                    .then( ()=>{
                        updateUI()})
                        .catch(error => {
                            alert("Please provide correct data!");
                        })
                    } catch (e) {
                        console.log('error', e);
                    }
                

                
   const getGeoNames = async (to) => {
        const response = await fetch(baseUrl + to + '&maxRows=10&username=' + username);
        try {
            return await response.json();
        } catch (e) {
            console.log('error - getGeoNames', e);
        }
    }
    

 const getWeather = async (latitude, longitude, date) => {
    const timestamp_trip_date = Math.floor(new Date(date).getTime() / 1000);
    const todayDate = new Date();
    const timestamp_today = Math.floor(new Date(todayDate.getFullYear() + '-' + todayDate.getMonth() + '-' + todayDate.getDate()).getTime() / 1000);

        let response = await fetch(weatherbitUrl + latitude + '&lon=' + longitude + "&start_date=" + date + "&end_date="+ date +"&units=I" + "&key=" + weatherbitApiKey);
        console.log(response);
        try {
            return await response.json();
        } catch (e) {
            console.log('error - getWeather', e);
        }
    }


  const getImage = async (city) => {
        const response = await fetch(pixabayUrl + pixabayApiKey + '&q=' + city + ' city&image_type=photo');
        try {
            return await response.json();
        } catch (e) {
            console.log('error', e);
        }
    }
    
//postData

 const postData = async (details) =>{
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

const updateUI = async(data)=>{
    section_trip_details.classList.remove('invisible');
    section_trip_details.scrollIntoView({behavior: "smooth"});

    let destination_details = document.getElementById("destination");
    let boarding_details = document.getElementById("boarding");
    let departure_date = document.getElementById("departing_date");
    let number_of_days = document.getElementById('number_of_days');
    let temperature = document.getElementById('temperature');
    let dest_desc_photo = document.getElementById('dest_desc_photo');
    let weather = document.getElementById('weather');

    destination_details.innerHTML = data.to;
    boarding_details.innerText = data.from;
    departure_date.innerHTML = data.date;

    if (data.daystogo < 0) {
        document.querySelector('#days_to_go_details').innerHTML = 'Seems like you have already been to the trip!';
    } else {
        number_of_days.innerHTML = data.daystogo;
    }
    temperature.innerHTML = data.temperature + '&#8451;';
    if (data.cityImage !== undefined) {
        dest_desc_photo.setAttribute('src', data.cityImage);
    }

    weather.innerHTML = data.weather;
}

let date_diff_indays = function (date1) {
    let dt1 = new Date(date1);
    let dt2 = new Date();
    return Math.floor((Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) - Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate())) / (1000 * 60 * 60 * 24));
};


}
    export {
        performAction, section_trip_details
    }