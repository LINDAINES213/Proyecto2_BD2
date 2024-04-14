from fastapi import FastAPI
from routes import personal
from routes import proveedor
from routes import producto

app = FastAPI()

app.include_router(personal.personal)
app.include_router(proveedor.proveedor)
app.include_router(producto.producto)

@app.get("/")
def default():
    return {"message": "Funcionanding ✅"}
