/* Global Variables */
const baseUrl = 'http://api.geonames.org/searchJSON?q=';
const username = 'paolcian';
const weatherbitApiKey = '15da1f3f99444c958a997e5916fdab92';
const weatherbitUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=';
const weatherbitUrlCur = 'https://api.weatherbit.io/v2.0/current?lat=';
const pixabayApiKey = '20000768-2796e3683658d1cb5d43093d5';
const pixabayUrl = 'https://pixabay.com/api/?key=';
const timeToday = (Date.now())/1000;


function performAction(e){
    e.preventDefault();
    
    const userCity = document.getElementById('city').value;
    const userDate = document.getElementById('date').valueAsDate;
    const time = (new Date(userDate.getTime()))/1000;


    getGeoNames(userCity)

        .then(function(data) {
            const latitude = data.geonames[0].lat;
            const longitude = data.geonames[0].lng;
            console.log(longitude, latitude);

            return getWeather(latitude, longitude, userDate);
            })
            .then(function(weatherData) {
                //Storing the weather details
                const tempMax = weatherData['data'][0]['max_temp'];
                const tempMin = weatherData['data'][0]['min_temp'];
                const weather = weatherData['data']['0']['weather']['description'];
                const timeLeft = Math.round((time - timeToday)/86400);
                console.log(tempMax, tempMin, weather);
                return getImage(userCity);

                })
                .then(function(imageData) {
                    const cityImage = imageData['hits'][0]['webformatURL'];
  
                    console.log(cityImage);
                    })
                    .then(function(data) {
                        postData('http://localhost:8081/add', {
                            date: userDate,
                            max: tempMax,
                            min: tempMin,
                            weather: weather,
                            city: userCity,
                            daysLeft: timeLeft,
                            photo: cityImage
                        })
                    })
                    .then( ()=>{
                        updateUI()})
                        .catch(error => {
                            alert("Please provide correct data!");
                        })

                
   const getGeoNames = async (city) => {
        const response = await fetch(baseUrl + city + '&maxRows=10&username=' + username);
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

 const postData = async (url='', data = {}) =>{
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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

const updateUI = async()=>{
    const request = await fetch('http://localhost:8081/all');
    try{
    const projectData = await request.json();
    console.log(projectData);
    document.getElementById('resCity').innerHTML = `Date: ${projectData.city}`;
    document.getElementById('resDate').innerHTML = `Date: ${projectData.date}`;
    document.getElementById('min').innerHTML = `Date: ${projectData.min}`;
    document.getElementById('max').innerHTML = `Date: ${projectData.max}`;
    document.getElementById('temperature').innerHTML = `Temperature: ${projectData.weather}`;
    document.getElementById('images').innerHTML = `I feel: ${projectData.photo}`;
    }catch(err){
    console.log('error',err);
    }
    };


}
    export {
        performAction
    }