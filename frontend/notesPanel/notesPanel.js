document.addEventListener("DOMContentLoaded", () => {
  const toolbar = document.getElementById("toolbar");

  toolbar.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;
    const command = button.dataset.command;
    const value = button.dataset.value || null;

    // Handle highlight toggle (on/off)
    if (command === "hiliteColor") {
      const currentColor = document.queryCommandValue("hiliteColor");
      const isActive = currentColor === "rgb(255, 255, 0)" || currentColor === "yellow";
      document.execCommand("hiliteColor", false, isActive ? "transparent" : value);
      button.classList.toggle("active", !isActive);
    } else {
      document.execCommand(command, false, value);
      // Toggle bold/italic/underline button states if needed
      if (["bold", "italic", "underline"].includes(command)) {
        button.classList.toggle("active");
      }
    }

    editor.focus();
  });

  const editor = document.getElementById("editor");
  const saveStatus = document.getElementById("save-status");
  const wordCount = document.getElementById("word-count");
  const charCount = document.getElementById("char-count");
  const popupButton = document.getElementById("note-button");

  let lastSavedContent = "";

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "inputContent") {
      if (message.content) editor.innerHTML = message.content;
    }
  });

  // Only allow editing when page is added to rabbit hole
  chrome.runtime.sendMessage("contains", (response) => { 
    if(response["return"] == "false") {
      editor.setAttribute("data-placeholder", "Must add page to rabbit hole prior to editing notes. You may do this by clicking on the + button");
      editor.contentEditable = false;
    }
  });

  // Set popup button
  chrome.runtime.sendMessage({action: "containsPopup"}, (response) => { 
    if(response["success"] == "false") {
      popupButton.textContent = "Set Popup On Page";
    } else {
      popupButton.textContent = "Remove Popup On Page";
    }
  });

  // Handle text editing (tab + enter + formatting)
  editor.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      insertTextAtCaret("\t");
    }

    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          document.execCommand("bold");
          break;
        case "i":
          e.preventDefault();
          document.execCommand("italic");
          break;
        case "s":
          e.preventDefault();
          manualSave();
          break;
      }
    }
  });

  // Auto update word and char count
  editor.addEventListener("input", updateStats);
  editor.addEventListener("input", scheduleSave);

  function updateStats() {
    const text = editor.innerHTML;
    charCount.innerHTML = `${text.length} chars`;
    wordCount.innerHTML = `${text.split(/\s+/).filter(Boolean).length} words`;
  }

  function insertTextAtCaret(text) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const textNode = document.createTextNode(text);
    range.deleteContents();
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Save management
  let saveTimeout = null;

  function scheduleSave() {
    saveStatus.innerHTML = "Saving...";
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(manualSave, 800);
  }

  function manualSave() {
    const content = editor.innerHTML;

    if (content === lastSavedContent) return;

    chrome.runtime.sendMessage(
      { action: "takeNote", content},
      () => {
        lastSavedContent = content;
        saveStatus.innerHTML = "Saved ✓";
      }
    );
  }

  // Periodic sync safety check
  setInterval(manualSave, 1000);

  popupButton.addEventListener("click", () => {
    if(popupButton.textContent == "Set Popup On Page"){

      popupButton.textContent = "Remove Popup On Page";
      chrome.runtime.sendMessage({action: "setPopup"});

    } else {
      popupButton.textContent = "Set Popup On Page";
      chrome.runtime.sendMessage({action: "removePopup"});

    }
  });
});
