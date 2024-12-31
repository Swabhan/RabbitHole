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

        //Create Node for Fav Icon
        var divNode = document.createElement("div");
        divNode.className = "node";
        const img = document.createElement('img');
        img.src = response["path"][i]["favIcon"];
        img.alt = '!';
        divNode.appendChild(img)

        //Create Content
        var divContent = document.createElement("div");
        const contentText = document.createTextNode(response["path"][i]["title"]);
        var contentP = document.createElement("p");
        contentP.appendChild(contentText);
        divContent.appendChild(contentP);
        divContent.className = "content";
        
        //Add node and content to List Item
        li.appendChild(divNode);
        li.appendChild(divContent);

        //Set list item to a linkable url
        const anchor = document.createElement('a');
        anchor.href = response["path"][i]["url"];
        anchor.target = "_blank";
        anchor.appendChild(li);
        
        //Add anchor which includes list item to UL
        ul.appendChild(anchor);
    
    }

    
});