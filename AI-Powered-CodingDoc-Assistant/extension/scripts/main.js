const sub_form = document.getElementById('submission-form');

sub_form.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log("Form submitted"); // ADD THIS
    
    const formData = new FormData(sub_form)
    const usecaseContext = formData.get("usecase-context")
    const selectedDoc = formData.get("selected-doc")
    
    console.log("Form data:", { usecaseContext, selectedDoc }); // ADD THIS

    // Show loading indicator
    const loadingIndicator = document.getElementById('loading-indicator');
    const responseContainer = document.getElementById('response-container');
    loadingIndicator.style.display = 'block';
    responseContainer.style.display = 'none';
    
    chrome.runtime.sendMessage(
        { 
            type: "SEND_REQ",
            payload: {
                "usecase_context": usecaseContext,
                "selected_docs": selectedDoc
            } 
        },
        function(response) {
            console.log("Received response:", response);
            
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Check if response exists (Chrome extensions can return undefined)
            if (!response) {
                console.error("No response received from background script");
                showError("No response received. Check if the server is running and the background script is active.");
                return;
            }
            
            if (response.success && response.data) {
                showResUI(response.data);
            } else if (response.error) {
                showError(response.error);
            } else {
                console.error("Unexpected response format:", response);
                showError("Unexpected response from server");
            }
        }
    )
})

function showResUI(data) {
    const responseContainer = document.getElementById('response-container');
    
    // Clear previous response
    responseContainer.innerHTML = '';
    
    // Create response element
    const resDiv = document.createElement("div");
    resDiv.style.cssText = "margin-top: 20px; padding: 15px; background-color: #333; border-radius: 10px; color: white; white-space: pre-wrap; word-wrap: break-word;";
    
    const resText = document.createElement("p");
    resText.textContent = data;
    resText.style.cssText = "margin: 0; line-height: 1.6;";
    
    resDiv.appendChild(resText);
    responseContainer.appendChild(resDiv);
    responseContainer.style.display = 'block';
}

function showError(errorMessage) {
    const responseContainer = document.getElementById('response-container');
    
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
    responseContainer.style.display = 'block';
}