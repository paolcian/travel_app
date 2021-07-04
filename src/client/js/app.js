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

    try {
    getGeoNames(info['city'])

        .then((data) => {
            const latitude = data.geonames[0].lat;
            const longitude = data.geonames[0].lng;
            console.log(longitude);
            console.log(latitude);
            return getWeather(latitude, longitude, info['date']);
            })
            .then((weatherData) => {
                //Storing the weather details
                info['max_temp'] = weatherData['data'][0]['max_temp'];
                info['min_temp'] = weatherData['data'][0]['min_temp'];
                info['weather_desc'] = weatherData['data']['0']['weather']['description'];

                //Calling Pixabay API to fetch the first img of the city
                return getImage(info['city']);
            })
            .then((imageDetails) => {
                if (imageDetails['hits'].length > 0) {
                    info['cityImage'] = imageDetails['hits'][0]['webformatURL'];
                }
                //Sending data to server to store the details.
                return postData(info);
            })
            .then((data) => {
                //Receiving the data from server and updating the UI
                updateUI(data);
            })
    } catch (e) {
        console.log('error', e);
    }
}

    async function getGeoNames(city) {
        const response = await fetch(baseUrl + city + '&maxRows=10&username=' + username);
        try {
            return await response.json();
        } catch (e) {
            console.log('error', e);
        }
    }
    

    async function getWeather(latitude, longitude, date) {
        const response = await fetch(weatherbitUrl + latitude + '&lon=' + longitude + '&key=' + weatherbitApiKey);
        try {
            return await response.json();
        } catch (e) {
            console.log('error', e);
        }
    }


    async function getImage(dest) {
        const response = await fetch(pixabayUrl + pixabayApiKey + '&q=' + dest + ' city&image_type=photo');
        try {
            return await response.json();
        } catch (e) {
            console.log('error', e);
        }
    }
    
//postData

const postData = async (url = 'https://localhost:8082/postData', data = {})=>{
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

//update UI

function updateUI (data){
    console.log(projectData);
    let dest_desc_photo = document.getElementById('images');
    let max_temp = document.getElementById('temperature');
    if (data.cityImage !== undefined) {
        dest_desc_photo.setAttribute('src', data.cityImage);
    }
    max_temp.innerHTML = data.max_temp + '&#8451;'

}
    export {
        performAction
    }