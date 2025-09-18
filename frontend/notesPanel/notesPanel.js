const editor = document.getElementById("editor");

var content = editor.textContent;

//Recieves messages from runtime
chrome.runtime.onMessage.addListener((message) => {
  //If content is present, add to text editor
  if(message.action == "inputContent"){
      content = message.content;
      editor.textContent = content;
  }
});

editor.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      insertTextAtCaret("\t");
    }
  });
  
editor.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
  //   e.preventDefault();
    insertTextAtCaret("\n");
  }
});
  

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

// Every 1.5 seconds, update within local db
const intervalId = setInterval(() => {
    //Send Content
    if (editor.textContent !== "Take Notes Here..." && editor.textContent !== "") {
        chrome.runtime.sendMessage(
            { action: "takeNote", content: editor.textContent},
            (response) => {}
        );
    };
}, 1500);