document.addEventListener("DOMContentLoaded", () => {
  const toolbar = document.getElementById("toolbar");

  toolbar.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;
    const command = button.dataset.command;
    const value = button.dataset.value || null;
    document.execCommand(command, false, value);
    editor.focus();
  });

  const editor = document.getElementById("editor");
  const titleInput = document.getElementById("note-title");
  const saveStatus = document.getElementById("save-status");
  const wordCount = document.getElementById("word-count");
  const charCount = document.getElementById("char-count");

  let lastSavedContent = "";
  let lastSavedTitle = "";

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "inputContent") {
      if (message.content) editor.innerHTML = message.content;
      if (message.title) titleInput.value = message.title;
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
  titleInput.addEventListener("input", scheduleSave);
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
    const title = titleInput.value || "Untitled Note";

    if (content === lastSavedContent && title === lastSavedTitle) return;

    chrome.runtime.sendMessage(
      { action: "takeNote", content, title },
      () => {
        lastSavedContent = content;
        lastSavedTitle = title;
        saveStatus.innerHTML = "Saved ✓";
      }
    );
  }

  // Periodic sync safety check
  setInterval(manualSave, 1000);
});
