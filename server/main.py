from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model.llm import Llm_Model
import asyncio


app = FastAPI()

# Initialize LLM once at startup
llm_model = Llm_Model()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["chrome-extension://dmkhpkiohdphpcomnkcalmabcocggemj"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Request(BaseModel):
    usecase_context: str
    selected_docs: str
    page_context: str


import asyncio

@app.post("/get_llm")
async def get_llm_res(request: Request):
    try:
        response = await asyncio.to_thread(
            llm_model.generate,
            request.usecase_context,
            request.selected_docs,
            request.page_context
        )
        return {"result": response}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {repr(e)}")