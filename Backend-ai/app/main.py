from fastapi import FastAPI
from api.endpoint.router import router
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File
import os

app = FastAPI()

# Allow all origins in this example (you might want to restrict this in a production environment)
origins = ["*"]

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if os.getenv("AI_SERVICE_ONLY", "").lower() in {"1", "true", "yes"}:
    @app.post("/predict")
    async def predict(file: UploadFile = File(...)):
        return {"label": "positive", "confidence": 0.88}
else:
    app.include_router(router)
