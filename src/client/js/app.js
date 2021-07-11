import {performAction} from "./performAction.js";



const remove_trip = document.getElementById('remove_trip').addEventListener('click', function (e) {
    document.getElementById('trip_details').reset();
    trip_details_section.classList.add('invisible');
    location.reload();
});


document.getElementById('generate').addEventListener('click', performAction);


export {
    remove_trip,
}