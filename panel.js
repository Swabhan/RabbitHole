/*
    Javascript for the Side Panel

    Works closely with active service workers to recieve latest data to display
*/


/*
    Recieve latest data by request through message

    Data consists of current path and whole graph
*/
chrome.runtime.sendMessage("panel_data", (response) => { //- Refer to service.js
    console.log(response["path"]);
});

const header = document.getElementById("header");