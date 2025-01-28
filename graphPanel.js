/*
    Javascript for the Graph Side Panel

    Works closely with active service workers to recieve latest data to display

    Conducts DFS Traversal to apply nodes to a Tree Map
*/

var childToParent = {}
var count = 0;

//Tabbing Functionality
var tabURLs = new Set([]);;
var isHovered = null;
var isShifted = false;

//Moving Functionality
let isDragging = false;
let currentNode = null;

document.addEventListener('mousedown', (event) => {
    if (event.target.classList.contains('drag-handle')) {
        isDragging = true;
        currentNode = event.target.parentElement;
        currentNode.style.backgroundColor = "#b8ffed";
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const treeContainer = document.getElementById("tree-container");

    chrome.runtime.sendMessage("panel_data", (response) => { 
        const entryURL = response["fullGraph"]["entry"];

        if(entryURL == null){
            //Display Instructions on how to use extension
        }

        // Setup Current Node
        var curr = response["fullGraph"][entryURL];

        if(curr){
            // Root node
            const rootNode = createTreeNode(entryURL, curr["title"]);
            treeContainer.appendChild(rootNode);

            // Entrance to DFS
            const entryLength = curr["next"].length;

            //Insert into dictionary for easy retrieval from document order
            childToParent[entryURL] = count;
            count = count + 1;

            for(let i = 0; i < entryLength; i++){
                dfs(response["fullGraph"][curr["next"][i]], curr["next"][i]);
            }
        }

        //----------------------------------------------------
        // Depth First Search Traversal
        // 
        // Insert data visually through DFS Traversal
        //
        // Called within chrome.runtime for panel_data message
        //----------------------------------------------------
        function dfs(node, url){
            /*
            Node is in format - 
            favIcon: iconURL
            
            method: methodURL
            next: list of strings
            prev: prevURL string
            title: string
            */

            if(node == undefined){
                return;
            }
            
            const newNode = createTreeNode(url, node["title"], node["title"]);
            const parentNodes = treeContainer.querySelectorAll(".tree-node");

            // Append the new node to a random existing node
            const parentNode = parentNodes[childToParent[node["prev"]]];
            console.log(parentNodes, childToParent[node["prev"]])

            console.log(parentNode)
            const childContainer =  parentNode.querySelector(".children") || createChildContainer(parentNode);

            childContainer.appendChild(newNode);

            //Insert into dictionary for easy retrieval from document order
            childToParent[url] = count;
            count = count + 1;

            // Continue DFS
            if(node["next"]){
                const entryLength = node["next"].length;

                for(let i = 0; i < entryLength; i++){
                    dfs(response["fullGraph"][node["next"][i]], node["next"][i]);
                }

            }

            return;
            
        }

    });

    //--------------------
    // Simulated Insertion
    //
    // Used in tutorial?
    //--------------------
    function simulate(){
        // Simulate data being added every 2 seconds
        let nodeCount = 1;
        setInterval(() => {
            const newNode = createTreeNode(`Node ${nodeCount}`, `This is the full title of Node ${nodeCount}`);
            const parentNodes = treeContainer.querySelectorAll(".tree-node");

            // Append the new node to a random existing node
            const randomParent = parentNodes[Math.floor(Math.random() * parentNodes.length)];
            const childContainer = randomParent.querySelector(".children") || createChildContainer(randomParent);
            childContainer.appendChild(newNode);

            nodeCount++;
        }, 2000);
    }

    // Function to create a tree node
    function createTreeNode(url, title, fullTitle = title) {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";

        

        const node = document.createElement("div");
        node.className = "tree-node";
        node.textContent = title;
        node.href = url;
        node.setAttribute("data-full-title", fullTitle);

        const drag = document.createElement("div");
        drag.className = "drag-handle";
        node.appendChild(drag);

        link.appendChild(node)

        clickFunctionality(link, node);

        return link;
    }

    // Function to create a child container for a node
    function createChildContainer(parentNode) {
        const container = document.createElement("div");
        container.className = "children";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.marginLeft = "20px";
        parentNode.appendChild(container);
        return container;
    }

    function clickFunctionality(link, node) {
        //When Hovering
        node.addEventListener("mouseover", (event) => {
            const elementsAtPoint = document.elementsFromPoint(event.clientX, event.clientY);
            if (elementsAtPoint[0] === node) {
                isHovered = link.href;
                if(isDragging && currentNode){
                    if(node != currentNode){
                        node.style.backgroundColor = "#fff1cc";
                    }
                    

                    //Potential feature, add to container upon hover when dragging
                    // node.appendChild(currentNode);
                }
            }
        });

        //When Hovering is removed
        node.addEventListener("mouseout", (event) => {
            const elementsAtPoint = document.elementsFromPoint(event.clientX, event.clientY);
            if (elementsAtPoint[0] === node) {
                isHovered = null;
                

                //Potential Feature
                // node.removeChild(currentNode);
            }

            //reset color
            if(node != currentNode && !tabURLs.contains(node.href)){
                node.style.backgroundColor = "#ffffff";
            }

        });
    
        // Allow navigation for double click only
        node.addEventListener("dblclick", (event) => {
            event.preventDefault();
            const elementsAtPoint = document.elementsFromPoint(event.clientX, event.clientY);
            if (elementsAtPoint[0] === node) {
                window.open(link.href, link.target);
            }
        });
    
        //Single click, various functionality depending on configuration
        node.addEventListener("click", (event) => {
            event.preventDefault();
            
            // Check if this is the topmost element
            const elementsAtPoint = document.elementsFromPoint(event.clientX, event.clientY);
            if (elementsAtPoint[0] !== node) {
                return;
            }
    
            //Reset Dragging Functionality
            if(isDragging){
                isDragging = false;
                if(node.style.backgroundColor != "#fff1cc"){
                    node.appendChild(currentNode);
                }
                currentNode.style.backgroundColor = "#ffffff";

                chrome.runtime.sendMessage(
                    { action: "switchNode", nodeToAdd: node.href, nodeToMove: currentNode.href },
                    (response) => {}
                );
                

                currentNode = null;
            }
    
            if(isShifted && isHovered && !tabURLs.has(isHovered)){
                tabURLs.add(isHovered);
                node.style.backgroundColor = "#e0e0ff";
            } else if(tabURLs.has(isHovered) && isShifted) {
                tabURLs.delete(isHovered);
                node.style.backgroundColor = "#ffffff";
            }
    
            //If set has content, add button to manage tabs
            if (tabURLs.size > 0) {
                const top = document.getElementById("top");
                
                if (!document.getElementById("manageTabsButton")) {
                    const button = document.createElement("button");
                    button.id = "manageTabsButton";
                    button.textContent = "Save to Tabs Management";
                    button.style.marginTop = "10px";
                    
                    button.addEventListener("click", () => {
                        createPopup();
                    });
            
                    top.insertAdjacentElement("afterend", button);
                }
            }
        });
    }
    
    // Keydown functionality for shift
    document.addEventListener("keydown", (event) => {
        if (event.shiftKey) {
            isShifted = true;
        }
    });
    
    // Set shift to false when key is up
    document.addEventListener("keyup", (event) => {
        isShifted = false;
    });


    /*
    Form for naming saved tabs
    */
    function createPopup() {
        const popupContainer = document.getElementById("popup-container");
        popupContainer.style.display = "flex";
    
        popupContainer.innerHTML = `
        <div id="popup">
            <h2>Enter name for managed tabs</h2>
            <input type="text" id="input" placeholder="Enter a Name" />
            <div>
            <button id="submit-option">Submit</button>
            <button id="cancel-option">Cancel</button>
            </div>
        </div>
        `;
    
        document.getElementById("submit-option").addEventListener("click", () => {
        const inputValue = document.getElementById("input").value.trim();
        if (inputValue) {
            //Add new rabbit hole to local storage
            chrome.runtime.sendMessage(
            { action: "nameTabs", name: inputValue, tabs: tabURLs},
            (response) => {}
            );
        }
        closePopup();
    
        });
    
        document.getElementById("cancel-option").addEventListener("click", closePopup);
    }

    function closePopup() {
        const popupContainer = document.getElementById("popup-container");
        popupContainer.style.display = "none";
        popupContainer.innerHTML = "";
        
        location.reload();
        return false;
    }


    //How To Button
    // Get references to elements
    const howToButton = document.getElementById('how-to-button');
    const popupContainer = document.getElementById('popup-container-info');
    const backgroundFade = document.getElementById('background-fade');
    const closePopupButton = document.getElementById('close-popup');

    // Show popup and fade background
    howToButton.addEventListener('click', () => {
        backgroundFade.style.display = 'block';
        popupContainer.style.display = 'block';
    });

    // Hide popup and fade background
    const hidePopup = () => {
        backgroundFade.style.display = 'none';
        popupContainer.style.display = 'none';
    };

    closePopupButton.addEventListener('click', hidePopup);
    backgroundFade.addEventListener('click', hidePopup);
    
});