/*
    On Screen Buttons Content Script

    Functionality to open/close side panel from the browser and add current page to rabbit hole
*/
// Creating the "Rabbit" button
var btnRabbit = document.createElement("BUTTON");
btnRabbit.id = "rabbitEntry";

var imgRabbit = document.createElement("IMG");
imgRabbit.src = "./rabbit.jpeg";
imgRabbit.alt = "Rabbit";
imgRabbit.style.width = "100%";
imgRabbit.style.height = "100%";

btnRabbit.appendChild(imgRabbit);

// Styling the btnRabbit
btnRabbit.style.position = "fixed";
btnRabbit.style.top = "20%";
btnRabbit.style.right = "10px";
btnRabbit.style.width = "50px";
btnRabbit.style.height = "50px";
btnRabbit.style.border = "none";
btnRabbit.style.borderRadius = "5px";
btnRabbit.style.overflow = "hidden";
btnRabbit.style.padding = "0";
btnRabbit.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
btnRabbit.style.cursor = "pointer";
btnRabbit.style.backgroundColor = "#fff";

// Adding hover effect
btnRabbit.onmouseover = function () {
    btnRabbit.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
};
btnRabbit.onmouseout = function () {
    btnRabbit.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
};

// Creating the add button
var btnPlus = document.createElement("BUTTON");
btnPlus.id = "dig";

var textPlus = document.createTextNode("+");
btnPlus.appendChild(textPlus);

btnPlus.style.position = "fixed";
btnPlus.style.top = "calc(20% - 60px)";
btnPlus.style.right = "10px";
btnPlus.style.width = "50px";
btnPlus.style.height = "50px";
btnPlus.style.border = "none";
btnPlus.style.borderRadius = "5px";
btnPlus.style.backgroundColor = "#34A853";
btnPlus.style.color = "#fff";
btnPlus.style.fontSize = "24px";
btnPlus.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
btnPlus.style.cursor = "pointer";

btnPlus.onmouseover = function () {
    btnPlus.style.backgroundColor = "#2c8c42";
};
btnPlus.onmouseout = function () {
    btnPlus.style.backgroundColor = "#34A853";
};

// Appending both buttons to the DOM
document.body.appendChild(btnRabbit);
document.body.appendChild(btnPlus);

function toggleWrap(){
    //Send message to service worker (service.js)
    chrome.runtime.sendMessage('toggle_panel', () => {});
}
function digWrap(){
    elementIsClicked = true;
}

//When rabbit hole button clicked, open/close side panel
var rabbitEntry = document.getElementById('rabbitEntry');
rabbitEntry.addEventListener('click', toggleWrap);

//When + button is clicked, the rabbit "digs" by adding page to our history
var btnPlus = document.getElementById('dig');
rabbitEntry.addEventListener('click', digWrap);