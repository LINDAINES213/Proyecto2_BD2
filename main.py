from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import personal
from routes import proveedor
from routes import producto
from routes import cliente
from routes import almacen

app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(personal.personal)
app.include_router(proveedor.proveedor)
app.include_router(producto.producto)
app.include_router(cliente.cliente)
app.include_router(almacen.almacen)

@app.get("/")
def default():
    return {"message": "Funcionanding ✅"}
