import uuid
from fastapi import APIRouter
from database.db import connection

# Definir un enrutador de API para la sección de usuarios
cliente = APIRouter()

@cliente.get("/nodes/Cliente")
def get_cliente():
    driver_neo4j = connection()
    session = driver_neo4j.session()
    # Consulta Cypher con un parámetro
    query = f'MATCH (n:Cliente) RETURN n' #n.name AS name, COUNT(n) AS count
    # Pasando el valor del parámetro label
    results = session.run(query)
    # Recopilando todas las propiedades de cada nodo
    nodes_info = []
    for row in results:
        node_properties = dict(row["n"])
        nodes_info.append(node_properties)

    return {"response": nodes_info}

@cliente.get("/nodes/Cliente/{id}")
def get_cliente(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    query = f"MATCH (n:Cliente) WHERE n.id = '{id}' RETURN n"
    results = session.run(query)
    nodes_info = []
    for row in results:
        node_properties = dict(row["n"])
        nodes_info.append(node_properties)

    return {"response": nodes_info}

@cliente.post("/create_cliente")
def create_cliente(cliente_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    id = str(uuid.uuid4())

    # Extraer los datos del usuario del cuerpo de la solicitud
    correo = cliente_data.get("correo")
    nombre = cliente_data.get("nombre")
    direccion = cliente_data.get("direccion")
    nit = int(cliente_data.get("NIT"))
    telefono = cliente_data.get("telefono")

    #(:Cliente {correo: "eddie84@example.com", direccion: "724 Samuel Village Apt. 263 Williamston  NY 01844", NIT: 8634223727, id: "105", telefono: "+1-239-298-4574x71509", nombre: "Gary Powers"})

    # Consulta Cypher para crear un nodo de usuario
    query = '''CREATE (p:Cliente {nombre: $nombre, correo: $correo, direccion: $direccion, telefono: $telefono, NIT: $nit, id: $id})
    RETURN p'''

    # Ejecutar la consulta Cypher con los parámetros proporcionados
    result = session.run(query, id=id, nombre=nombre, correo=correo, direccion=direccion, telefono=telefono, nit=nit)

    # Recopilar las propiedades del nuevo nodo creado
    created_user_info = []
    for record in result:
        created_user_info.append(dict(record["p"]))

    return {"response": created_user_info}

@cliente.get("/get_cliente/{id}")
def get_cliente(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    
    # Consulta Cypher para obtener los datos del cliente por su ID
    query = f"""MATCH (n:Cliente) WHERE n.id = '{id}' 
    RETURN n.id AS id, n.nombre AS nombre, n.correo AS correo, n.direccion AS direccion, n.telefono AS telefono, n.NIT AS nit"""
    
    # Ejecutar la consulta Cypher
    results = session.run(query)
    
    # Obtener los datos del cliente del resultado de la consulta
    cliente_data = results.single()

    # Verificar si se encontraron datos para el cliente
    if cliente_data:
        # Convertir el resultado a un diccionario
        cliente_dict = dict(cliente_data)
        return cliente_dict
    else:
        return {"error": "Cliente no encontrado"}


@cliente.put("/update_cliente/{id}")
def update_cliente(id: str, updated_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    # Extraer los datos actualizados del cuerpo de la solicitud
    correo = updated_data.get("correo")
    nombre = updated_data.get("nombre")
    direccion = updated_data.get("direccion")
    nit = updated_data.get("NIT")
    telefono = updated_data.get("telefono")

    # Consulta Cypher para actualizar el nodo de usuario
    query = '''
    MATCH (p:Cliente {id: $id})
    SET p.nombre = $nombre, p.correo = $correo, p.direccion = $direccion, p.telefono = $telefono, p.NIT = $nit
    RETURN p
    '''

    # Ejecutar la consulta Cypher con los parámetros proporcionados
    result = session.run(query, nombre=nombre, direccion=direccion, correo=correo, telefono=telefono, nit=nit, id=id)

    # Recopilar las propiedades del nodo actualizado
    updated_user_info = []
    for record in result:
        updated_user_info.append(dict(record["p"]))

    return {"response": "node updated"}

@cliente.delete("/delete_cliente/{id}")
def delete_cliente(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    # Consulta Cypher para eliminar el nodo de usuario
    query = '''
    MATCH (p:Cliente {id: $id})
    DETACH DELETE p
    '''

    # Ejecutar la consulta Cypher con el parámetro proporcionado
    session.run(query, id=id)

    return {"response": "Person deleted successfully"}