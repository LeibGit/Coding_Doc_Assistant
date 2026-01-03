import { send_llm_req } from "./send_req.js";

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in background:", message);
    
    if (message.type === "SEND_REQ") {
        console.log("Sending LLM request...");
        
        // Return true to indicate we will send a response asynchronously
        send_llm_req(message.payload)
            .then((data) => {
                console.log("LLM response received:", data);
                sendResponse({success: true, data: data});
            })
            .catch((err) => {
                console.error("LLM request error:", err);
                sendResponse({success: false, error: err.toString()});
            });
        
        // Return true to keep the message channel open for async response
        return true;
    }
    
    // Return false if we're not handling this message
    return false;
});