/*
    Main Service Worker

    This Service worker acts as a proxy between the browser's API and the key functionalities
*/


//--------
// Setup
//--------

chrome.storage.local.get("rabbitId", function(data)
{
    /*
    Checks if values exist within current rabbit hole, if not, set to default value
    */
    if(chrome.runtime.lastError)
    {
        chrome.storage.local.set({ "rabbitId": {"curr": null, "entry": null}});
    }
});

//Enable Side Panel to open on button click
chrome.sidePanel
          .setPanelBehavior({ openPanelOnActionClick: true })
          .catch((error) => console.error(error));

//-------------------------
// "Dig" for update/delete
//-------------------------

function updateRabbitHole(url){
    chrome.storage.local.get(["rabbitId"]).then((result) => {
        /*
        Updates current rabbit hole when data arrives
        */

        let rabbitData = result.rabbitId || {"curr": null};

        //Update rabbit hole, if url hasn't been added previously
        if(!(url in rabbitData)){
            rabbitData[url] = {
                "method": "search: ",
                "prev": rabbitData["curr"],
                "next": null
            };
           
            //Set entry point for graph
            if(rabbitData["curr"] == null){
                rabbitData["entry"] = url;
                rabbitData["curr"] = url;
            } else {
                //If next is null, use as empty array
                if(rabbitData["curr"]["next"] == null){
                    rabbitData[rabbitData["curr"]]["next"] = [];
                }

                //Push to array
                rabbitData[rabbitData["curr"]]["next"].push(url);
            }

            //Update current working url
            rabbitData["curr"] = url;
            
        }

        //Set rabbit hole
        chrome.storage.local.set({ "rabbitId": rabbitData });
    });
}


function deleteRabbitHole(url){
    chrome.storage.local.get(["rabbitId"]).then((result) => {
        /*
        Deletes element from graph to cover a hole

        To Do - next for each URL should be alternative ds to list for ease of deletion
        */

        let rabbitData = result.rabbitId || {"curr": null};

        //Temp holding variables
        const prev = rabbitData[url]["prev"]
        const next = rabbitData[url]["next"]


        //Remove node, update prev's next and next's prev
        next.forEach((item, index) => {
            if((item in rabbitData)){ //refactor, make removing from list proper (different ds?)
                rabbitData[item]["prev"] = prev;
                rabbitData[prev]["next"].push(item);
            }
        });

        delete rabbitData[url];

        //Set rabbit hole
        chrome.storage.local.set({ "rabbitId": rabbitData });
    });
}

//Auto Add - Potential Feature?
function ifAuto(){
    chrome.tabs.onUpdated.addListener(function(){
        /*
        Listener to detect tab changes, entry point for search history updates
        */
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            updateRabbitHole(tabs[0].url);
        });
    });
}

//---------------
//Path Builder
//---------------

function BuildPath(url){
    /*
    Build path to the current URL from entry

    Traverses backwards from current URL or latest node from graph
    */ 

    //Path storage
    let path = [];

    //Recieve data to parse
    chrome.storage.local.get(["rabbitId"]).then((result) => {
        let rabbitData = result.rabbitId || {"curr": null};

        //Add current url to end of path
        path.push(url);
        
        if(url in rabbitData){
            //Build to current path, traverse backwards
            let currentURl = url;

            while(currentURl != rabbitData["entry"]){
                path.push(currentURl);
                currentURl = rabbitData[currentURl]["prev"];
            }

            // Also update current url while here
            result.rabbitId["curr"] = url;

            //Set rabbit hole
            chrome.storage.local.set({ "rabbitId": rabbitData });
        }

        else {
            //If url is not accounted for, build from current node with url pushed
            let currentURl = rabbitData["curr"];

            while(currentURl != null && currentURl != rabbitData["entry"]){
                path.push(currentURl);
                currentURl = rabbitData[currentURl]["prev"];
            }

        }
    });


    return path;
}

//---------------
//Event Listeners
//---------------

let currPath; //Limits to path building to one time

//Listeners for tabs changes
let windowId;
chrome.tabs.onActivated.addListener(function (activeInfo) {
    //On Tab Open
    windowId = activeInfo.windowId;

    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        currPath = BuildPath(tabs[0].url); // To do - Send data to side panel for display
    });
});

chrome.tabs.onUpdated.addListener(function (activeInfo) {
    //On tab Change
    let proceed = true;
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        if(proceed){
            currPath = BuildPath(tabs[0].url); // To do - Send data to side panel for display
        }

        proceed = false;
        
    });
});


//------------------
//Message Listeners
//------------------

//Reciever for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //Messages are sent from content scripts - refer to manifest.json for list of active context scripts
    //Allows direct communication with service worker

    //If Rabbit Icon is clicked, side panel functionality
    if (message === 'toggle_panel') {
      chrome.sidePanel.open({ windowId: windowId });
    }

    //Send data to panel when opened - refer to panel.js
    else if (message === 'panel_data') {
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            chrome.storage.local.get(["rabbitId"]).then((result) => {
                let rabbitData = result.rabbitId || {"curr": null};
                sendResponse({"fullGraph": rabbitData, "path": currPath});
            });
        });
    }

    //When page opens, message context script confirming url containment
    else if (message === 'contains') {
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            chrome.storage.local.get(["rabbitId"]).then((result) => {
                let rabbitData = result.rabbitId || {"curr": null};
                if(tabs[0].url in rabbitData){
                    sendResponse({"return": "true"});
                } else {
                    sendResponse({"return": "false"});
                }
            });
        });
    }

    //If "+" is clicked, dig functionality
    else if (message === 'dig') {
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            updateRabbitHole(tabs[0].url);
        });
    }

    //If "✔" is clicked, cover hole functionality
    else if (message === 'delete') {
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            deleteRabbitHole(tabs[0].url);
        });
    }

    return true;
});