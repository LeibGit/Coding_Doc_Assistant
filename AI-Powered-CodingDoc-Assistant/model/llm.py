from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM

class Llm_Model:
    def __init__(self, usecase_context, selected_documentation):
        self.usecase_context = usecase_context
        self.selected_documentation = selected_documentation
        self.model_name = "stabilityai/stable-code-instruct-3b"  # ✅ valid, free HF model

    def generate_res(self, max_tokens=300):

        tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        model = AutoModelForCausalLM.from_pretrained(self.model_name)

        generator = pipeline(
            "text-generation",
            model=self.model_name,
            tokenizer=self.model_name,
        )

        prompt = f"""
You are an expert developer assistant.
User project context: {self.usecase_context}
Documentation: {self.selected_documentation}
Provide a clear, practical answer tailored to the user's project. Include any code snippets if necessary.
"""

        result = generator(prompt, max_new_tokens=max_tokens)
        return result[0]['generated_text']
