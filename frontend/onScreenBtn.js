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


// Creating the notes button
var btnNotes = document.createElement("BUTTON");
btnNotes.id = "notes";

// Create the SVG icon
var svgNS = "http://www.w3.org/2000/svg";
var svgIcon = document.createElementNS(svgNS, "svg");
svgIcon.setAttribute("xmlns", svgNS);
svgIcon.setAttribute("width", "24");
svgIcon.setAttribute("height", "24");
svgIcon.setAttribute("fill", "currentColor");
svgIcon.setAttribute("class", "bi bi-pen");
svgIcon.setAttribute("viewBox", "0 0 16 16");

var path1 = document.createElementNS(svgNS, "path");
path1.setAttribute("fill-rule", "evenodd");
path1.setAttribute("d", "m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z");

svgIcon.appendChild(path1);
btnNotes.appendChild(svgIcon);

btnNotes.style.width = "50px";
btnNotes.style.height = "50px";
btnNotes.style.border = "none";
btnNotes.style.borderRadius = "5px";
btnNotes.style.backgroundColor = "#34A853";
btnNotes.style.color = "#fff";
btnNotes.style.fontSize = "24px";
btnNotes.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
btnNotes.style.cursor = "pointer";
btnNotes.style.marginTop = "10px";

// Adding hover effect to the Plus button
btnNotes.onmouseover = function () {
    btnNotes.style.backgroundColor = "#2c8c42";
};
btnNotes.onmouseout = function () {
    btnNotes.style.backgroundColor = "#34A853";
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
btnTab = document.createElement("BUTTON");
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

// Creating the Explore Button
var btnExplore = document.createElement("BUTTON");
btnExplore.id = "explore";

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
path1.setAttribute("d", "M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z");

svgIcon.appendChild(path1);
btnExplore.appendChild(svgIcon);

btnExplore.style.width = "50px";
btnExplore.style.height = "50px";
btnExplore.style.border = "none";
btnExplore.style.borderRadius = "5px";
btnExplore.style.backgroundColor = "#34A853";
btnExplore.style.color = "#fff";
btnExplore.style.fontSize = "24px";
btnExplore.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
btnExplore.style.cursor = "pointer";
btnExplore.style.marginTop = "10px";
btnExplore.style.alignItems = "center";
btnExplore.style.justifyContent = "center";

// Adding hover effect to the Plus button
btnExplore.onmouseover = function () {
    btnExplore.style.backgroundColor = "#2c8c42";
};
btnExplore.onmouseout = function () {
    btnExplore.style.backgroundColor = "#34A853";
};


//Info Button
var btnInfo = document.createElement("BUTTON");
btnInfo.id = "info";

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
path1.setAttribute("d", "M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2");

svgIcon.appendChild(path1);
btnInfo.appendChild(svgIcon);

btnInfo.style.width = "50px";
btnInfo.style.height = "50px";
btnInfo.style.border = "none";
btnInfo.style.borderRadius = "5px";
btnInfo.style.backgroundColor = "#34A853";
btnInfo.style.color = "#fff";
btnInfo.style.fontSize = "24px";
btnInfo.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
btnInfo.style.cursor = "pointer";
btnInfo.style.marginTop = "10px";
btnInfo.style.alignItems = "center";
btnInfo.style.justifyContent = "center";

// Adding hover effect to the Plus button
btnInfo.onmouseover = function () {
    btnInfo.style.backgroundColor = "#2c8c42";
};
btnInfo.onmouseout = function () {
    btnInfo.style.backgroundColor = "#34A853";
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
btnContainer.appendChild(btnNotes); // Add Notes button second
btnContainer.appendChild(btnRabbit); // Add Rabbit button third

// Appending the container and the hover trigger to the DOM
document.body.appendChild(hoverTrigger);
document.body.appendChild(btnContainer);

function toggleWrap() {
    // Send message to service worker (service.js) to open panel
    btnContainer.appendChild(btnGraph);
    btnContainer.appendChild(btnGroup);
    btnContainer.appendChild(btnTab);
    btnContainer.appendChild(btnExplore);
    btnContainer.appendChild(btnInfo);
    
    chrome.runtime.sendMessage("toggle_panel", () => {});
}

//* All wraps send message to service.js
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

var content = "";

function notesWrap() {
    chrome.runtime.sendMessage("notes", (response) => {
        //Send Message with conent, to be listened to by notesPanel.js
        if(response["return"] != "false"){
            setTimeout(() => {
                chrome.runtime.sendMessage(
                    { action: "inputContent", content: response["return"]}
                );
            }, 300); //Short delay to allow notes DOM to initialize
        }
    });
}

function groupWrap() {
    chrome.runtime.sendMessage("collab", () => {});
}

function tabsWrap() {
    chrome.runtime.sendMessage("tabs", () => {});
}

function exploreWrap() {
    chrome.runtime.sendMessage("explore", () => {});

}

function infoWrap() {
    chrome.runtime.sendMessage("info", () => {});

}

function graphWrap() {
    //Executes "graphPanel" message in service.js, opens graphPanel.html
    chrome.runtime.sendMessage("graphPanel", () => {});
}

// When rabbit hole button clicked, open/close side panel
btnRabbit.addEventListener("click", toggleWrap);

// When + button is clicked, the rabbit "digs" by adding page to our history
btnPlus.addEventListener("click", digWrap);

// When notes button is clicked, opens notes page in side panel
btnNotes.addEventListener("click", notesWrap);

// When graph button is clicked, open graph page in side panel
btnGraph.addEventListener("click", graphWrap);

// When group button is clicked, open group page in side panel
btnGroup.addEventListener("click", groupWrap);

// When group button is clicked, open tabs page in side panel
btnTab.addEventListener("click", tabsWrap);

// When explore button is clicked, open explore page in side panel
btnExplore.addEventListener("click", exploreWrap);

// When info button is clicked, open info page in side panel
btnInfo.addEventListener("click", infoWrap);
