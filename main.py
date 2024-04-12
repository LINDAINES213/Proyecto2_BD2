from fastapi import FastAPI
from dotenv import load_dotenv
from routes import personal

app = FastAPI()

app.include_router(personal.personal)

@app.get("/")
def default():
    return {"message": "Funcionanding ✅"}
