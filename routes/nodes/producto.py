import uuid
from fastapi import APIRouter
from database.db import connection
from typing import List
from http.client import HTTPException


# Definir un enrutador de API para la sección de usuarios
producto = APIRouter()

@producto.get("/nodes/Producto")
def get_producto():
    driver_neo4j = connection()
    session = driver_neo4j.session()
    # Consulta Cypher con un parámetro
    query = f'MATCH (n:Producto) RETURN n' #n.name AS name, COUNT(n) AS count
    # Pasando el valor del parámetro label
    results = session.run(query)
    # Recopilando todas las propiedades de cada nodo
    nodes_info = []
    for row in results:
        node_properties = dict(row["n"])
        nodes_info.append(node_properties)

    return {"response": nodes_info}

@producto.get("/nodes/Producto/{id}")
def get_ordenCompra(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    query = f"MATCH (n:Producto) WHERE n.id = '{id}' RETURN n"
    results = session.run(query)
    nodes_info = []
    for row in results:
        node_properties = dict(row["n"])
        nodes_info.append(node_properties)

    return {"response": nodes_info}

@producto.post("/create_producto")
def create_producto(producto_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    id = str(uuid.uuid4())

    # Extraer los datos del usuario del cuerpo de la solicitud
    descripcion = producto_data.get("descripcion")
    precio = float(producto_data.get("precio"))
    precio_al_por_mayor = float(producto_data.get("precio_al_por_mayor"))
    nombre = producto_data.get("nombre")
    categoria = producto_data.get("categoria")

    #(:Producto {descripcion: "Portátil de alta gama para profesionales y gamers", precio: 229.82, precio_al_por_mayor: 349.58, categoria: "Electronica", id: "1", nombre: "Laptop"})

    # Consulta Cypher para crear un nodo de usuario
    query = '''CREATE (p:Producto {nombre: $nombre, descripcion: $descripcion, categoria: $categoria, precio: $precio, precio_al_por_mayor: $precio_al_por_mayor, id: $id})
    RETURN p'''

    # Ejecutar la consulta Cypher con los parámetros proporcionados
    result = session.run(query, id=id, nombre=nombre, descripcion=descripcion, categoria=categoria, precio=precio, precio_al_por_mayor=precio_al_por_mayor)

    # Recopilar las propiedades del nuevo nodo creado
    created_producto_info = []
    for record in result:
        created_producto_info.append(dict(record["p"]))

    return {"response": created_producto_info}

@producto.put("/update_producto/{id}")
def update_producto(id: str, updated_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    # Extraer los datos actualizados del cuerpo de la solicitud
    descripcion = updated_data.get("descripcion")
    precio = updated_data.get("precio")
    precio_al_por_mayor = updated_data.get("telefono")
    nombre = updated_data.get("nombre")
    categoria = updated_data.get("categoria")

    # Consulta Cypher para actualizar el nodo de usuario
    query = '''
    MATCH (p:Producto {id: $id})
    SET p.nombre = $nombre, p.descripcion = $descripcion, p.categoria = $categoria, p.precio = $precio, p.precio_al_por_mayor = $precio_al_por_mayor
    RETURN p
    '''

    # Ejecutar la consulta Cypher con los parámetros proporcionados
    result = session.run(query, nombre=nombre, descripcion=descripcion, categoria=categoria, precio=precio, precio_al_por_mayor=precio_al_por_mayor, id=id)

    # Recopilar las propiedades del nodo actualizado
    updated_user_info = []
    for record in result:
        updated_user_info.append(dict(record["p"]))

    return {"response": "node updated"}

@producto.delete("/delete_producto/{id}")
def delete_producto(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    # Consulta Cypher para eliminar el nodo de usuario
    query = '''
    MATCH (p:Producto {id: $id})
    DETACH DELETE p
    '''

    # Ejecutar la consulta Cypher con el parámetro proporcionado
    session.run(query, id=id)

    return {"response": "producto deleted successfully"}

@producto.put("/node/remove_properties/Producto")
def remove_properties_from_nodes(listIds: List[str], properties_to_remove: List[str]):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    # Asegurar que se reciben los parámetros necesarios
    if not listIds or not properties_to_remove:
        raise HTTPException(status_code=400, detail="Se requieren los NITs de los proveedores y las propiedades a eliminar.")

    # Construir la parte de la consulta para eliminar propiedades
    properties_removal = ', '.join(f'p.{prop} = NULL' for prop in properties_to_remove)
    query = f"""
    MATCH (p:Producto)
    WHERE p.id IN $listIds
    SET {properties_removal}
    RETURN p.id as updated_id
    """

    # Ejecutar la consulta
    result = session.run(query, listIds=listIds)
    updated_ids = [record["updated_id"] for record in result]

    return {"message": "Propiedades eliminadas correctamente", "updated_nits": updated_ids}

