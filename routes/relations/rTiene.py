from http.client import HTTPException
from fastapi import APIRouter
from database.db import connection
from datetime import datetime

# Definir un enrutador de API para la sección de usuarios
tiene = APIRouter()

@tiene.get("/relation/Tiene")
def get_personal():
    driver_neo4j = connection()
    
    # Consulta Cypher para obtener nodos y relaciones
    query = """
    MATCH (p:Proveedor)-[r:TIENE]->(o:Producto)
    RETURN p, r, o
    """
    
    with driver_neo4j.session() as session:
        results = session.run(query)
        nodes_info = []
        
        for row in results:
            # Obtener las propiedades de los nodos y las relaciones
            node_properties = dict(row["p"])
            relation_properties = dict(row["r"])
            property_properties = dict(row["o"])
            
            # Agregar información de los nodos y las relaciones
            nodes_info.append({
                "Producto": node_properties,
                "TIENE": relation_properties,
                "Proveedor": property_properties
            })

    return {"response": nodes_info}

@tiene.post("/relation/create_tiene_relation")
def create_tiene_relation(data: dict):
    driver_neo4j = connection()

    producto_id = data.get("producto_id")
    proveedor_id = data.get("proveedor_id")

    # Propiedades adicionales para la relación TIENE
    disponibilidad = data.get("disponibilidad")
    tipo_de_producto = data.get("tipo_de_producto")
    fecha_de_produccion = data.get("fecha_de_produccion")
    fecha_de_produccion = datetime.strptime(fecha_de_produccion, "%Y-%m-%d").strftime("%Y-%m-%d")

    if disponibilidad in ['true', 'True', 'disponible', 'no disponible', 'Disponible', 'No disponible']:
        disponibilidad = True
    else:
        disponibilidad = False

    if not producto_id or not proveedor_id:
        raise HTTPException(status_code=400, detail="Los campos producto_id y proveedor_id son obligatorios")
    
    # Consulta Cypher para crear la relación TIENE
    query = f"""
    MATCH (p:Proveedor), (o:Producto)
    WHERE p.id = '{proveedor_id}' AND o.id = '{producto_id}'
    CREATE (p)-[:TIENE {{disponibilidad: {disponibilidad}, tipo_de_producto: '{tipo_de_producto}', fecha_de_produccion: date("{fecha_de_produccion}")}}]->(o)
    """
    
    with driver_neo4j.session() as session:
        session.run(query)
    
    return {"message": "Relación TIENE creada correctamente"}