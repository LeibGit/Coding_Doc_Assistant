from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import llm

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Request(BaseModel):
    usecase_context: str
    selected_docs: str

@app.post("/get_llm")
async def get_llm_res(request: Request):
    try:
        req = llm.Llm_Model(
            request.usecase_context,
            request.selected_docs
        )
        print(req)
    except Exception as e:
        raise ValueError("An error occured: ", str(e))      