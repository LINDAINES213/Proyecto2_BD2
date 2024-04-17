from typing import List
import uuid
from fastapi import APIRouter
from database.db import connection

delete_relation = APIRouter()

@delete_relation.delete("/delete_relacion/{id}")
def delete_publicidad(id: int):
    driver_neo4j = connection()
    session = driver_neo4j.session()
    

    query = f'''
    MATCH ()-[r]->()
    WHERE ID(r) = {id}
    DELETE r
    '''

    session.run(query, id=id)

    return {"response": "Publicidad deleted successfully"}

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

@delete_relation.delete("/delete_tiene_relations")
def delete_relations_tiene():
    driver_neo4j = connection()
    session = driver_neo4j.session()
    
    query = '''
    MATCH ()-[r:TIENE]->()
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

