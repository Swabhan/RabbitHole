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
        chrome.storage.local.set({ "rabbitId": {"prev": null}});
    }
});



chrome.tabs.onUpdated.addListener(function(){
    /*
    Listener to detect tab changes, entry point for search history updates
    */
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        updateRabbitHole(tabs[0].url);
    });
});

function updateRabbitHole(url){
    chrome.storage.local.get(["rabbitId"]).then((result) => {
        /*
        Updates current rabbit hole when data arrives
        */

        let rabbitData = result.rabbitId || {"prev": null};

        //Update rabbit hole
        if(rabbitData["prev"] != url){
            rabbitData[url] = {
                method: "search: ",
                from: rabbitData["prev"]
            };
    
            rabbitData["prev"] = url;
            
        }

        console.log(rabbitData);
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

//Recieve messages from content script
chrome.runtime.onMessage.addListener((message) => {
    if (message === 'toggle_panel') {
      chrome.sidePanel.open({ windowId: windowId });
    }
});