from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model.llm import Llm_Model

app = FastAPI()

# Initialize LLM once at startup
llm_model = Llm_Model()

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
    """
    Async endpoint that calls a synchronous HF inference client.
    Safe because this is I/O-bound (network call), not CPU-bound.
    """
    try:
        response = llm_model.generate(
            usecase_context=request.usecase_context,
            selected_documentation=request.selected_docs,
        )
        return {"result": response}

    except Exception as e:
        import traceback
        print("Exception type:", type(e))
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"{type(e).__name__}: {repr(e)}"
        )
