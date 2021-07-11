import {
    performAction
} from "./performAction.js";



const remove_trip = document.getElementById('remove_trip').addEventListener('click', function (e) {
    document.getElementById('t_details').reset();
    trip_details.classList.add('invisible');
    location.reload();
});


document.getElementById('generate').addEventListener('click', performAction);


export {
    remove_trip,
}