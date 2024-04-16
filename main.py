from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.nodes import personal
from routes.nodes import proveedor
from routes.nodes import producto
from routes.nodes import cliente
from routes.nodes import almacen
from routes.nodes import factura
from routes.nodes import ordenCompra
from routes.nodes import publicidad
from routes.nodes import vehiculos
from routes.relations import rTiene
from routes.relations import rReabastece

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
app.include_router(factura.factura_router)
app.include_router(ordenCompra.orden_compra_router)
app.include_router(ordenCompra.orden_compra_router_por_mayor)
app.include_router(publicidad.publicidad_router)
app.include_router(vehiculos.vehiculo_router)
app.include_router(vehiculos.vehiculo_router_pesado)
app.include_router(rTiene.tiene)
app.include_router(rReabastece.reabastece_r)

@app.get("/")
def default():
    return {"message": "Funcionanding ✅"}
