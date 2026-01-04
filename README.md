# Coding Doc Assistant

**Clarify** is an AI-powered tool designed to help developers understand and navigate project documentation more effectively. By providing explanations and context-aware guidance, it makes reading and applying documentation faster and easier.

---

## Overview

Working with complex codebases and documentation can be overwhelming. This project acts as an AI assistant that:

- Analyzes your project context.
- Explains code documentation in simpler terms.
- Provides actionable guidance directly related to your project.
- Helps developers reduce confusion and accelerate learning.

---

## How It Works

- **Frontend**: A Chrome Extension interface where users can ask questions about their code or project documentation.
- **Backend**: Built with **FastAPI**, serving as the API layer between the extension and the AI model.
- **AI Model**: Powered by **Meta's LLaMA 3.1 8B Instruct model** for instruction-based natural language responses, tailored to your project context.

---

## Features

- Context-aware documentation explanations.
- Fast and reliable responses through FastAPI.
- Easy-to-use Chrome Extension interface.
- Designed to integrate seamlessly into your development workflow.

---

## Tech Stack

- **Backend**: FastAPI, Python
- **AI Model**: Meta LLaMA-3.1-8B-Instruct
- **Frontend**: Chrome Extension (HTML, CSS, JS)
- **Deployment**: Render (for the backend)
