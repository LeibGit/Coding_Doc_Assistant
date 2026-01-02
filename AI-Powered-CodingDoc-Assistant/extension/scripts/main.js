const sub_form = document.getElementById("submission-form")

sub_form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(sub_form)

    const usecaseContext = formData.get("usecase-context")
    const selectedDoc = formData.get("selected-doc")

    chrome.runtime.sendMessage(
        { 
            type: "SEND_REQ",
            payload: {
                "usecase_context": usecaseContext,
                "selected_docs": selectedDoc
            } 

        })
    console.log("Request sent")
})