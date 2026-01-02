import { send_llm_req } from "./send_req.js";

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "SEND_REQ") {
        send_llm_req(message.payload)
        .then((data) => {
            console.log(data)
        })
        .catch((err) => {
            console.log("an error occured", err)
        })
    }
})