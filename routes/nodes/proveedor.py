import uuid
from fastapi import APIRouter
from database.db import connection
from typing import List, Dict

# Definir un enrutador de API para la sección de usuarios
proveedor = APIRouter()

@proveedor.get("/nodes/Proveedor")
def get_proveedor():
    driver_neo4j = connection()
    session = driver_neo4j.session()
    # Consulta Cypher con un parámetro
    query = f'MATCH (n:Proveedor) RETURN n' #n.name AS name, COUNT(n) AS count
    # Pasando el valor del parámetro label
    results = session.run(query)
    # Recopilando todas las propiedades de cada nodo
    nodes_info = []
    for row in results:
        node_properties = dict(row["n"])
        nodes_info.append(node_properties)

    return {"response": nodes_info}

@proveedor.get("/nodes/Proveedor/{id}")
def get_ProveedorId(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    query = f"MATCH (n:Proveedor) WHERE n.id = '{id}' RETURN n"
    results = session.run(query)
    nodes_info = []
    for row in results:
        node_properties = dict(row["n"])
        nodes_info.append(node_properties)

    return {"response": nodes_info}

@proveedor.post("/create_proveedor")
def create_proveedor(proveedor_data: List[Dict]):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    # Agregar un ID único a cada proveedor en la lista
    for data in proveedor_data:
        data['id'] = str(uuid.uuid4())

    # Consulta Cypher para crear múltiples nodos de proveedor usando UNWIND
    query = '''
    UNWIND $lista_proveedores AS proveedor
    CREATE (p:Proveedor {
        id: proveedor.id,
        nombre: proveedor.nombre, 
        direccion: proveedor.direccion, 
        telefono: proveedor.telefono, 
        email: proveedor.email, 
        tipo_de_producto: proveedor.tipo_de_producto
    })
    RETURN p
    '''

    # Ejecutar la consulta Cypher con la lista completa de proveedores
    result = session.run(query, lista_proveedores=proveedor_data)

    # Recopilar las propiedades de los nuevos nodos creados
    created_proveedor_info = [dict(record["p"]) for record in result]

    return {"response": created_proveedor_info}

@proveedor.get("/get_proveedor/{id}")
def get_proveedor(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    
    # Consulta Cypher para obtener los datos del Proveedor por su ID
    query = f"""MATCH (n:Proveedor) WHERE n.id = '{id}' 
    RETURN n.id AS id, n.nombre AS nombre, n.email AS email, n.direccion AS direccion, n.telefono AS telefono, n.tipo_de_producto AS tipo_de_producto"""
    
    # Ejecutar la consulta Cypher
    results = session.run(query)
    
    # Obtener los datos del proveedor del resultado de la consulta
    proveedor_data = results.single()

    # Verificar si se encontraron datos para el proveedor
    if proveedor_data:
        # Convertir el resultado a un diccionario
        proveedor_dict = dict(proveedor_data)
        return proveedor_dict
    else:
        return {"error": "Proveedor no encontrado"}

@proveedor.put("/update_proveedor/{id}")
def update_proveedor(id: str, updated_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    # Extraer los datos actualizados del cuerpo de la solicitud
    direccion = updated_data.get("direccion")
    tipo_de_producto = updated_data.get("tipo_de_producto")
    telefono = updated_data.get("telefono")
    nombre = updated_data.get("nombre")
    email = updated_data.get("email")

    # Consulta Cypher para actualizar el nodo de usuario
    query = '''
    MATCH (p:Proveedor {id: $id})
    SET p.nombre = $nombre, p.direccion = $direccion, p.email = $email, p.telefono = $telefono, p.tipo_de_producto = $tipo_de_producto
    RETURN p
    '''

    # Ejecutar la consulta Cypher con los parámetros proporcionados
    result = session.run(query, nombre=nombre, direccion=direccion, email=email, telefono=telefono, tipo_de_producto=tipo_de_producto, id=id)

    # Recopilar las propiedades del nodo actualizado
    updated_user_info = []
    for record in result:
        updated_user_info.append(dict(record["p"]))

    return {"response": "node updated"}

@proveedor.put("/update_proveedores")
def update_proveedores(proveedores_data: List[Dict]):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    # Hola
    # Preparar los datos eliminando el 'id' de las propiedades a actualizar
    clean_data = []
    for proveedor in proveedores_data:
        # Crear una copia del diccionario excepto la propiedad 'id'
        properties = {k: v for k, v in proveedor.items() if k != 'id'}
        clean_data.append({'id': proveedor['id'], 'properties': properties})

    query = '''
    UNWIND $proveedores AS proveedor_data
    MATCH (p:Proveedor {id: proveedor_data.id})
    SET p += proveedor_data.properties
    RETURN p
    '''

    result = session.run(query, proveedores=clean_data)
    updated_proveedores_info = [dict(record["p"]) for record in result]

    return {"response": updated_proveedores_info}



@proveedor.delete("/delete_proveedor/{id}")
def delete_proveedor(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    # Consulta Cypher para eliminar el nodo de usuario
    query = '''
    MATCH (p:Proveedor {id: $id})
    DETACH DELETE p
    '''

    # Ejecutar la consulta Cypher con el parámetro proporcionado
    session.run(query, id=id)

    return {"response": "Proveedor deleted successfully"}


@proveedor.get("/get_similares/{id}")
def get_similares(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    
    # Consulta Cypher para obtener los datos del Proveedor por su ID
    query = f"""MATCH (p:Proveedor {id: $id})
MATCH (p2:Producto)
WHERE p1 <> p2 AND p1.categoria = p2.categoria AND p2.nombre IS NOT NULL
RETURN p2.nombre AS recommendedProduct
"""
    
    # Ejecutar la consulta Cypher
    results = session.run(query)
    
    # Obtener los datos del proveedor del resultado de la consulta
    similitudes_data = results.single()

    # Verificar si se encontraron datos para el proveedor
    if similitudes_data:
        # Convertir el resultado a un diccionario
        similitud_dict = dict(similitudes_data)
        return similitud_dict
    else:
        return {"error": "Proveedor no encontrado"}

