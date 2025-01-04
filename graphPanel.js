// document.addEventListener("DOMContentLoaded", () => {
//     // Initialize an empty rabbitData object
//     const rabbitData = {
//       curr: null,
//       entry: null,
//     };
  
//     // Function to create a node element for the graph
//     const createNodeElement = (data) => {
//       const node = document.createElement("div");
//       node.className = "node";
  
//       // Create a favicon image element for the node
//       const favicon = document.createElement("img");
//       favicon.src = data.favIcon || "https://via.placeholder.com/50";
//       favicon.alt = "Favicon";
  
//       // Create a title element for the node (first three words)
//       const title = document.createElement("p");
//       const truncatedTitle = data.title ? data.title.split(" ").slice(0, 3).join(" ") : "Untitled";
//       title.textContent = truncatedTitle;
  
//       node.appendChild(favicon);
//       node.appendChild(title);
  
//       return node;
//     };
  
//     let offsetX = 0, offsetY = 0, isDragging = false;
  
//     // Function to enable dragging for the graph-container
//     const enableDrag = (e) => {
//       isDragging = true;
//       offsetX = e.clientX - graphContainer.offsetLeft;
//       offsetY = e.clientY - graphContainer.offsetTop;
//     };
  
//     const handleDragging = (e) => {
//       if (!isDragging) return;
//       graphContainer.style.left = `${e.clientX - offsetX}px`;
//       graphContainer.style.top = `${e.clientY - offsetY}px`;
//     };
  
//     const stopDrag = () => {
//       isDragging = false;
//     };
  
//     // Select the graph container
//     const graphContainer = document.getElementById("graphContainer");
//     graphContainer.addEventListener("mousedown", enableDrag);
//     document.addEventListener("mousemove", handleDragging);
//     document.addEventListener("mouseup", stopDrag);
  
//     // Function to create a connection (link) between nodes
//     const createConnectionElement = () => {
//       const connection = document.createElement("div");
//       connection.className = "connection";
//       return connection;
//     };
  
//     // Function to render the graph from rabbitData
//     const renderGraph = () => {
//       const graphDiv = document.getElementById("graph");
//       graphDiv.innerHTML = ""; // Clear the container before re-rendering
  
//       let current = rabbitData.entry;
//       while (current) {
//         // Add the current node
//         const nodeElement = createNodeElement(current);
//         graphDiv.appendChild(nodeElement);
  
//         // Positioning each node with random values
//         const randomX = Math.floor(Math.random() * (graphDiv.clientWidth - 120));
//         const randomY = Math.floor(Math.random() * (graphDiv.clientHeight - 120));
//         nodeElement.style.left = `${randomX}px`;
//         nodeElement.style.top = `${randomY}px`;
  
//         // Add connections for each 'next' node in the list
//         if (current.next && current.next.length > 0) {
//           current.next.forEach((nextNode) => {
//             const connection = createConnectionElement();
//             graphDiv.appendChild(connection);
//             const nextNodeElement = createNodeElement(nextNode);
//             graphDiv.appendChild(nextNodeElement);
//           });
//         }
  
//         // Move to the next node (if any)
//         current = current.next && current.next.length > 0 ? current.next[0] : null;
//       }
//     };
  
//     // Function to add a new entry to rabbitData
//     const addEntry = (url, title, favIconUrl, prevNode = null) => {
//       const newNode = {
//         method: "search: ",
//         prev: prevNode || rabbitData.curr,
//         next: [],
//         title: title,
//         favIcon: favIconUrl,
//       };
  
//       if (prevNode) {
//         prevNode.next.push(newNode); // Link the new node to the previous node
//       } else if (rabbitData.curr) {
//         rabbitData.curr.next.push(newNode); // Link the new node to the current node
//       }
  
//       rabbitData.curr = newNode; // Set the new node as the current node
  
//       if (!rabbitData.entry) {
//         rabbitData.entry = newNode; // Set the first entry if it's the first node
//       }
  
//       renderGraph(); // Re-render the graph with the new node
//     };
  
//     // Example of adding entries to simulate dynamic data
//     setTimeout(() => {
//       addEntry("https://example.com", "Example Site", "https://www.google.com/favicon.ico");
//     }, 1000);
  
//     setTimeout(() => {
//       addEntry("https://another-site.com", "Another Site Example", "https://www.google.com/favicon.ico");
//     }, 3000);
  
//     setTimeout(() => {
//       addEntry("https://yetanother.com", "Yet Another Site Example", "https://www.google.com/favicon.ico");
//     }, 5000);
  
//     setTimeout(() => {
//       addEntry("https://linked-site.com", "Linked Site Example", "https://www.google.com/favicon.ico", rabbitData.entry);
//     }, 7000);
//   });
  