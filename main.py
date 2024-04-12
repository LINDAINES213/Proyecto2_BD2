from fastapi import FastAPI
from routes import personal

app = FastAPI()

app.include_router(personal.personal)

@app.get("/")
def default():
    return {"message": "Funcionanding ✅"}
