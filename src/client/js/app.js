/* Global Variables */
const info = {};
const baseUrl = 'http://api.geonames.org/searchJSON?q=';
const username = 'paolcian';
const weatherbitApiKey = '15da1f3f99444c958a997e5916fdab92';
const weatherbitUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=';
const weatherbitUrlHist = 'https://api.weatherbit.io/v2.0/current?lat=';
const pixabayApiKey = '20000768-2796e3683658d1cb5d43093d5';
const pixabayUrl = 'https://pixabay.com/api/?key=';


function performAction(e){
    e.preventDefault();

    info['city'] = document.getElementById('city').value;
    info['date'] = document.getElementById('date').value; 


    getGeoNames(info['city'])

        .then(function(data) {
            const latitude = data.geonames[0].lat;
            const longitude = data.geonames[0].lng;
            console.log(longitude);
            console.log(latitude);
            return getWeather(latitude, longitude, info['date']);
            })
            .then(function(weatherData) {
                //Storing the weather details
                info['max_temp'] = weatherData['data'][0]['max_temp'];
                info['min_temp'] = weatherData['data'][0]['min_temp'];
                info['weather_desc'] = weatherData['data']['0']['weather']['description'];

                //Calling Pixabay API to fetch the first img of the city
                return getImage(info['city']);
                })
                .then(function(imageData) {
                    if (imageData['hits'].length > 0) {
                    info['cityImage'] = imageData['hits'][0]['webformatURL'];
                    }
                    //Sending data to server to store the details.
                    return postData('http://localhost:8081/add', {info});
                    })
                    .then( () =>{
                        updateUI()})
                        .catch(error => {
                            alert("Please provide correct data!");
                        })
                    }

   const getGeoNames = async (city) => {
        const response = await fetch(baseUrl + city + '&maxRows=10&username=' + username);
        try {
            return await response.json();
        } catch (e) {
            console.log('error - getGeoNames', e);
        }
    }
    

 const getWeather = async (latitude, longitude, date) => {
        const response = await fetch(weatherbitUrl + latitude + '&lon=' + longitude + '&key=' + weatherbitApiKey);
        try {
            return await response.json();
        } catch (e) {
            console.log('error - getWeather', e);
        }
    }


  const getImage = async (dest) => {
        const response = await fetch(pixabayUrl + pixabayApiKey + '&q=' + dest + ' city&image_type=photo');
        try {
            return await response.json();
        } catch (e) {
            console.log('error', e);
        }
    }
    
//postData

const postData = async (url = '/add', info)=>{
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
            city: info.city,
            date: info.date, 
            max_temp: info.max_temp,
            min_temp: info.min_temp,
            weather_desc: info.weather_desc,
            longitude: info.longitude,
            photo: info.photo}
        )
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

//update UI

const updateUI = async()=>{
    const request = await fetch('/all');
    try{
    const projectData = await request.json();
    console.log(projectData);

    document.getElementById('temperature').innerHTML = `Temperature: ${projectData.longitude}`;

    }catch(err){
    console.log('error',err);
    }
    };

    export {
        performAction
    }