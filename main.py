from fastapi import FastAPI
from routes import personal
from routes import proveedor

app = FastAPI()

app.include_router(personal.personal)
app.include_router(proveedor.proveedor)

@app.get("/")
def default():
    return {"message": "Funcionanding ✅"}
