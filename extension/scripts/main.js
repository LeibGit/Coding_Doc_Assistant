const sub_form = document.getElementById('submission-form');

let allPageText = ""

async function sendTabContentToBackend(tabId) {
  // Step 1: Get the text from the tab
  const [result] = await chrome.scripting.executeScript({
    target: {tabId: tabId},
    func: () => document.body.innerText
  });
  
  allPageText = result.result;
}

sub_form.addEventListener('submit', async (e) => {
    e.preventDefault()
    console.log("Form submitted");
    
    // Get the active tab's ID first and grab content
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    await sendTabContentToBackend(tab.id);
    
    console.log("Page text:", allPageText); // Check if it's populated
    
    const formData = new FormData(sub_form)
    const usecaseContext = formData.get("usecase-context")
    const selectedDoc = formData.get("selected-doc")
    
    console.log("Form data:", { usecaseContext, selectedDoc });

    // Show loading indicator
    const loadingIndicator = document.getElementById('loading-indicator');
    const responseContainer = document.getElementById('response-container');
    loadingIndicator.style.display = 'block';
    responseContainer.style.display = 'none';

    // Add disclosure message
    let disclosure = document.getElementById('disclosure-message');
    if (!disclosure) {
        disclosure = document.createElement('p');
        disclosure.id = 'disclosure-message';
        disclosure.innerHTML = "<strong>Disclosure: </strong>Expect a 1-minute response time, we are operating on free servers.";
        disclosure.style.cssText = "margin-top: 10px; font-size: 0.9em; color: #999;";
        loadingIndicator.parentNode.insertBefore(disclosure, loadingIndicator.nextSibling);
    }
    disclosure.style.display = 'block';

    console.log("Sending to backend:", allPageText)
    
    // Wrap chrome.runtime.sendMessage in a Promise for better error handling
    try {
        const response = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                { 
                    type: "SEND_REQ",
                    payload: {
                        "usecase_context": usecaseContext,
                        "selected_docs": selectedDoc,
                        "page_context": allPageText
                    } 
                },
                function(response) {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(response);
                    }
                }
            );
        });
        
        console.log("Received response:", response);
        
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
        
        if (response.success && response.data) {
            showResUI(response.data);
        } else if (response.error) {
            showError(response.error);
        } else {
            console.error("Unexpected response format:", response);
            showError("Unexpected response from server");
        }
    } catch (error) {
        console.error("Error sending message:", error);
        loadingIndicator.style.display = 'none';
        showError(error.message || "Failed to communicate with background script");
    }
})

function showResUI(data) {
    const reqDiv = document.getElementById("req-div");

    if (reqDiv) {
        reqDiv.style.display = "none";
    }

    const responseContainer = document.getElementById('response-container');
    const disclosure = document.getElementById('disclosure-message');
    
    // Hide disclosure message
    if (disclosure) {
        disclosure.style.display = 'none';
    }
    
    // Clear previous response
    responseContainer.innerHTML = '';
    
    // Create response element
    const resDiv = document.createElement("div");
    resDiv.style.cssText = "margin-top: 20px; padding: 15px; background-color: #333; border-radius: 10px; color: white; white-space: pre-wrap; word-wrap: break-word;";
    
    const resText = document.createElement("p");
    resText.textContent = data;
    resText.style.cssText = "margin: 0; line-height: 1.6; font-size: 16px";
    
    resDiv.appendChild(resText);
    responseContainer.appendChild(resDiv);
    
    // Add "Request Again" button
    const requestAgainBtn = document.createElement("button");
    requestAgainBtn.textContent = "Request Again";
    requestAgainBtn.className = "request-again-btn";
    requestAgainBtn.style.cssText = "margin-top: 16px; width: 100%; height: 40px; background-color: #444; color: white; font-size: 14px; font-weight: 600; border: 1px solid #666; border-radius: 8px; cursor: pointer; transition: all 0.2s ease;";
    
    requestAgainBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = "#555";
        this.style.borderColor = "#777";
    });
    
    requestAgainBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = "#444";
        this.style.borderColor = "#666";
    });
    
    requestAgainBtn.addEventListener('click', function() {
        // Hide response container and scroll to top
        const reqDiv = document.getElementById("req-div")
        responseContainer.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        reqDiv.style.display = 'block';
        // Optional: Clear form fields
        sub_form.reset();
    });
    
    responseContainer.appendChild(requestAgainBtn);
    responseContainer.style.display = 'block';
}

function showError(errorMessage) {
    const responseContainer = document.getElementById('response-container');
    const disclosure = document.getElementById('disclosure-message');
    
    // Hide disclosure message
    if (disclosure) {
        disclosure.style.display = 'none';
    }
    
    // Clear previous response
    responseContainer.innerHTML = '';
    
    // Create error element
    const errorDiv = document.createElement("div");
    errorDiv.style.cssText = "margin-top: 20px; padding: 15px; background-color: #442222; border-radius: 10px; color: #ff6666;";
    
    const errorText = document.createElement("p");
    errorText.textContent = `Error: ${errorMessage}`;
    errorText.style.cssText = "margin: 0;";
    
    errorDiv.appendChild(errorText);
    responseContainer.appendChild(errorDiv);
    
    // Add "Try Again" button for errors
    const tryAgainBtn = document.createElement("button");
    tryAgainBtn.textContent = "Try Again";
    tryAgainBtn.className = "request-again-btn";
    tryAgainBtn.style.cssText = "margin-top: 16px; width: 100%; height: 40px; background-color: #662222; color: #ff6666; font-size: 14px; font-weight: 600; border: 1px solid #884444; border-radius: 8px; cursor: pointer; transition: all 0.2s ease;";
    
    tryAgainBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = "#772222";
        this.style.borderColor = "#994444";
    });
    
    tryAgainBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = "#662222";
        this.style.borderColor = "#884444";
    });
    
    tryAgainBtn.addEventListener('click', function() {
        // Hide response container and scroll to top
        responseContainer.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    responseContainer.appendChild(tryAgainBtn);
    responseContainer.style.display = 'block';
}