import {
    performAction
} from './js/performAction.js'
import './styles/style.scss'


document.getElementById('generate').addEventListener('click', performAction);

export {
    performAction
}