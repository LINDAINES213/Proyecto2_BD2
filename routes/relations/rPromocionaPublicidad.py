from http.client import HTTPException
from fastapi import APIRouter
from database.db import connection
from datetime import datetime

# Definir un enrutador de API para la sección de usuarios
promociona_publicidad_r = APIRouter()

@promociona_publicidad_r.get("/relation/PromocionaPublicidad")
def get_relation():
    driver_neo4j = connection()
    
    # Consulta Cypher para obtener nodos y relaciones
    query = """
    MATCH (p:Personal)-[r:PROMOCIONA_PUBLICIDAD]->(u:Publicidad)
    RETURN p, r, u
    """
    
    with driver_neo4j.session() as session:
        results = session.run(query)
        nodes_info = []
        
        for row in results:
            # Obtener las propiedades de los nodos y las relaciones
            node_properties = dict(row["p"])
            relation_properties = dict(row["r"])
            property_properties = dict(row["u"])
            
            # Agregar información de los nodos y las relaciones
            nodes_info.append({
                "PERSONAL": node_properties,
                "PROMOCIONA_PUBLICIDAD": relation_properties,
                "PUBLICIDAD": property_properties
            })

    return {"response": nodes_info}

@promociona_publicidad_r.post("/relation/create_promocionar_publicidad_relation")
def create_tiene_relation(data: dict):
    driver_neo4j = connection()

    publicidad_id = data.get("publicidad_id")
    personal_id = data.get("personal_id")

    # Propiedades adicionales para la relación TIENE
    trabajo_a_realizar = data.get("trabajo_a_realizar")
    tiempo_asignado = data.get("tiempo_asignado")
    fecha_asignado = data.get("fecha_asignado")
    fecha_asignado = datetime.strptime(fecha_asignado, "%Y-%m-%d").strftime("%Y-%m-%d")

    if not publicidad_id or not personal_id:
        raise HTTPException(status_code=400, detail="Los campos publicidad_id y personal_id son obligatorios")
    
    # Consulta Cypher para crear la relación TIENE
    query = f"""
    MATCH (p:Personal), (u:Publicidad)
    WHERE p.id = '{personal_id}' AND u.id = '{publicidad_id}'
    CREATE (p)-[:PROMOCIONA_PUBLICIDAD {{trabajo_a_realizar: '{trabajo_a_realizar}', tiempo_asignado: {tiempo_asignado}, fecha_asignado: date("{fecha_asignado}")}}]->(u)
    """
    
    with driver_neo4j.session() as session:
        session.run(query)
    
    return {"message": "Relación PROMOCIONAR PUBLICIDAD creada correctamente"}
