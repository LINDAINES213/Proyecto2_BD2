import uuid
from fastapi import APIRouter
from database.db import connection
from datetime import datetime


# Definir un enrutador de API para la sección de usuarios
almacen = APIRouter()

@almacen.get("/nodes/Almacen")
def get_almacen():
    driver_neo4j = connection()
    session = driver_neo4j.session()
    # Consulta Cypher con un parámetro
    query = f'MATCH (n:Almacen) RETURN n' #n.name AS name, COUNT(n) AS count
    # Pasando el valor del parámetro label
    results = session.run(query)
    # Recopilando todas las propiedades de cada nodo
    nodes_info = []
    for row in results:
        node_properties = dict(row["n"])
        nodes_info.append(node_properties)

    return {"response": nodes_info}



@almacen.post("/create_almacen")
def create_almacen(almacen_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    id = str(uuid.uuid4())

    # Extraer los datos del usuario del cuerpo de la solicitud
    capacidad_total = almacen_data.get("capacidad_total")
    presupuesto = almacen_data.get("presupuesto")
    fecha_de_inauguracion = almacen_data.get("fecha_de_inauguracion")
    fecha_de_inauguracion = datetime.strptime(fecha_de_inauguracion, "%Y-%m-%d")
    capacidad_vehiculos = almacen_data.get("capacidad_vehiculos")
    direccion = almacen_data.get("direccion")

    #(:Almacen {capacidad_total: 4141, presupuesto: 122637.5, fecha_de_inauguracion: 2020-11-09, direccion: "135 Rogers View Apt. 569 Reidmouth  AL 52341", capacidad_vehiculos: 189, id: "430"})

    # Consulta Cypher para crear un nodo de usuario
    query = '''CREATE (p:Almacen {capacidad_total: $capacidad_total, presupuesto: $presupuesto, fecha_de_inauguracion: $fecha_de_inauguracion, direccion: $direccion, capacidad_vehiculos: $capacidad_vehiculos, id: $id})
    RETURN p'''

    # Ejecutar la consulta Cypher con los parámetros proporcionados
    result = session.run(query, id=id, capacidad_total=capacidad_total, presupuesto=presupuesto, fecha_de_inauguracion=fecha_de_inauguracion, direccion=direccion, capacidad_vehiculos=capacidad_vehiculos)

    # Recopilar las propiedades del nuevo nodo creado
    created_user_info = []
    for record in result:
        created_user_info.append(dict(record["p"]))

    return {"response": created_user_info}

@almacen.put("/update_almacen/{id}")
def update_almacen(id: str, updated_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    # Extraer los datos actualizados del cuerpo de la solicitud
    capacidad_total = updated_data.get("capacidad_total")
    presupuesto = updated_data.get("presupuesto")
    fecha_de_inauguracion = updated_data.get("fecha_de_inauguracion")
    capacidad_vehiculos = updated_data.get("capacidad_vehiculos")
    direccion = updated_data.get("direccion")

    # Consulta Cypher para actualizar el nodo de usuario
    query = '''
    MATCH (p:Almacen {id: $id})
    SET p.capacidad_total = $capacidad_total, p.presupuesto = $presupuesto, p.direccion = $direccion, p.fecha_de_inauguracion = $fecha_de_inauguracion, p.capacidad_vehiculos = $capacidad_vehiculos
    RETURN p
    '''

    # Ejecutar la consulta Cypher con los parámetros proporcionados
    result = session.run(query, capacidad_total=capacidad_total, presupuesto=presupuesto, fecha_de_inauguracion=fecha_de_inauguracion, capacidad_vehiculos=capacidad_vehiculos, direccion=direccion, id=id)

    # Recopilar las propiedades del nodo actualizado
    updated_user_info = []
    for record in result:
        updated_user_info.append(dict(record["p"]))

    return {"response": "node updated"}

@almacen.delete("/delete_almacen/{id}")
def delete_almacen(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    # Consulta Cypher para eliminar el nodo de usuario
    query = '''
    MATCH (p:Almacen {id: $id})
    DETACH DELETE p
    '''

    # Ejecutar la consulta Cypher con el parámetro proporcionado
    session.run(query, id=id)

    return {"response": "Person deleted successfully"}