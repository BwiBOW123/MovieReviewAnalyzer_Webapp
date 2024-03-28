from fastapi import FastAPI
from api.endpoint.router import router
from fastapi.middleware.cors import CORSMiddleware

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

app.include_router(router)
