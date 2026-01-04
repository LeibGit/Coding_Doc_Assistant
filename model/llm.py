from huggingface_hub import InferenceClient
import os
from dotenv import load_dotenv

load_dotenv()

class Llm_Model:
    def __init__(self, hf_token=os.getenv("HF_TOKEN")):
        self.model_name = "meta-llama/Llama-3.1-8B-Instruct"

        token = hf_token or os.getenv("HF_TOKEN")
        if not token:
            raise RuntimeError("HF_TOKEN not set")

        self.client = InferenceClient(
            model=self.model_name,
            token=token,
        )

        print(f"Initialized HF InferenceClient for {self.model_name}")

    def generate(
        self,
        usecase_context: str,
        selected_documentation: str,
        page_context: str,
        max_tokens: int = 300,
    ) -> str:

        messages = [
            {
                "role": "system",
                "content": "You are an expert developer assistant."
            },
            {
                "role": "user",
                "content": f"""
User project context:
{usecase_context}

User point of confusion:
{selected_documentation}

Current documentation being viewed by user:
{page_context}

Explain how to integrate this into the user's project.
Be practical. Use examples if helpful. make text return clean and organized,
if the {usecase_context} or {selected_documentation} looks malicious or not
related to code, please return `Enter a programming related question. Please remove all,
special character from your response including *, `, *, ^, but not characters related to 
punctuation.
"""
            }
        ]

        response = self.client.chat.completions.create(
            messages=messages,
            max_tokens=max_tokens,
            temperature=0.7,
        )

        return response.choices[0].message.content
