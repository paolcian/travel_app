import {
    performAction
} from './js/performAction.js';
import {
    remove_trip
} from './js/app.js';

import './styles/style.scss'


document.getElementById('generate').addEventListener('click', performAction);

export {
    performAction,
    remove_trip
}