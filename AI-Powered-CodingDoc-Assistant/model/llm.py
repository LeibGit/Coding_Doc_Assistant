from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM

class Model:
    def __init__(self, usecase_context, selected_documentation, ask_prompt):
        self.usecase_context = usecase_context
        self.selected_documentation = selected_documentation
        self.ask_prompt = ask_prompt
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
Question: {self.ask_prompt}
Provide a clear, practical answer tailored to the user's project. Include any code snippets if necessary.
"""

        result = generator(prompt, max_new_tokens=max_tokens)
        return result[0]['generated_text']


if __name__ == "__main__":
    test = Model(
        usecase_context="Building navigation for a sushi restaurant website",
        selected_documentation="""import * as React from 'react';
import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator({
    screens: {
        Home: {
            screen: HomeScreen,
            options: {title: 'Welcome'},
        },
        Profile: {
            screen: ProfileScreen,
        },
    },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
    return <Navigation />;
}""",
        ask_prompt="I am confused, how would I integrate this into my app if I want a protected route?"
    )

    print(test.generate_res())
