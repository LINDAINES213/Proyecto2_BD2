import uuid
from fastapi import APIRouter
from database.db import connection

publicidad_router = APIRouter()

@publicidad_router.get("/nodes/Publicidad")
def get_publicidad():
    driver_neo4j = connection()
    session = driver_neo4j.session()
    query = f'MATCH (n:Publicidad) RETURN n'
    results = session.run(query)
    nodes_info = []
    for row in results:
        node_properties = dict(row["n"])
        nodes_info.append(node_properties)

    return {"response": nodes_info}

@publicidad_router.get("/nodes/Publicidad/{id}")
def get_ordenCompra(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    query = f"MATCH (n:Publicidad) WHERE n.id = '{id}' RETURN n"
    results = session.run(query)
    nodes_info = []
    for row in results:
        node_properties = dict(row["n"])
        nodes_info.append(node_properties)

    return {"response": nodes_info}

@publicidad_router.post("/create_publicidad")
def create_publicidad(publicidad_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    id = str(uuid.uuid4())

    descripcion = publicidad_data.get("descripcion")
    costo = publicidad_data.get("costo")
    duracion = publicidad_data.get("duracion")
    nombre = publicidad_data.get("nombre")
    alcance = publicidad_data.get("alcance")

    query = '''CREATE (p:Publicidad {descripcion: $descripcion, costo: $costo, duracion: $duracion, nombre: $nombre, alcance: $alcance, id: $id})
    RETURN p'''

    result = session.run(query, id=id, descripcion=descripcion, costo=costo, duracion=duracion, nombre=nombre, alcance=alcance)

    created_publicidad_info = []
    for record in result:
        created_publicidad_info.append(dict(record["p"]))

    return {"response": created_publicidad_info}

@publicidad_router.put("/update_publicidad/{id}")
def update_publicidad(id: str, updated_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    descripcion = updated_data.get("descripcion")
    costo = updated_data.get("costo")
    duracion = updated_data.get("duracion")
    nombre = updated_data.get("nombre")
    alcance = updated_data.get("alcance")

    query = '''
    MATCH (p:Publicidad {id: $id})
    SET p.descripcion = $descripcion, p.costo = $costo, p.duracion = $duracion, p.nombre = $nombre, p.alcance = $alcance
    RETURN p
    '''

    result = session.run(query, descripcion=descripcion, costo=costo, duracion=duracion, nombre=nombre, alcance=alcance, id=id)

    updated_publicidad_info = []
    for record in result:
        updated_publicidad_info.append(dict(record["p"]))

    return {"response": "node updated"}

@publicidad_router.delete("/delete_publicidad/{id}")
def delete_publicidad(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    query = '''
    MATCH (p:Publicidad {id: $id})
    DETACH DELETE p
    '''

    session.run(query, id=id)

    return {"response": "Publicidad deleted successfully"}
