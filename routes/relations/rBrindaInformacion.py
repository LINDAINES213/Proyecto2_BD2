from http.client import HTTPException
from fastapi import APIRouter
from database.db import connection
from datetime import datetime

# Definir un enrutador de API para la sección de usuarios
brinda_info_r = APIRouter()

@brinda_info_r.get("/relation/BrindaInformacion")
def get_relation():
    driver_neo4j = connection()
    
    # Consulta Cypher para obtener nodos y relaciones
    query = """
    MATCH (a:Almacen)-[r:BRINDA_INFORMACION]->(p:Publicidad)
    RETURN a, r, p
    """
    
    with driver_neo4j.session() as session:
        results = session.run(query)
        nodes_info = []
        
        for row in results:
            # Obtener las propiedades de los nodos y las relaciones
            node_properties = dict(row["a"])
            relation_properties = dict(row["r"])
            property_properties = dict(row["p"])
            
            # Agregar información de los nodos y las relaciones
            nodes_info.append({
                "ALMACEN": node_properties,
                "BRINDA_INFORMACION": relation_properties,
                "PUBLICIDAD": property_properties
            })

    return {"response": nodes_info}

@brinda_info_r.post("/relation/create_brinda_informacion_relation")
def create_tiene_relation(data: dict):
    driver_neo4j = connection()

    almacen_id = data.get("almacen_id")
    publicidad_id = data.get("publicidad_id")

    # Propiedades adicionales para la relación TIENE
    presupuesto = data.get("presupuesto")
    solicitud = data.get("solicitud")
    fecha_brindada = data.get("fecha_brindada")
    fecha_brindada = datetime.strptime(fecha_brindada, "%Y-%m-%d").strftime("%Y-%m-%d")

    if not almacen_id or not publicidad_id:
        raise HTTPException(status_code=400, detail="Los campos almacen_id y publicidad_id son obligatorios")
    
    # Consulta Cypher para crear la relación TIENE
    query = f"""
    MATCH (p:Publicidad), (a:Almacen)
    WHERE p.id = '{publicidad_id}' AND a.id = '{almacen_id}'
    CREATE (a)-[:BRINDA_INFORMACION {{presupuesto: {presupuesto}, solicitud: '{solicitud}', fecha_brindada: date("{fecha_brindada}")}}]->(p)
    """
    
    with driver_neo4j.session() as session:
        session.run(query)
    
    return {"message": "Relación BRINDA INFORMACION creada correctamente"}