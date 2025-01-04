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


// Creating the graph button
var btnGraph = document.createElement("BUTTON");
btnGraph.id = "graph";

// Create the SVG icon
var svgNS = "http://www.w3.org/2000/svg";
var svgIcon = document.createElementNS(svgNS, "svg");
svgIcon.setAttribute("xmlns", svgNS);
svgIcon.setAttribute("width", "24");
svgIcon.setAttribute("height", "24");
svgIcon.setAttribute("fill", "currentColor");
svgIcon.setAttribute("class", "bi bi-diagram-3");
svgIcon.setAttribute("viewBox", "0 0 16 16");

var path1 = document.createElementNS(svgNS, "path");
path1.setAttribute("fill-rule", "evenodd");
path1.setAttribute("d", "M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5zM8.5 5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5zM0 11.5A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm4.5.5A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm4.5.5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z");

svgIcon.appendChild(path1);
btnGraph.appendChild(svgIcon);

// Styling the button
btnGraph.style.width = "50px";
btnGraph.style.height = "50px";
btnGraph.style.border = "none";
btnGraph.style.borderRadius = "5px";
btnGraph.style.backgroundColor = "#34A853";
btnGraph.style.color = "#fff";
btnGraph.style.fontSize = "24px";
btnGraph.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
btnGraph.style.cursor = "pointer";
btnGraph.style.marginTop = "10px";
btnGraph.style.display = "flex";
btnGraph.style.alignItems = "center";
btnGraph.style.justifyContent = "center";

// Adding hover effects
btnGraph.onmouseover = function () {
    btnGraph.style.backgroundColor = "#2c8c42";
};
btnGraph.onmouseout = function () {
    btnGraph.style.backgroundColor = "#34A853";
};


// Creating the group btn
var btnGroup = document.createElement("BUTTON");
btnGroup.id = "group";

// Create the SVG icon
var svgNS = "http://www.w3.org/2000/svg";
var svgIcon = document.createElementNS(svgNS, "svg");
svgIcon.setAttribute("xmlns", svgNS);
svgIcon.setAttribute("width", "24");
svgIcon.setAttribute("height", "24");
svgIcon.setAttribute("fill", "currentColor");
svgIcon.setAttribute("class", "bi bi-people-fill");
svgIcon.setAttribute("viewBox", "0 0 16 16");

var path1 = document.createElementNS(svgNS, "path");
path1.setAttribute("fill-rule", "evenodd");
path1.setAttribute("d", "M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5");

svgIcon.appendChild(path1);
btnGroup.appendChild(svgIcon);

btnGroup.style.width = "50px";
btnGroup.style.height = "50px";
btnGroup.style.border = "none";
btnGroup.style.borderRadius = "5px";
btnGroup.style.backgroundColor = "#34A853";
btnGroup.style.color = "#fff";
btnGroup.style.fontSize = "24px";
btnGroup.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
btnGroup.style.cursor = "pointer";
btnGroup.style.marginTop = "10px";
btnGroup.style.alignItems = "center";
btnGroup.style.justifyContent = "center";

// Adding hover effect to the Plus button
btnGroup.onmouseover = function () {
    btnGroup.style.backgroundColor = "#2c8c42";
};
btnGroup.onmouseout = function () {
    btnGroup.style.backgroundColor = "#34A853";
};


// Creating the graph button
var btnGraph = document.createElement("BUTTON");
btnGraph.id = "graph";

// Create the SVG icon
var svgNS = "http://www.w3.org/2000/svg";
var svgIcon = document.createElementNS(svgNS, "svg");
svgIcon.setAttribute("xmlns", svgNS);
svgIcon.setAttribute("width", "24");
svgIcon.setAttribute("height", "24");
svgIcon.setAttribute("fill", "currentColor");
svgIcon.setAttribute("class", "bi bi-diagram-3");
svgIcon.setAttribute("viewBox", "0 0 16 16");

var path1 = document.createElementNS(svgNS, "path");
path1.setAttribute("fill-rule", "evenodd");
path1.setAttribute("d", "M6 3.5A1.5 1.5 0 0 1 7.5 2h1A1.5 1.5 0 0 1 10 3.5v1A1.5 1.5 0 0 1 8.5 6v1H14a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0V8h-5v.5a.5.5 0 0 1-1 0v-1A.5.5 0 0 1 2 7h5.5V6A1.5 1.5 0 0 1 6 4.5zM8.5 5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5zM0 11.5A1.5 1.5 0 0 1 1.5 10h1A1.5 1.5 0 0 1 4 11.5v1A1.5 1.5 0 0 1 2.5 14h-1A1.5 1.5 0 0 1 0 12.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm4.5.5A1.5 1.5 0 0 1 7.5 10h1a1.5 1.5 0 0 1 1.5 1.5v1A1.5 1.5 0 0 1 8.5 14h-1A1.5 1.5 0 0 1 6 12.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm4.5.5a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z");

svgIcon.appendChild(path1);
btnGraph.appendChild(svgIcon);

// Styling the button
btnGraph.style.width = "50px";
btnGraph.style.height = "50px";
btnGraph.style.border = "none";
btnGraph.style.borderRadius = "5px";
btnGraph.style.backgroundColor = "#34A853";
btnGraph.style.color = "#fff";
btnGraph.style.fontSize = "24px";
btnGraph.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
btnGraph.style.cursor = "pointer";
btnGraph.style.marginTop = "10px";
btnGraph.style.display = "flex";
btnGraph.style.alignItems = "center";
btnGraph.style.justifyContent = "center";

// Adding hover effects
btnGraph.onmouseover = function () {
    btnGraph.style.backgroundColor = "#2c8c42";
};
btnGraph.onmouseout = function () {
    btnGraph.style.backgroundColor = "#34A853";
};


// Creating the tabs btn
var btnTab = document.createElement("BUTTON");
btnTab.id = "tabs";

// Create the SVG icon
var svgNS = "http://www.w3.org/2000/svg";
var svgIcon = document.createElementNS(svgNS, "svg");
svgIcon.setAttribute("xmlns", svgNS);
svgIcon.setAttribute("width", "24");
svgIcon.setAttribute("height", "24");
svgIcon.setAttribute("fill", "currentColor");
svgIcon.setAttribute("class", "bi bi-people-fill");
svgIcon.setAttribute("viewBox", "0 0 16 16");

var path1 = document.createElementNS(svgNS, "path");
path1.setAttribute("fill-rule", "evenodd");
path1.setAttribute("d", "M0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6zM2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3m2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1");

svgIcon.appendChild(path1);
btnTab.appendChild(svgIcon);

btnTab.style.width = "50px";
btnTab.style.height = "50px";
btnTab.style.border = "none";
btnTab.style.borderRadius = "5px";
btnTab.style.backgroundColor = "#34A853";
btnTab.style.color = "#fff";
btnTab.style.fontSize = "24px";
btnTab.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
btnTab.style.cursor = "pointer";
btnTab.style.marginTop = "10px";
btnTab.style.alignItems = "center";
btnTab.style.justifyContent = "center";

// Adding hover effect to the Plus button
btnTab.onmouseover = function () {
    btnTab.style.backgroundColor = "#2c8c42";
};
btnTab.onmouseout = function () {
    btnTab.style.backgroundColor = "#34A853";
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
    btnContainer.appendChild(btnGraph);
    btnContainer.appendChild(btnGroup);
    btnContainer.appendChild(btnTab);
    
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

function graphWrap() {
    //Executes "graphPanel" message in service.js, opens graphPanel.html
    chrome.runtime.sendMessage("graphPanel", () => {});
}

// When rabbit hole button clicked, open/close side panel
btnRabbit.addEventListener("click", toggleWrap);

// When + button is clicked, the rabbit "digs" by adding page to our history
btnPlus.addEventListener("click", digWrap);

// When graph button is clicked, open graph page in side panel
btnGraph.addEventListener("click", graphWrap);
