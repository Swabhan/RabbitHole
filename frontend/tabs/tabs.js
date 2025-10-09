/*
    Javascript for the Side Panel - Tabs

    Works closely with active service workers to recieve latest data to display
*/

//Keep track of currently selected tabs
const selectedTabs = [];

function updateSelected(checkbox, tab) {
    if (checkbox.checked) {
        if (!selectedTabs.includes(tab)) selectedTabs.push(tab);
    } else {
        const index = selectedTabs.indexOf(tab);
        if (index > -1) selectedTabs.splice(index, 1);
    }
}


//Keep track of currently selected tabs that were saved
let selectedSavedTabs = [];

function updateSelectedSaved(checkbox, tab) {
    if (checkbox.checked) {
        if (!selectedSavedTabs.includes(tab)) selectedSavedTabs.push(tab);
    } else {
        const index = selectedSavedTabs.indexOf(tab);
        if (index > -1) selectedSavedTabs.splice(index, 1);
    }
}

/*
    Receive latest tab data by request through message
    Data consists of all currently opened tabs
*/
chrome.runtime.sendMessage("tabs_data", (response) => {
    const tabsList = document.getElementById("tabsList");

    // Create a checkbox for each tab
    response.forEach((tab, index) => {
        const label = document.createElement("label");
        label.style.display = "block";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = `tab${index}`;
        checkbox.value = tab.title;
        checkbox.classList.add("tabCheckbox");

        // Add event listener for each checkbox
        checkbox.addEventListener("change", () => updateSelected(checkbox, tab));

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${tab.title || tab.url}`));

        tabsList.appendChild(label);
    });

    // Handle 'Select All' checkbox
    const checkAll = document.getElementById("checkAll");
    checkAll.addEventListener("change", () => {
        const allCheckboxes = document.querySelectorAll(".tabCheckbox");
        allCheckboxes.forEach(cb => {
            cb.checked = checkAll.checked;
            // Update selectedTabs accordingly
            const tabIndex = Array.from(allCheckboxes).indexOf(cb);
            updateSelected(cb, response[tabIndex]);
        });
    });

    //Popup to save tabs
     /*
    Form for naming saved tabs
    */
    function createPopup() {
        const popupContainer = document.getElementById("popup-container");
        popupContainer.style.display = "flex";
    
        popupContainer.innerHTML = `
        <div id="popup">
            <h2>Enter name for managed tabs</h2>
            <input type="text" id="input" placeholder="Enter Label For Saved Tabs" />
            <div>
            <button id="submit-option">Save</button>
            <br>
            <button id="cancel-option">Cancel</button>
            </div>
        </div>
        `;
    
        document.getElementById("submit-option").addEventListener("click", () => {
        const inputValue = document.getElementById("input").value.trim();
        if (inputValue) {
            //Save Links - Send action to service.js
            chrome.runtime.sendMessage(
            { action: "nameTabs", name: inputValue, tabs: selectedTabs},
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

    // Save Button
    const saveTabs = document.getElementById('save-tabs');

    saveTabs.addEventListener('click', () => {
        createPopup();
    });
});

/*
    Fill in all available tab options
*/
chrome.runtime.sendMessage("getTabCollections", (response) => {
    const pageSelector = document.getElementById("collection-selector");
    for (const [key, value] of Object.entries(response.Tabs)) {
        //For each key (tab collection name) add to dropdown in tabs.html
        var option = document.createElement("option");
        option.value = key;
        option.text = key;
        option.dataset.tabs = JSON.stringify(value);

        pageSelector.appendChild(option);
    }
});

/*
    Display Saved Tabs when dropdown changes
*/
const tabCollectionSelector = document.getElementById("collection-selector");

tabCollectionSelector.addEventListener('change', function(event) {
    const selectedOption = event.target.selectedOptions[0];
    const tabs = JSON.parse(selectedOption.dataset.tabs);

    const savedTabsList = document.getElementById("savedTabsList");

    //Clean up previosly selected tab collection
    selectedSavedTabs.length = 0;
    while (savedTabsList.firstChild) {
        savedTabsList.removeChild(savedTabsList.firstChild);
    }

    //Populate Tabs List
    tabs.forEach((tab, index) => {
        const label = document.createElement("label");
        label.style.display = "block";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = `tab${index}`;
        checkbox.value = tab.url;
        checkbox.classList.add("tabCheckboxSaved");

        // Create the link text
        const link = document.createElement("a");
        link.textContent = tab.title || tab.url;
        link.href = tab.url;
        link.target = "_blank";
        link.style.marginLeft = "8px";
        link.style.color = "black";
        

        // Add event listener for each checkbox
        checkbox.addEventListener("change", () => updateSelectedSaved(checkbox, tab));

        // Append elements
        label.appendChild(checkbox);
        label.appendChild(link);

        savedTabsList.appendChild(label);
    });

    // Handle 'Select All' checkbox
    const checkAll = document.getElementById("checkAllSaved");
    checkAll.addEventListener("change", () => {
        const allCheckboxes = document.querySelectorAll(".tabCheckboxSaved");
        selectedSavedTabs = [];
        
        allCheckboxes.forEach(cb => {
            cb.checked = checkAll.checked;

            const tabIndex = Array.from(allCheckboxes).indexOf(cb);
            updateSelectedSaved(cb, tabs[tabIndex]);
        });
    });
});

//Open selected tabs when button is pressed
const openButton = document.getElementById("open-tabs");

openButton.addEventListener('click', function(event) {
    selectedSavedTabs.forEach((tab, index) => {
        setTimeout(() => window.open(tab.url, '_blank'), index * 200);
    })
});