from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ...model import llm 

router = APIRouter()

router.post("/")