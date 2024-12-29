// Creating the hover trigger rectangle
var hoverTrigger = document.createElement("DIV");
hoverTrigger.id = "hoverTrigger";

hoverTrigger.style.position = "fixed";
hoverTrigger.style.top = "20%";
hoverTrigger.style.right = "0";
hoverTrigger.style.width = "10px";
hoverTrigger.style.height = "110px";
hoverTrigger.style.backgroundColor = "#ccc";
hoverTrigger.style.cursor = "pointer";
hoverTrigger.style.zIndex = "1000";

// Creating a container for the buttons
var btnContainer = document.createElement("DIV");
btnContainer.id = "btnContainer";

btnContainer.style.position = "fixed";
btnContainer.style.top = "20%";
btnContainer.style.right = "-60px";
btnContainer.style.width = "60px";
btnContainer.style.display = "flex";
btnContainer.style.flexDirection = "column";
btnContainer.style.alignItems = "center";
btnContainer.style.transition = "right 0.3s ease";
btnContainer.style.zIndex = "1001";

var open = false; // Used to keep track of open/close trigger
var isCooldown = false;

// Add hover functionality to reveal buttons
hoverTrigger.onmouseover = function () {
    if (isCooldown) return;

    isCooldown = true;
    setTimeout(() => (isCooldown = false), 300);

    if (open) {
        btnContainer.style.right = "-60px";
        open = false;
    } else {
        btnContainer.style.right = "10px";
        open = true;
    }
};

// Creating the "Rabbit" button
var btnRabbit = document.createElement("BUTTON");
btnRabbit.id = "rabbitEntry";

var imgRabbit = document.createElement("IMG");

imgRabbit.src = chrome.runtime.getURL("rabbit.png");
imgRabbit.style.width = "100%";
imgRabbit.style.height = "100%";

btnRabbit.appendChild(imgRabbit);

// Styling the btnRabbit
btnRabbit.style.width = "50px";
btnRabbit.style.height = "50px";
btnRabbit.style.border = "none";
btnRabbit.style.borderRadius = "5px";
btnRabbit.style.overflow = "hidden";
btnRabbit.style.padding = "0";
btnRabbit.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 1.4)";
btnRabbit.style.cursor = "pointer";
btnRabbit.style.backgroundColor = "#fff";
btnRabbit.style.marginTop = "10px";
btnRabbit.style.color = "pink";


// Adding hover effect to the Rabbit button
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

btnPlus.style.width = "50px";
btnPlus.style.height = "50px";
btnPlus.style.border = "none";
btnPlus.style.borderRadius = "5px";
btnPlus.style.backgroundColor = "#34A853";
btnPlus.style.color = "#fff";
btnPlus.style.fontSize = "24px";
btnPlus.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
btnPlus.style.cursor = "pointer";

// Adding hover effect to the Plus button
btnPlus.onmouseover = function () {
    btnPlus.style.backgroundColor = "#2c8c42";
};
btnPlus.onmouseout = function () {
    btnPlus.style.backgroundColor = "#34A853";
};


//Set digButton functionality
chrome.runtime.sendMessage("contains", (response) => {
    //If rabbit hole contains url, set button to checked, otherwise +
    const digButton = document.getElementById("dig");

    if(response["return"] == "false") {
        digButton.innerHTML = "+";
    }
    else {
        digButton.innerHTML = "✔";
    }
    
});

// Appending buttons to the container
btnContainer.appendChild(btnPlus); // Add Plus button first
btnContainer.appendChild(btnRabbit); // Add Rabbit button second

// Appending the container and the hover trigger to the DOM
document.body.appendChild(hoverTrigger);
document.body.appendChild(btnContainer);

function toggleWrap() {
    // Send message to service worker (service.js) to open panel
    chrome.runtime.sendMessage("toggle_panel", () => {});
}

function digWrap() {
    //Update to checkmark on click
    const digButton = document.getElementById("dig");
    if (digButton.innerHTML == "+") {
        // Send message to service worker (service.js) to dig
        chrome.runtime.sendMessage("dig", () => {});

        digButton.innerHTML = "✔";
    } else {
        // Send message to service worker (service.js) to delete
        chrome.runtime.sendMessage("delete", () => {});

        digButton.innerHTML = "+";
    }

}

// When rabbit hole button clicked, open/close side panel
btnRabbit.addEventListener("click", toggleWrap);

// When + button is clicked, the rabbit "digs" by adding page to our history
btnPlus.addEventListener("click", digWrap);
