const ENDPOINT = "https://coding-doc-assistant.onrender.com/get_llm";

export async function send_llm_req(formData) {
    console.log("send_llm_req called with:", formData); // ADD THIS
    
    try {
        const res = await fetch(`${ENDPOINT}/get_llm`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData)
        });
        
        console.log("Response status:", res.status); // ADD THIS
        
        if (!res.ok) {
            const errorText = await res.text(); // ADD THIS
            console.error("Error response:", errorText); // ADD THIS
            throw new Error(`Error sending request: ${res.status} - ${errorText}`)
        }
        
        const data = await res.json()
        console.log("Parsed response data:", data); // ADD THIS
        return data.result;
    } catch (err) {
        console.error("Fetch error:", err)
        throw err; // RE-THROW so background.js catches it
    }
}