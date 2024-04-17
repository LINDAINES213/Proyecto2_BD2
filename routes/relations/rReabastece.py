from http.client import HTTPException
from fastapi import APIRouter
from database.db import connection
from datetime import datetime

# Definir un enrutador de API para la sección de usuarios
reabastece_r = APIRouter()

@reabastece_r.get("/relation/Reabastece")
def get_relation():
    driver_neo4j = connection()
    
    # Consulta Cypher para obtener nodos y relaciones
    query = """
    MATCH (p:Proveedor)-[r:REABASTECE]->(a:Almacen)
    RETURN p, r, a
    """

    with driver_neo4j.session() as session:
        results = session.run(query)
        nodes_info = []
        
        for row in results:
            # Obtener las propiedades de los nodos y las relaciones
            node_properties = dict(row["p"])
            relation_properties = dict(row["r"])
            property_properties = dict(row["a"])
            
            # Extraer el ID interno de la relación
            relation_id = row['r'].id  # Obtiene el ID interno de Neo4j para la relación

            # Agregar información de los nodos y las relaciones incluyendo el ID de la relación
            nodes_info.append({
                "PROVEEDOR": node_properties,
                "REABASTECE": {
                    **relation_properties,
                    "id": str(relation_id)  # Agrega el ID de la relación
                },
                "ALMACEN": property_properties
            })

    return {"response": nodes_info}

@reabastece_r.post("/relation/create_reabastece_relation")
def create_tiene_relation(data: dict):
    driver_neo4j = connection()

    almacen_id = data.get("almacen_id")
    proveedor_id = data.get("proveedor_id")

    # Propiedades adicionales para la relación TIENE
    monto = data.get("monto")
    calidad_del_producto = data.get("calidad_del_producto")
    fecha_de_reabastecimiento = data.get("fecha_de_reabastecimiento")
    fecha_de_reabastecimiento = datetime.strptime(fecha_de_reabastecimiento, "%Y-%m-%d").strftime("%Y-%m-%d")

    if not almacen_id or not proveedor_id:
        raise HTTPException(status_code=400, detail="Los campos almacen_id y proveedor_id son obligatorios")
    
    # Consulta Cypher para crear la relación TIENE
    query = f"""
    MATCH (p:Proveedor), (a:Almacen)
    WHERE p.id = '{proveedor_id}' AND a.id = '{almacen_id}'
    CREATE (p)-[:REABASTECE {{monto: {monto}, calidad_del_producto: '{calidad_del_producto}', fecha_de_reabastecimiento: date("{fecha_de_reabastecimiento}")}}]->(a)
    """
    
    with driver_neo4j.session() as session:
        session.run(query)
    
    return {"message": "Relación REABASTECE creada correctamente"}

@reabastece_r.get("/get_relation_reabastece/{id}")
def get_reabastece(id: int):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    
    # Consulta Cypher para obtener los datos del cliente por su ID
    query = f"""MATCH ()-[n:REABASTECE]->() WHERE ID(n) = $id 
    RETURN n.monto AS monto, n.calidad_del_producto AS calidad_del_producto, n.fecha_de_reabastecimiento AS fecha_de_reabastecimiento"""
    
    # Ejecutar la consulta Cypher
    results = session.run(query, id=id)
    
    # Obtener los datos del cliente del resultado de la consulta
    cliente_data = results.single()

    # Verificar si se encontraron datos para el cliente
    if cliente_data:
        # Convertir el resultado a un diccionario
        cliente_dict = dict(cliente_data)
        return cliente_dict
    else:
        return {"error": "Cliente no encontrado"}