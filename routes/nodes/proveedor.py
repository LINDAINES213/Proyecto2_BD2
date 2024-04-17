import uuid
from fastapi import APIRouter
from database.db import connection

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
def create_proveedor(proveedor_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    id = str(uuid.uuid4())

    # Extraer los datos del usuario del cuerpo de la solicitud
    direccion = proveedor_data.get("direccion")
    tipo_de_producto = proveedor_data.get("tipo_de_producto")
    telefono = proveedor_data.get("telefono")
    nombre = proveedor_data.get("nombre")
    email = proveedor_data.get("email")

    #{"direccion":"420 Crane Unions Port Ronaldshire  FM 79076","tipo_de_producto":"Ropa","id":"1","telefono":"+1-255-568-7924x97883","nombre":"Murray  Mason and Evans","email":"rosschelsea@example.net"}

    # Consulta Cypher para crear un nodo de usuario
    query = '''CREATE (p:Proveedor {nombre: $nombre, direccion: $direccion, telefono: $telefono, email: $email, tipo_de_producto: $tipo_de_producto, id: $id})
    RETURN p'''

    # Ejecutar la consulta Cypher con los parámetros proporcionados
    result = session.run(query, id=id, nombre=nombre, direccion=direccion, email=email, telefono=telefono, tipo_de_producto=tipo_de_producto)

    # Recopilar las propiedades del nuevo nodo creado
    created_proveedor_info = []
    for record in result:
        created_proveedor_info.append(dict(record["p"]))

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