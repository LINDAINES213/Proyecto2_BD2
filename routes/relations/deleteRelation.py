from typing import List
import uuid
from fastapi import APIRouter
from database.db import connection

delete_relation = APIRouter()
@delete_relation.delete("/delete_tiene_relation/{relation_id}")
def delete_publicidad(relation_id: int):
    driver_neo4j = connection()
    session = driver_neo4j.session()

    # Se asume que la propiedad 'id' está indexada para una búsqueda más rápida
    query = '''
    MATCH ()-[r:TIENE]->()
    WHERE ID(r) = $relation_id
    DELETE r
    '''

    session.run(query, relation_id=relation_id)

    return {"response": f"Relation with ID {relation_id} deleted successfully"}


@delete_relation.delete("/delete_brindar_informacion_relations")
def delete_relations_bi():
    driver_neo4j = connection()
    session = driver_neo4j.session()
    
    query = '''
    MATCH ()-[r:BRINDA_INFORMACION]->()
    RETURN r
    LIMIT 5
    '''

    result = session.run(query)

    for record in result:
        relation_id = record["r"].id
        delete_query = f'''
        MATCH ()-[r]->()
        WHERE ID(r) = {relation_id}
        DELETE r
        '''
        session.run(delete_query)

    return {"response": "First five relations with specified label deleted successfully"}

@delete_relation.delete("/delete_tiene_relations/{proveedor_id}")
def delete_tiene_relations(proveedor_id: str):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    
    query = """
    MATCH (p:Proveedor)-[r:TIENE]->()
    WHERE p.id = $proveedor_id
    DELETE r
    """

    # Ejecuta la consulta Cypher
    result = session.run(query, proveedor_id=proveedor_id)

    # Verifica si se eliminaron relaciones
    if result.consume().counters.relationships_deleted > 0:
        return {"message": f"Se eliminaron todas las relaciones TIENE del proveedor con ID {proveedor_id}"}
    else:
        return {"message": f"No se encontraron relaciones TIENE para el proveedor con ID {proveedor_id}"}

