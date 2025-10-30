/*
    Main Service Worker

    This Service worker acts as a proxy between the browser's API and the key functionalities
*/

//--------
// Setup
//--------
var rabbitName = "";

//Allows extension to recieve currently active rabbit
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

async function changeRabbit(newRabbit){
    // Update current rabbit only if needed
    const res = await chrome.storage.local.get(["rabbit"]);
    res.rabbit.curr = newRabbit;
    await chrome.storage.local.set({ rabbit: res.rabbit });

}

//Checks if values exist within current rabbit hole, if not, set to default value
async function setupRabbit(){
    rabbitName = await getRabbitName();

    await chrome.storage.local.get([rabbitName, "Tabs"]).then((result) => 
    {
        //Sets starting point
        if (!result[rabbitName]) {
            let initialMap = { "curr": rabbitName, "entry": rabbitName }
            initialMap[rabbitName] = {
                "method": "search: ",
                "prev": null,
                "next": null,
                "title": rabbitName,
                "favIcon": "favIconUrl"
            }
            
            chrome.storage.local.set({ [rabbitName]: initialMap});
        }

        if (!result["Tabs"]) {
            chrome.storage.local.set({ ["Tabs"]: {} });
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
    rabbitName = await setupRabbit(); //Confirms intial data in place

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
           
            //Create list to store proceeding urls
            if(rabbitData[rabbitData["curr"]]["next"] == null){
                rabbitData[rabbitData["curr"]]["next"] = [];
            }

            //Push to array
            rabbitData[rabbitData["curr"]]["next"].push(url);

            //Update current working url
            rabbitData["curr"] = url;
            
        }
        
        //Set rabbit hole
        chrome.storage.local.set({ [rabbitName]: rabbitData });
    });
}

async function deleteRabbitHole(url){
    rabbitName = await setupRabbit(); //Confirms intial data in place

    await chrome.storage.local.get([rabbitName]).then((result) => {
        /*
        Deletes element from graph to cover a hole

        To Do - next for each URL should be alternative ds to list for ease of deletion
        */

        let rabbitData = result[rabbitName] || {"curr": null};

        //Temp holding variables
        const prev = rabbitData[url]["prev"]
        const next = rabbitData[url]["next"]

        if(next){ //If to be deleted node has next values
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

        //Delete from prev's next
        if(rabbitData[url]["prev"]){
            var previous = rabbitData[url]["prev"];

            const index = rabbitData[previous]["next"].indexOf(url);
            if (index > -1) {
                rabbitData[previous]["next"].splice(index, 1);
            }
        }
        
        //Delete from dictionary
        delete rabbitData[url];
        rabbitData["curr"] = prev;

        //Update Rabbit Hole
        chrome.storage.local.set({ [rabbitName]: rabbitData });
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

            if(rabbitData["entry"]){
                path.push({
                    "url": currentURl,
                    "title": rabbitData[currentURl]["title"],
                    "favIcon": rabbitData[currentURl]["favIcon"]
                });
            }
        }
    });

    return path;
}

//-------------------------------------------------------
//Update memory when node is placed within another node
//-------------------------------------------------------
async function switchNode(urlToAdd, urlToMove){
    rabbitName = await setupRabbit();
    var tempStore = {};

    //Recieve data to update
    await chrome.storage.local.get([rabbitName]).then(async (result) => {
        let rabbitData = result[rabbitName] || {"curr": null};

        tempStore = structuredClone(rabbitData[urlToMove]);
        
        //Delete from prev's next
        if(rabbitData[urlToMove]["prev"]){
            var previous = rabbitData[urlToMove]["prev"];

            const index = rabbitData[previous]["next"].indexOf(urlToMove);
            if (index > -1) {
                rabbitData[previous]["next"].splice(index, 1);
                
            }
        
        }

        //Delete Node, will move
        delete rabbitData[urlToMove];
        
        tempStore["prev"] = urlToAdd;

        if(!rabbitData[urlToAdd]["next"]){
            rabbitData[urlToAdd]["next"] = [];
        }
    
        rabbitData[urlToAdd]["next"].push(urlToMove)
        rabbitData[urlToMove] = tempStore;
    
        chrome.storage.local.set({ [rabbitName]: rabbitData });
    });

}

//---------------
//Tab Management
//---------------
async function saveTabs(name, tabs){
    await chrome.storage.local.get(["Tabs"]).then((result) => {
        result["Tabs"][name] = tabs;

        chrome.storage.local.set({Tabs: result["Tabs"]});
    });
}

//---------------
//Event Listeners
//---------------
let currPath; //Limits to path building to one time
let currentPage = "panel.html";

//Listeners for tabs changes
let windowId;
chrome.tabs.onActivated.addListener(function (activeInfo) {
    //On Tab Open
    windowId = activeInfo.windowId;

    chrome.tabs.query({currentWindow: true, active: true}, async function(tabs){
        currPath = await BuildPath(tabs[0].url, tabs[0].title, tabs[0].favIconUrl);
    });

});

chrome.tabs.onUpdated.addListener(function (activeInfo) {
    //On tab Change
    chrome.tabs.query({currentWindow: true, active: true}, async function(tabs){
        currPath = await BuildPath(tabs[0].url, tabs[0].title, tabs[0].favIconUrl);
    });

});


//------------------
//Message Listeners
//------------------

//Reciever for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    (async () => {
        //Messages are sent from content scripts - refer to manifest.json for list of active context scripts
        //Allows direct communication with service worker

        //If Rabbit Icon is clicked, side panel functionality
        if (message === 'toggle_panel') {
            chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
                chrome.sidePanel.open({ tabId: tabs[0].id });

                chrome.sidePanel.setOptions({
                    path: '/frontend/panel/panel.html',
                });

                currentPage = "/frontend/panel/panel.html";
            });
        }

        //Add new rabbit, will be present and selectable on dropdown in panel.html
        else if (message.action === 'addNew') {
            await chrome.storage.local.get(["rabbit"]).then((result) => {
                //Update Result
                result.rabbit.holes.push(message.rabbit);
                result.rabbit.curr = message.rabbit;

                chrome.storage.local.set(result);
            });

            await setupRabbit();
                
            sendResponse({ success: true });
        }

        //Delete Rabbit
        else if (message.action === 'deleteRabbit') {
            chrome.storage.local.get(["rabbit"]).then((result) => {
                //Delete rabbit hole name from list
                const indexToRemove = result.rabbit.holes.indexOf(message.rabbit);
                if (indexToRemove > -1) {
                    result.rabbit.holes.splice(indexToRemove, 1);
                }

                changeRabbit(result.rabbit.holes[0]);

                //Delete Paths dug by rabbit
                chrome.storage.local.remove([rabbitName]);

                chrome.storage.local.set(result);
            });

            sendResponse({ success: true });
        }

        else if (message.action === 'editRabbit') {
            const oldName = message.rabbit;
            const newName = message.content;

            // Update rabbit list
            const { rabbit } = await chrome.storage.local.get(["rabbit"]);
            if (rabbit && rabbit.holes) {
                const indexToUpdate = rabbit.holes.indexOf(oldName);
                if (indexToUpdate > -1) {
                    rabbit.holes[indexToUpdate] = newName;
                    await chrome.storage.local.set({ rabbit });
                }
            }

            // Load and clone old rabbit data
            const stored = await chrome.storage.local.get([oldName]);
            const oldRabbitData = stored[oldName];
            if (!oldRabbitData) {
                console.warn(`Key "${oldName}" not found in storage.`);
                sendResponse({ success: false });
                return;
            }

            const temp = structuredClone(oldRabbitData);

            // Rename nested structure if present
            if (temp[oldName]) {
                temp[newName] = temp[oldName];
                delete temp[oldName];
            }

            // Update meta fields
            if (temp.curr === oldName) temp.curr = newName;
            temp.entry = newName;
            if (temp[newName]) temp[newName].title = newName;

            // For nodes following start, change prev to new name
            for(var i = 0; i < temp[newName].next.length; i++){
                console.log(temp[newName].next[i])
                var url = temp[newName].next[i];
                temp[url].prev = newName;
            }

            // Save
            await chrome.storage.local.set({ [newName]: temp });
            await chrome.storage.local.remove(oldName);

            changeRabbit(newName)
            sendResponse({ success: true });
        }



        //Store notes, should happen every few seconds
        else if (message.action === 'takeNote') {
            chrome.storage.local.get([rabbitName]).then((result) => {
                let rabbitURL = result[rabbitName]["curr"];
                
                //Update Result
                result[rabbitName][rabbitURL]["Content"] = message.content;

                chrome.storage.local.set(result);
            });

            sendResponse({ success: true });
        }


        //If different rabbit is selected, update current
        else if (message.action === 'updateRabbit') {
            chrome.storage.local.get(["rabbit"]).then((result) => {
                //Update Result
                result.rabbit.curr = message.rabbit;

                chrome.storage.local.set(result);
                setupRabbit();
            });

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

        //Send tab data to panel - refer to tabs.js
        else if (message === 'tabs_data') {
            chrome.tabs.query({currentWindow: true}, function(tabs){
                sendResponse(tabs);
            });
        }

        //When page opens, message context script confirming url containment
        else if (message === 'contains') {
            chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
                chrome.storage.local.get([rabbitName]).then((result) => {
                    let rabbitData = result[rabbitName] || {"curr": null};
                    if(tabs[0].url in rabbitData){
                        sendResponse({"return": tabs[0].url, data: rabbitData});
                    } else {
                        sendResponse({"return": "false", data: rabbitData});
                    }
                });
            });
        }

        //Add to saved tab collection
        else if (message.action === 'nameTabs') {
            saveTabs(message.name, message.tabs)
        }

        //Add to saved tabs
        else if (message === 'getTabCollections') {
            chrome.storage.local.get(["Tabs"]).then((result) => {
                let tabsData = result["Tabs"];
                
                sendResponse({"Tabs": tabsData});
            });

            return true;
        }

        //When node is placed in another node, update memory
        else if (message.action === 'switchNode') {
            switchNode(message.nodeToAdd, message.nodeToMove);
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
                path: '/frontend/graphPanel/graphPanel.html',
            });

            currentPage = "/frontend/graphPanel/graphPanel.html";
        }

        else if (message === 'collab') {
            chrome.sidePanel.setOptions({
                path: '/frontend/collab/collab.html',
            });

            currentPage = "/frontend/collab/collab.html";
        }

        else if (message === 'tabs') {
            chrome.sidePanel.setOptions({
                path: '/frontend/tabs/tabs.html',
            });

            currentPage = "/frontend/tabs/tabs.html";
        }

        else if (message === 'explore') {
            chrome.sidePanel.setOptions({
                path: '/frontend/explore/explore.html',
            });

            currentPage = "/frontend/explore/explore.html";
        }

        else if (message === 'info') {
            chrome.sidePanel.setOptions({
                path: '/frontend/info/info.html',
            });

            currentPage = "/frontend/info/info.html";
        }

        else if (message === 'notes') {
            chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
                //Send back content to add to text editor
                chrome.storage.local.get([rabbitName]).then((result) => {
                    let rabbitData = result[rabbitName] || {"curr": null};
                    if(tabs[0].url in rabbitData && ("Content" in rabbitData[tabs[0].url])){
                        sendResponse({"return": rabbitData[tabs[0].url]["Content"]});
                    } else {
                        sendResponse({"return": "false"});
                    }
                });

                chrome.sidePanel.open({ tabId: tabs[0].id });

                chrome.sidePanel.setOptions({
                    path: '/frontend/notesPanel/notesPanel.html',
                });
        
                currentPage = "/frontend/notesPanel/notesPanel.html";
            });
            
        }

    })();
    
    return true;
});