/*
    Main Service Worker

    This Service worker acts as a proxy between the browser's API and the key functionalities
*/

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


function updateRabbitHole(url){
    chrome.storage.local.get(["rabbitId"]).then((result) => {
        /*
        Updates current rabbit hole when data arrives
        */

        let rabbitData = result.rabbitId || {"curr": null};

        //Update rabbit hole
        if(rabbitData["curr"] != url){
            rabbitData[url] = {
                "method": "search: ",
                "from": rabbitData["curr"],
                "next": null
            };

            //If next is null, use as empty array
            if(rabbitData["curr"] != null){
                rabbitData[rabbitData["curr"]]["next"] = [];
            }

            //Push to array
            rabbitData[rabbitData["curr"]]["next"].push(url);
           
            //Set entry point for graph
            if(rabbitData["curr"] == null){
                rabbitData["entry"] = url;
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
        */

        let rabbitData = result.rabbitId || {"curr": null};

        //Temp holding variables
        const prev = rabbitData[url]["prev"]
        const next = rabbitData[url]["next"]

        //Remove node, update prev's next and next's prev
        next.forEach((item, index) => {
            rabbitData[item]["prev"] = prev;
            rabbitData[prev]["next"].push(item);
        });

        //Set rabbit hole
        chrome.storage.local.set({ "rabbitId": rabbitData });
    });
}


//Enable Side Panel to open on button click
chrome.sidePanel
          .setPanelBehavior({ openPanelOnActionClick: true })
          .catch((error) => console.error(error));

let windowId;
chrome.tabs.onActivated.addListener(function (activeInfo) {
  windowId = activeInfo.windowId;
});


//Reciever for messages from content scripts
chrome.runtime.onMessage.addListener((message) => {
    //onScreenBtn.js - refer for further context
    if (message === 'toggle_panel') {
      chrome.sidePanel.open({ windowId: windowId });
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
});