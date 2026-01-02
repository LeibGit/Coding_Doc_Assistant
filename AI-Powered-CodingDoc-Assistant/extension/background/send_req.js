const ENPOINT = "http://127.0.0.1:8000"

export async function send_llm_req(formData) {
    try {
        const res = await fetch(`${ENPOINT}/get_llm`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData)
        });
        if (!res.ok) {
            throw new Error("Error sending request.")
        } else {
            const data = await res.json()
            return data;
        } 
    } catch (err) {
        console.error(err)
    }
}