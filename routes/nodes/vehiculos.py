import uuid
from fastapi import APIRouter
from database.db import connection

vehiculo_router = APIRouter()

@vehiculo_router.get("/nodes/VehiculoTransporteLigero")
def get_vehiculo_transporte_ligero():
    driver_neo4j = connection()
    session = driver_neo4j.session()
    query = f'MATCH (n:Vehiculo:TransporteLigero) RETURN n'
    results = session.run(query)
    nodes_info = []
    for row in results:
        node_properties = dict(row["n"])
        nodes_info.append(node_properties)

    return {"response": nodes_info}

@vehiculo_router.post("/create_vehiculo_transporte_ligero")
def create_vehiculo_transporte_ligero(vehiculo_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    id = str(uuid.uuid4())

    consumo = vehiculo_data.get("consumo")
    marca = vehiculo_data.get("marca")
    peso_limite = vehiculo_data.get("peso_limite")
    modelo = vehiculo_data.get("modelo")
    placa = vehiculo_data.get("placa")

    query = '''CREATE (v:Vehiculo:TransporteLigero {consumo: $consumo, marca: $marca, peso_limite: $peso_limite, id: $id, modelo: $modelo, placa: $placa})
    RETURN v'''

    result = session.run(query, id=id, consumo=consumo, marca=marca, peso_limite=peso_limite, modelo=modelo, placa=placa)

    created_vehiculo_info = []
    for record in result:
        created_vehiculo_info.append(dict(record["v"]))

    return {"response": created_vehiculo_info}

@vehiculo_router.put("/update_vehiculo_transporte_ligero/{id}")
def update_vehiculo_transporte_ligero(id: str, updated_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    consumo = updated_data.get("consumo")
    marca = updated_data.get("marca")
    peso_limite = updated_data.get("peso_limite")
    modelo = updated_data.get("modelo")
    placa = updated_data.get("placa")

    query = '''
    MATCH (v:Vehiculo:TransporteLigero {id: $id})
    SET v.consumo = $consumo, v.marca = $marca, v.peso_limite = $peso_limite, v.modelo = $modelo, v.placa = $placa
    RETURN v
    '''

    result = session.run(query, consumo=consumo, marca=marca, peso_limite=peso_limite, modelo=modelo, placa=placa, id=id)

    updated_vehiculo_info = []
    for record in result:
        updated_vehiculo_info.append(dict(record["v"]))

    return {"response": "node updated"}

@vehiculo_router.delete("/delete_vehiculo_transporte_ligero/{id}")
def delete_vehiculo_transporte_ligero(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    query = '''
    MATCH (v:Vehiculo:TransporteLigero {id: $id})
    DELETE v
    '''

    session.run(query, id=id)

    return {"response": "Vehiculo deleted successfully"}


vehiculo_router_pesado = APIRouter()

@vehiculo_router_pesado.get("/nodes/VehiculoTransportePesado")
def get_vehiculo_transporte_pesado():
    driver_neo4j = connection()
    session = driver_neo4j.session()
    query = f'MATCH (n:Vehiculo:TransportePesado) RETURN n'
    results = session.run(query)
    nodes_info = []
    for row in results:
        node_properties = dict(row["n"])
        nodes_info.append(node_properties)

    return {"response": nodes_info}

@vehiculo_router_pesado.post("/create_vehiculo_transporte_pesado")
def create_vehiculo_transporte_pesado(vehiculo_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    id = str(uuid.uuid4())

    consumo = vehiculo_data.get("consumo")
    marca = vehiculo_data.get("marca")
    peso_limite = vehiculo_data.get("peso_limite")
    modelo = vehiculo_data.get("modelo")
    placa = vehiculo_data.get("placa")

    query = '''CREATE (v:Vehiculo:TransportePesado {consumo: $consumo, marca: $marca, peso_limite: $peso_limite, id: $id, modelo: $modelo, placa: $placa})
    RETURN v'''

    result = session.run(query, id=id, consumo=consumo, marca=marca, peso_limite=peso_limite, modelo=modelo, placa=placa)

    created_vehiculo_info = []
    for record in result:
        created_vehiculo_info.append(dict(record["v"]))

    return {"response": created_vehiculo_info}

@vehiculo_router_pesado.put("/update_vehiculo_transporte_pesado/{id}")
def update_vehiculo_transporte_pesado(id: str, updated_data: dict):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    consumo = updated_data.get("consumo")
    marca = updated_data.get("marca")
    peso_limite = updated_data.get("peso_limite")
    modelo = updated_data.get("modelo")
    placa = updated_data.get("placa")

    query = '''
    MATCH (v:Vehiculo:TransportePesado {id: $id})
    SET v.consumo = $consumo, v.marca = $marca, v.peso_limite = $peso_limite, v.modelo = $modelo, v.placa = $placa
    RETURN v
    '''

    result = session.run(query, consumo=consumo, marca=marca, peso_limite=peso_limite, modelo=modelo, placa=placa, id=id)

    updated_vehiculo_info = []
    for record in result:
        updated_vehiculo_info.append(dict(record["v"]))

    return {"response": "node updated"}

@vehiculo_router_pesado.delete("/delete_vehiculo_transporte_pesado/{id}")
def delete_vehiculo_transporte_pesado(id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    query = '''
    MATCH (v:Vehiculo:TransportePesado {id: $id})
    DELETE v
    '''

    session.run(query, id=id)

    return {"response": "Vehiculo deleted successfully"}
