from huggingface_hub import InferenceClient
import os
from dotenv import load_dotenv

load_dotenv()

class Llm_Model:
    def __init__(self, hf_token=os.getenv("HF_TOKEN")):
        self.model_name = "HuggingFaceH4/zephyr-7b-beta"

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

Documentation:
{selected_documentation}

Explain how to integrate this into the user's project.
Be practical. Use examples if helpful.
"""
            }
        ]

        response = self.client.chat.completions.create(
            messages=messages,
            max_tokens=max_tokens,
            temperature=0.7,
        )

        return response.choices[0].message.content
