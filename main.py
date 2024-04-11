from fastapi import FastAPI
from dotenv import load_dotenv
from routes import users

app = FastAPI()

app.include_router(users.users)

@app.get("/")
def default():
    return {"message": "Funcionanding ✅"}
