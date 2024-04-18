from ast import List
from http.client import HTTPException
from fastapi import APIRouter
from database.db import connection
from datetime import datetime
from typing import List

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
            
            # Extraer el ID interno de la relación
            relation_id = row['r'].id  # Obtiene el ID interno de Neo4j para la relación

            # Agregar información de los nodos y las relaciones incluyendo el ID de la relación
            nodes_info.append({
                "Proveedor": node_properties,
                "TIENE": {
                    **relation_properties,
                    "id": str(relation_id)  # Agrega el ID de la relación
                },
                "Producto": property_properties
            })

    return {"response": nodes_info}

@tiene.post("/relation/create_tiene_relation")
def create_tiene_relation(data: dict):
    driver_neo4j = connection()

    proveedor_id = data.get("proveedor_id")
    lista_productos = data.get("productos", [])  # Lista de IDs de productos

    # Propiedades adicionales para la relación TIENE
    disponibilidad = data.get("disponibilidad")
    tipo_de_producto = data.get("tipo_de_producto")
    fecha_de_produccion = data.get("fecha_de_produccion")
    fecha_de_produccion = datetime.strptime(fecha_de_produccion, "%Y-%m-%d").strftime("%Y-%m-%d")

    if not proveedor_id:
        raise HTTPException(status_code=400, detail="El campo proveedor_id es obligatorio")
    
    if not lista_productos:
        raise HTTPException(status_code=400, detail="La lista de productos no puede estar vacía")

    if disponibilidad in ["Disponible", "disponible", "True", "true", "t"]:
        disponibilidad = True
    else:
        disponibilidad = False
    # Consulta Cypher para crear las relaciones TIENE
    query = f"""
    MATCH (p:Proveedor)
    WHERE p.id = '{proveedor_id}'
    WITH p
    UNWIND $productos AS producto_id
    MATCH (o:Producto)
    WHERE o.id = producto_id
    CREATE (p)-[:TIENE {{disponibilidad: {disponibilidad}, tipo_de_producto: '{tipo_de_producto}', fecha_de_produccion: date("{fecha_de_produccion}")}}]->(o)
    """
    
    with driver_neo4j.session() as session:
        session.run(query, productos=lista_productos)
    
    return {"message": "Relaciones TIENE creadas correctamente para los productos especificados"}

@tiene.put("/relation/update_tiene_relation")
def update_tiene_relation(updated_data_list: List[dict]):
    driver_neo4j = connection()

    # Iterar sobre cada diccionario en la lista de datos actualizados
    for updated_data in updated_data_list:
        proveedor_id = updated_data.get("proveedor_id")
        lista_productos = updated_data.get("productos", [])  # Lista de IDs de productos

        # Propiedades a actualizar
        nuevas_propiedades = {
            "disponibilidad": updated_data.get("disponibilidad"),
            "tipo_de_producto": updated_data.get("tipo_de_producto"),
            "fecha_de_produccion": updated_data.get("fecha_de_produccion")
        }

        # Convertir fecha_de_produccion al formato deseado
        nuevas_propiedades["fecha_de_produccion"] = datetime.strptime(nuevas_propiedades["fecha_de_produccion"], "%Y-%m-%d").strftime("%Y-%m-%d")

        if not lista_productos:
            raise HTTPException(status_code=400, detail=f"La lista de productos para el proveedor {proveedor_id} no puede estar vacía")

        # Construir y ejecutar la consulta Cypher para actualizar las relaciones TIENE
        query = f"""
        MATCH (p:Proveedor)-[r:TIENE]->(o:Producto)
        WHERE p.id = '{proveedor_id}' AND o.id IN $productos
        SET r += $nuevas_propiedades
        """
        
        with driver_neo4j.session() as session:
            session.run(query, nuevas_propiedades=nuevas_propiedades, productos=lista_productos)

    return {"message": "Propiedades de las relaciones TIENE actualizadas correctamente"}