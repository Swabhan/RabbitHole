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

    const pathLength = response["path"].length;

    for (var i = 0; i < pathLength; i++) { 
        //Connect to List UI and create new item
        var ul = document.getElementById("linked-list");
        var li = document.createElement("li");

        //Create Node
        var divNode = document.createElement("div");
        var nodeText = document.createTextNode("1");
        divNode.appendChild(nodeText)
        divNode.className = "node";

        //Create Content
        var divContent = document.createElement("div");
        const contentText = document.createTextNode(response["path"][i]);
        var contentP = document.createElement("p");
        contentP.appendChild(contentText);
        divContent.appendChild(contentP);
        divContent.className = "content";
        
        //Add node and content to List Item
        li.appendChild(divNode);
        li.appendChild(divContent);

        //Add list item to UL
        ul.appendChild(li);
    
    }

    
});