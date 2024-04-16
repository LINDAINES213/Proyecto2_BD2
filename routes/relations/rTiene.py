from fastapi import APIRouter
from database.db import connection

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