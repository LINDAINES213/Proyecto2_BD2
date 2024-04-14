import uuid
from fastapi import APIRouter
from database.db import connection
from datetime import datetime

factura_router = APIRouter()

@factura_router.get("/nodes/Factura")
def get_factura():
    driver_neo4j = connection()
    session = driver_neo4j.session()
    query = f'MATCH (n:Factura) RETURN n'
    results = session.run(query)
    nodes_info = []
    for row in results:
        node_properties = dict(row["n"])
        nodes_info.append(node_properties)

    return {"response": nodes_info}

@factura_router.post("/create_factura")
def create_factura(factura_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    id = str(uuid.uuid4())

    nombre_del_cliente = factura_data.get("nombre_del_cliente")
    direccion = factura_data.get("direccion")
    no_serie = factura_data.get("no_serie")
    no_factura = factura_data.get("no_factura")
    fecha = factura_data.get("fecha")
    fecha = datetime.strptime(fecha, "%Y-%m-%d")
    precio = factura_data.get("precio")
    total = factura_data.get("total")
    descuento = factura_data.get("descuento")
    envio = factura_data.get("envio")
    NIT = factura_data.get("NIT")
    cantidad = factura_data.get("cantidad")
    productos = factura_data.get("productos")

    query = '''CREATE (f:Factura {nombre_del_cliente: $nombre_del_cliente, direccion: $direccion, no_serie: $no_serie, no_factura: $no_factura, fecha: $fecha, precio: $precio, total: $total, descuento: $descuento, envio: $envio, NIT: $NIT, cantidad: $cantidad, productos: $productos, id: $id})
    RETURN f'''

    result = session.run(query, id=id, nombre_del_cliente=nombre_del_cliente, direccion=direccion, no_serie=no_serie, no_factura=no_factura, fecha=fecha, precio=precio, total=total, descuento=descuento, envio=envio, NIT=NIT, cantidad=cantidad, productos=productos)

    created_factura_info = []
    for record in result:
        created_factura_info.append(dict(record["f"]))

    return {"response": created_factura_info}

@factura_router.put("/update_factura/{id}")
def update_factura(id: str, updated_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    nombre_del_cliente = updated_data.get("nombre_del_cliente")
    direccion = updated_data.get("direccion")
    no_serie = updated_data.get("no_serie")
    no_factura = updated_data.get("no_factura")
    fecha = updated_data.get("fecha")
    precio = updated_data.get("precio")
    total = updated_data.get("total")
    descuento = updated_data.get("descuento")
    envio = updated_data.get("envio")
    NIT = updated_data.get("NIT")
    cantidad = updated_data.get("cantidad")
    productos = updated_data.get("productos")

    query = '''
    MATCH (f:Factura {id: $id})
    SET f.nombre_del_cliente = $nombre_del_cliente, f.direccion = $direccion, f.no_serie = $no_serie, f.no_factura = $no_factura, f.fecha = $fecha, f.precio = $precio, f.total = $total, f.descuento = $descuento, f.envio = $envio, f.NIT = $NIT, f.cantidad = $cantidad, f.productos = $productos
    RETURN f
    '''

    result = session.run(query, nombre_del_cliente=nombre_del_cliente, direccion=direccion, no_serie=no_serie, no_factura=no_factura, fecha=fecha, precio=precio, total=total, descuento=descuento, envio=envio, NIT=NIT, cantidad=cantidad, productos=productos, id=id)

    updated_factura_info = []
    for record in result:
        updated_factura_info.append(dict(record["f"]))

    return {"response": "node updated"}

@factura_router.delete("/delete_factura/{id}")
def delete_factura(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    query = '''
    MATCH (f:Factura {id: $id})
    DELETE f
    '''

    session.run(query, id=id)

    return {"response": "Factura deleted successfully"}
