/*
    Main Service Worker

    This Service worker acts as a proxy between the browser's API and the key functionalities
*/


//--------
// Setup
//--------
var rabbitName = "";

//Set Rabbit Default to Tutorial
async function getRabbitName(){
    await chrome.storage.local.get("rabbit").then((result) => {
        if (!result.rabbit) {
            chrome.storage.local.set({"rabbit": {"curr": "Tutorial", "holes": []}});
        }

        rabbitName = result.rabbit["curr"];
    }).catch((error) => {
        chrome.storage.local.set({"rabbit": {"curr": "Tutorial", "holes": []}});
        rabbitName = "Tutorial"
    });

    return rabbitName;
}

//Checks if values exist within current rabbit hole, if not, set to default value
async function setupRabbit(){
    rabbitName = await getRabbitName();

    await chrome.storage.local.get([rabbitName]).then((result) => 
    {
        if (!result[rabbitName]) {
            chrome.storage.local.set({ [rabbitName]: { "curr": null, "entry": null } });
        }
        
    }).catch((error) => {
        chrome.storage.local.set({ [rabbitName]: {"curr": null, "entry": null}});
    });

    return rabbitName
}

setupRabbit();


//Enable Side Panel to open on button click
chrome.sidePanel
          .setPanelBehavior({ openPanelOnActionClick: true })
          .catch((error) => console.error(error));

//-------------------------
// "Dig" for update/delete
//-------------------------

async function updateRabbitHole(url, title, favIconUrl){
    rabbitName = await setupRabbit();

    await chrome.storage.local.get([rabbitName]).then((result) => {
        /*
        Updates current rabbit hole when data arrives
        */

        let rabbitData = result[rabbitName] || {"curr": null};

        //Update rabbit hole, if url hasn't been added previously
        if(!(url in rabbitData)){
            rabbitData[url] = {
                "method": "search: ",
                "prev": rabbitData["curr"],
                "next": null,
                "title": title,
                "favIcon": favIconUrl
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
        chrome.storage.local.set({ [rabbitName]: rabbitData });
    });
}


async function deleteRabbitHole(url){
    rabbitName = await setupRabbit();

    await chrome.storage.local.get([rabbitName]).then((result) => {
        /*
        Deletes element from graph to cover a hole

        To Do - next for each URL should be alternative ds to list for ease of deletion
        */

        let rabbitData = result[rabbitName] || {"curr": null};

        //Temp holding variables
        const prev = rabbitData[url]["prev"]
        const next = rabbitData[url]["next"]


        if(next){
            //Remove node, update prev's next and next's prev
            next.forEach((item, index) => {
                if((item in rabbitData)){ //refactor, make removing from list proper (different ds?)
                    rabbitData[item]["prev"] = prev;
                    rabbitData[prev]["next"].push(item);
                }
            });
        }
        else {
            if(!prev && !next){
                rabbitData[url]["prev"] = null
                rabbitData[url]["next"] = null
            }
        }
        
        delete rabbitData[url];
        rabbitData["curr"] = prev;

        //Set rabbit hole
        chrome.storage.local.set({ [rabbitName]: rabbitData });
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

async function BuildPath(url, title, favIconUrl){
    /*
    Build path to the current URL from entry

    Traverses backwards from current URL or latest node from graph
    */ 

    rabbitName = await setupRabbit();

    //Path storage
    let path = [];

    //Recieve data to parse
    await chrome.storage.local.get([rabbitName]).then((result) => {
        let rabbitData = result[rabbitName] || {"curr": null};
        
        if(url in rabbitData){
            //Build to current path, traverse backwards
            let currentURl = url;

            while(currentURl != rabbitData["entry"]){
                path.push({
                    "url": currentURl,
                    "title": rabbitData[currentURl]["title"],
                    "favIcon": rabbitData[currentURl]["favIcon"]
                });

                currentURl = rabbitData[currentURl]["prev"];
            }

            path.push({
                "url": currentURl,
                "title": rabbitData[currentURl]["title"],
                "favIcon": rabbitData[currentURl]["favIcon"]
            });

            // Also update current url while here
            result[rabbitName]["curr"] = url;

            //Set rabbit hole
            chrome.storage.local.set({ [rabbitName]: rabbitData });
        }

        else {
            //If url is not accounted for, build from current node with url pushed
            let currentURl = rabbitData["curr"];

            path.push({
                "url": url,
                "title": title,
                "favIcon": favIconUrl
            });

            while(currentURl != null && currentURl != rabbitData["entry"]){
                path.push({
                    "url": currentURl,
                    "title": rabbitData[currentURl]["title"],
                    "favIcon": rabbitData[currentURl]["favIcon"]
                });

                currentURl = rabbitData[currentURl]["prev"];
            }

            path.push({
                "url": currentURl,
                "title": rabbitData[currentURl]["title"],
                "favIcon": rabbitData[currentURl]["favIcon"]
            });


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

    let proceed = true;
    chrome.tabs.query({currentWindow: true, active: true}, async function(tabs){
        if(proceed){
            currPath = await BuildPath(tabs[0].url, tabs[0].title, tabs[0].favIconUrl);
        }

        proceed = false;
        
    });
});

chrome.tabs.onUpdated.addListener(function (activeInfo) {
    //On tab Change
    let proceed = true;
    chrome.tabs.query({currentWindow: true, active: true}, async function(tabs){
        if(proceed){
            currPath = await BuildPath(tabs[0].url, tabs[0].title, tabs[0].favIconUrl);
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
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            chrome.sidePanel.open({ tabId: tabs[0].id });

            chrome.sidePanel.setOptions({
                path: 'panel.html',
            });
        });
    }

    //Add new rabbit, will be present and selectable on dropdown in panel.html
    else if (message.action === 'addNew') {
        chrome.storage.local.get(["rabbit"]).then((result) => {
            console.log(result);

            //Update Result
            result.rabbit.holes.push(message.rabbit);
            result.rabbit.curr = message.rabbit;

            chrome.storage.local.set(result);
            setupRabbit();
        });

        sendResponse({ success: true });
    }

    //If different rabbit is selected, update current
    else if (message.action === 'updateRabbit') {
        chrome.storage.local.get(["rabbit"]).then((result) => {
            console.log(result);

            //Update Result
            result.rabbit.curr = message.rabbit;

            chrome.storage.local.set(result);
            setupRabbit();
        });

        setupRabbit();

        sendResponse({ success: true });
    }

    //Send data to panel when opened - refer to panel.js
    else if (message === 'panel_data') {
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            chrome.storage.local.get([rabbitName, "rabbit"]).then((result) => {

                let rabbitData = result[rabbitName]  || {"curr": null};
                sendResponse({"fullGraph": rabbitData, "path": currPath, "rabbitName": rabbitName, "holes": result["rabbit"]["holes"]});
            });
        });
    }

    //When page opens, message context script confirming url containment
    else if (message === 'contains') {
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            chrome.storage.local.get([rabbitName]).then((result) => {
                let rabbitData = result[rabbitName] || {"curr": null};
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
            updateRabbitHole(tabs[0].url, tabs[0].title, tabs[0].favIconUrl);
        });
    }

    //If "✔" is clicked, cover hole functionality
    else if (message === 'delete') {
        chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
            deleteRabbitHole(tabs[0].url);
        });
    }

    else if (message === 'graphPanel') {
        chrome.sidePanel.setOptions({
            path: 'graphPanel.html',
        });
    }

    

    return true;
});