## Service Worker
A script that the browser runs in the background while also allowing us to tap into the chrome extensions API

##### Our active Service Workers
service.js - Does the lifting of adding web pages to our context, communicates with context scripts, parsing/updating our graph, building active path, and integrating Google's build in AI model

collab.js - Allows collaboration between multiple users within a single rabbit hole, works closely with service.js

## Context Scripts
Runs Javascript in the context of a webpage

##### Our active Context Scripts
onScreenBtn.js - Adds buttons to our web page that allows users to smoothly interact with our extension: toggle side panel, dig (add to our rabbit hole), view guided searches

## Side Panel
Allows us to display UI in our browser's side panel

##### Our active Side Panels
panel.html - Shows the current information of our currently built rabbit hole
graphPanel.html - Shows the whole graph of current rabbit hole
guideSearch.html - Shows number of recommended searches for our user based on given prompt: "Help me research..."

panel.js - Works closely with active service workers to recieve latest data to display

## The Rabbit Hole
