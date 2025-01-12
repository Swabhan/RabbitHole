/*
    Javascript for the Graph Side Panel

    Works closely with active service workers to recieve latest data to display

    Conducts DFS Traversal to apply nodes to a Tree Map
*/

var childToParent = {}
var count = 0;

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
            const rootNode = createTreeNode(curr["title"]);
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

            const newNode = createTreeNode(node["title"], node["title"]);
            const parentNodes = treeContainer.querySelectorAll(".tree-node");

            // Append the new node to a random existing node
            const parentNode = parentNodes[childToParent[node["prev"]]];
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
    function createTreeNode(title, fullTitle = title) {
        const node = document.createElement("div");
        node.className = "tree-node";
        node.textContent = title;
        node.setAttribute("data-full-title", fullTitle);

        const drag = document.createElement("div");
        drag.className = "drag-handle";
        node.appendChild(drag);

        return node;
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


    //Dragging functionality
    let isDragging = false;
    let currentNode = null;
    let offsetX = 0;
    let offsetY = 0;

    document.addEventListener('mousedown', (event) => {
        if (event.target.classList.contains('drag-handle')) {
            isDragging = true;
            currentNode = event.target.parentElement;
            const rect = currentNode.getBoundingClientRect();
            offsetX = rect.right;
            offsetY = rect.top;
        }
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging && currentNode) {
            currentNode.style.position = 'absolute';
            currentNode.style.left = `${event.clientX - offsetX}px`;
            currentNode.style.top = `${event.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        currentNode = null;
        
        location.reload();
    });
});
