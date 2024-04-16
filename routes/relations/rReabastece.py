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
            
            # Agregar información de los nodos y las relaciones
            nodes_info.append({
                "PROVEEDOR": node_properties,
                "REABASTECE": relation_properties,
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