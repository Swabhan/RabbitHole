chrome.storage.local.get("rabbitId", function(data)
{
    /*
    Checks if values exist within current rabbit hole, if not, set to default value
    */
    if(chrome.runtime.lastError)
    {
        chrome.storage.local.set({ "rabbitId": {}});
    }
});

chrome.tabs.onUpdated.addListener(function(){
    /*
    Listener to detect tab changes, entry point for search history updates
    */
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        console.log(tabs[0].url);
    });
});

function updateRabbitHole(url){
    chrome.storage.local.get(["rabbitId"]).then((result) => {
        /*
        Updates current rabbit hole when data arrives
        */
        chrome.storage.local.set({ "rabbitId": result.key + 1 }).then(() => { 
    
        });
    });
}
