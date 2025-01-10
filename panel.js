/*
    Javascript for the Side Panel

    Works closely with active service workers to recieve latest data to display
*/


/*
    Recieve latest data by request through message

    Data consists of current path and whole graph
*/
chrome.runtime.sendMessage("panel_data", (response) => { //- Refer to service.js
    //--Adding list of rabbit holes to drop down
    const pageSelector = document.getElementById("page-selector");
    const numOfHoles = response["holes"].length;
    for (var i = 0; i < numOfHoles; i++) { 
      var option = document.createElement("option");
      option.value = response["holes"][i];
      option.text = response["holes"][i];

      pageSelector.appendChild(option);
      
    }


    //--Setting Specific Rabbit
    pageSelector.value = response["rabbitName"];

    //--Seting Panel Data
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
        img.alt = '';
        divNode.appendChild(img)

        //Create Content
        var divContent = document.createElement("div");
        const contentText = document.createTextNode(response["path"][i]["title"]);
        var contentP = document.createElement("p");
        contentP.appendChild(contentText);
        divContent.appendChild(contentP);
        divContent.className = "content";
        
        //Add node and content to List Item
        // li.appendChild(divNode);
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


/*
    Add new data to dropdown

    Functionality from add-new form + sending data
*/
function createPopup() {
  const popupContainer = document.getElementById("popup-container");
  popupContainer.style.display = "flex";

  popupContainer.innerHTML = `
    <div id="popup">
      <h2>Add New Option</h2>
      <input type="text" id="new-option-input" placeholder="Enter a name" />
      <div>
        <button id="submit-option">Submit</button>
        <button id="cancel-option">Cancel</button>
      </div>
    </div>
  `;

  document.getElementById("submit-option").addEventListener("click", () => {
    const inputValue = document.getElementById("new-option-input").value.trim();
    if (inputValue) {
      addNewOption(inputValue);

      //Add new rabbit hole to local storage
      chrome.runtime.sendMessage(
        { action: "addNew", rabbit: inputValue},
        (response) => {}
      );
    }
    closePopup();

  });

  document.getElementById("cancel-option").addEventListener("click", closePopup);
}
  
function addNewOption(name) {
  const select = document.getElementById("page-selector");
  const newOption = document.createElement("option");
  newOption.value = name.toLowerCase();
  newOption.textContent = name;
  select.appendChild(newOption);
}

function closePopup() {
  const popupContainer = document.getElementById("popup-container");
  popupContainer.style.display = "none";
  popupContainer.innerHTML = "";
  
  location.reload();
  return false;
}


document.addEventListener("DOMContentLoaded", () => {
    /*
        When new rabbit hole is selected, send data to service.js

        Refresh Page to recieve relevant data
    */
    const pageSelector = document.getElementById("page-selector");

    // Add an event listener for the change event
    pageSelector.addEventListener("change", () => {
        const selectedValue = pageSelector.value;
        if (selectedValue === "add-new") {
            createPopup();
            this.value = "";
        }

        else {
            //Send chosen rabbit hole, refreshes with relevant data
            chrome.runtime.sendMessage(
                { action: "updateRabbit", rabbit: pageSelector.value },
                (response) => {}
            );

            location.reload();
            return false;
        }

        
        
    });
});